import 'server-only';

import { BetaAnalyticsDataClient, type protos } from '@google-analytics/data';
import { GoogleAuth, JWT } from 'google-auth-library';

import { getServerEnv } from '@/shared/util/serverEnv';

import {
    ANALYTICS_EXCLUDED_PATH_PREFIX,
    ANALYTICS_PLAN_PATH_PREFIX,
    ANALYTICS_PROJECT_PATH_PREFIX,
} from '../model/analytics.constants';
import type {
    AnalyticsDailyResponse,
    AnalyticsDateRange,
    AnalyticsPageResponse,
    AnalyticsTotalsResponse,
} from '../model/analytics.types';

export interface AnalyticsRepository {
    /**
     * 구간마다의 합계를 받는다. 관리 화면의 주소는 뺀다
     * @param ranges - 물을 구간. 순서가 rangeIndex 가 된다
     * @returns 값이 있는 구간만 온다. 값이 없는 구간은 빠진다
     * @throws GA 속성 id 가 없거나 GA 에 닿지 못했을 때
     * @see {@link AnalyticsTotalsResponse}
     */
    getTotalsList(ranges: readonly AnalyticsDateRange[]): Promise<AnalyticsTotalsResponse[]>;

    /**
     * 날짜마다의 방문자와 조회수를 받는다. 관리 화면의 주소는 뺀다
     * @returns 값이 있는 날만 온다. 순서는 정해져 있지 않다
     * @throws GA 속성 id 가 없거나 GA 에 닿지 못했을 때
     * @see {@link AnalyticsDailyResponse}
     */
    getDailyList(range: AnalyticsDateRange): Promise<AnalyticsDailyResponse[]>;

    /**
     * 주소가 paths 와 똑같은 페이지의 값을 받는다
     * @param paths - 셀 주소
     * @returns 조회가 있는 주소만 온다
     * @throws GA 속성 id 가 없거나 GA 에 닿지 못했을 때
     * @see {@link AnalyticsPageResponse}
     */
    getPageList(
        range: AnalyticsDateRange,
        paths: readonly string[],
    ): Promise<AnalyticsPageResponse[]>;

    /**
     * 프로젝트 상세(/project/<id>)의 값을 주소마다 받는다
     * @returns 조회가 있는 주소만 온다
     * @throws GA 속성 id 가 없거나 GA 에 닿지 못했을 때
     * @see {@link AnalyticsPageResponse}
     */
    getProjectPageList(range: AnalyticsDateRange): Promise<AnalyticsPageResponse[]>;

    /**
     * 기획 뷰어에서 본 문서(/plan/<기획 폴더>)의 값을 주소마다 받는다
     * @returns 조회가 있는 주소만 온다
     * @throws GA 속성 id 가 없거나 GA 에 닿지 못했을 때
     * @see {@link AnalyticsPageResponse}
     */
    getPlanPageList(range: AnalyticsDateRange): Promise<AnalyticsPageResponse[]>;

    /**
     * 최근 30분에 사이트를 본 사람 수를 받는다. GA 의 실시간 보고서를 읽는다.
     * 실시간 보고서에는 주소 차원이 없어 관리 화면의 주소를 빼지 못한다
     * @returns 본 사람이 없으면 0
     * @throws GA 속성 id 가 없거나 GA 에 닿지 못했을 때
     */
    getRealtimeActiveUsers(): Promise<number>;
}

type ReportRequest = protos.google.analytics.data.v1beta.IRunReportRequest;
type ReportRow = protos.google.analytics.data.v1beta.IRow;
type FilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

/** 프로젝트와 기획 문서가 늘어도 넉넉한 줄 수. GA 의 처음 값은 10,000 줄이다 */
const PAGE_ROW_LIMIT = 500;

/** GA 가 구간에 붙이는 이름의 앞부분. 뒤에 물은 순서가 붙는다 */
const DATE_RANGE_NAME_PREFIX = 'date_range_';

const PAGE_METRICS = [
    { name: 'screenPageViews' },
    { name: 'sessions' },
    { name: 'userEngagementDuration' },
];

let client: BetaAnalyticsDataClient | null = null;

/** GA 를 읽기만 하는 권한 범위 */
const ANALYTICS_READONLY_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

/**
 * GA Data API 클라이언트. Firebase 서비스 계정으로 부른다. GA 속성에 이 계정을 뷰어로 더해 둔다.
 * 계정은 authClient 로 넘긴다. credentials 옵션으로 넘기면 인증 라이브러리가 호출마다 폐기 경고를 찍는다.
 * (node_modules 의 google-auth-library/build/src/auth/googleauth.js)
 */
function getClient(): BetaAnalyticsDataClient {
    if (!client) {
        const env = getServerEnv();
        const authClient = new JWT({
            email: env.FIREBASE_CLIENT_EMAIL,
            key: env.FIREBASE_PRIVATE_KEY,
            scopes: [ANALYTICS_READONLY_SCOPE],
        });
        client = new BetaAnalyticsDataClient({
            auth: new GoogleAuth({ authClient, projectId: env.FIREBASE_PROJECT_ID }),
        });
    }
    return client;
}

async function runReport(request: Omit<ReportRequest, 'property'>): Promise<ReportRow[]> {
    const [response] = await getClient().runReport({
        ...request,
        property: getPropertyName(),
    });
    return response.rows ?? [];
}

function getPropertyName(): string {
    const propertyId = getServerEnv().GA_PROPERTY_ID;
    if (!propertyId) {
        throw new Error('GA_PROPERTY_ID 가 없어 통계를 받을 수 없다');
    }
    return `properties/${propertyId}`;
}

function getDimension(row: ReportRow, index: number): string {
    return row.dimensionValues?.[index]?.value ?? '';
}

function getMetric(row: ReportRow, index: number): number {
    return Number(row.metricValues?.[index]?.value ?? 0);
}

function toPageResponse(row: ReportRow): AnalyticsPageResponse {
    return {
        path: getDimension(row, 0),
        pageViews: getMetric(row, 0),
        sessions: getMetric(row, 1),
        engagementSeconds: getMetric(row, 2),
    };
}

/** 관리 화면의 주소를 뺀다. 공개 화면에서 관리 화면으로 옮겨 간 방문은 추적 코드가 남아 함께 모인다 */
const EXCLUDE_ADMIN_FILTER: FilterExpression = {
    notExpression: {
        filter: {
            fieldName: 'pagePath',
            stringFilter: { matchType: 'BEGINS_WITH', value: ANALYTICS_EXCLUDED_PATH_PREFIX },
        },
    },
};

/** 주소가 prefix 로 시작하는 페이지의 값을 주소마다 받는다 */
async function runPrefixReport(
    range: AnalyticsDateRange,
    prefix: string,
): Promise<AnalyticsPageResponse[]> {
    const rows = await runReport({
        dateRanges: [range],
        dimensions: [{ name: 'pagePath' }],
        metrics: PAGE_METRICS,
        dimensionFilter: {
            filter: {
                fieldName: 'pagePath',
                stringFilter: { matchType: 'BEGINS_WITH', value: prefix },
            },
        },
        limit: PAGE_ROW_LIMIT,
    });
    return rows.map(toPageResponse);
}

export const analyticsRepository: AnalyticsRepository = {
    async getTotalsList(ranges) {
        const rows = await runReport({
            dateRanges: [...ranges],
            metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'screenPageViews' },
                { name: 'userEngagementDuration' },
            ],
            dimensionFilter: EXCLUDE_ADMIN_FILTER,
        });
        // 구간이 2개 이상이면 GA 가 구간의 이름(date_range_0 · date_range_1)을 차원으로 붙인다. 1개면 붙이지 않는다
        return rows.map((row) => ({
            rangeIndex: Number(getDimension(row, 0).replace(DATE_RANGE_NAME_PREFIX, '') || 0),
            activeUsers: getMetric(row, 0),
            sessions: getMetric(row, 1),
            pageViews: getMetric(row, 2),
            engagementSeconds: getMetric(row, 3),
        }));
    },

    async getDailyList(range) {
        const rows = await runReport({
            dateRanges: [range],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
            dimensionFilter: EXCLUDE_ADMIN_FILTER,
        });
        return rows.map((row) => ({
            date: getDimension(row, 0),
            activeUsers: getMetric(row, 0),
            pageViews: getMetric(row, 1),
        }));
    },

    async getPageList(range, paths) {
        const rows = await runReport({
            dateRanges: [range],
            dimensions: [{ name: 'pagePath' }],
            metrics: PAGE_METRICS,
            dimensionFilter: {
                filter: { fieldName: 'pagePath', inListFilter: { values: [...paths] } },
            },
        });
        return rows.map(toPageResponse);
    },

    async getProjectPageList(range) {
        return runPrefixReport(range, ANALYTICS_PROJECT_PATH_PREFIX);
    },

    async getPlanPageList(range) {
        return runPrefixReport(range, ANALYTICS_PLAN_PATH_PREFIX);
    },

    async getRealtimeActiveUsers() {
        // 구간을 주지 않으면 GA 가 최근 30분을 센다. 본 사람이 없으면 줄이 오지 않는다
        const [response] = await getClient().runRealtimeReport({
            property: getPropertyName(),
            metrics: [{ name: 'activeUsers' }],
        });
        const [row] = response.rows ?? [];
        return row ? getMetric(row, 0) : 0;
    },
};
