import type { AnalyticsPagePath, AnalyticsPeriodDays } from './analytics.constants';

/** GA 에 묻는 날짜 구간. 첫날과 끝날을 모두 넣는다. `2026-11-16` 형식이다 */
export interface AnalyticsDateRange {
    startDate: string;
    endDate: string;
}

/** GA 에서 받은 구간 하나의 합계 */
export interface AnalyticsTotalsResponse {
    /** 물은 구간의 순서. 0 이 고른 기간, 1 이 직전 기간이다 */
    rangeIndex: number;
    activeUsers: number;
    sessions: number;
    pageViews: number;
    /** 화면을 실제로 보고 있던 시간의 합(초) */
    engagementSeconds: number;
}

/** GA 에서 받은 하루의 값. 값이 없는 날은 오지 않는다 */
export interface AnalyticsDailyResponse {
    /** `20261116` 형식 */
    date: string;
    activeUsers: number;
    pageViews: number;
}

/** GA 에서 받은 주소 하나의 값 */
export interface AnalyticsPageResponse {
    /** 페이지 주소. 쿼리는 없다 */
    path: string;
    pageViews: number;
    sessions: number;
    /** 화면을 실제로 보고 있던 시간의 합(초) */
    engagementSeconds: number;
}

/** 값을 받을 때 정한 기간. 한 기간의 모든 블록이 같은 구간을 쓴다 */
export interface AnalyticsPeriodData {
    days: AnalyticsPeriodDays;
    current: AnalyticsDateRange;
    /** 직전 기간. 고른 기간 바로 앞의 같은 길이다 */
    previous: AnalyticsDateRange;
    /** `2026.10.18 ~ 2026.11.16` */
    rangeText: string;
    /** 기준 시각. 2026.11.17 (10:12) 형식 */
    fetchedAtText: string;
}

export const ANALYTICS_TREND = {
    UP: 'UP',
    DOWN: 'DOWN',
    /** 직전 기간과 같다 */
    FLAT: 'FLAT',
    /** 직전 기간의 값이 0이라 견줄 수 없다 */
    NONE: 'NONE',
} as const;
export type AnalyticsTrend = (typeof ANALYTICS_TREND)[keyof typeof ANALYTICS_TREND];

/** 직전 기간 대비 증감. 색으로만 나타내지 않게 기호와 숫자를 함께 적는다 */
export interface AnalyticsChangeData {
    trend: AnalyticsTrend;
    /** `▲ 12%` · `▼ 3%` · `0%` · `—` */
    text: string;
}

/** 요약 카드 하나 */
export interface AnalyticsMetricData {
    value: number;
    change: AnalyticsChangeData;
}

/** 요약 카드 4개 */
export interface AnalyticsSummaryData {
    visitors: AnalyticsMetricData;
    sessions: AnalyticsMetricData;
    pageViews: AnalyticsMetricData;
    /** 평균 참여 시간. 세션 1번의 평균이고 value 는 초다 */
    engagement: AnalyticsMetricData & {
        /** `1분 42초` */
        durationText: string;
    };
}

/** 방문자 추이의 하루 */
export interface AnalyticsTrendDayData {
    /** `2026-11-16` */
    date: string;
    /** `11.16` */
    dateText: string;
    visitors: number;
    pageViews: number;
}

/** 방문자 추이. 기간의 모든 날이 날짜 순으로 있다 */
export interface AnalyticsTrendData {
    days: AnalyticsTrendDayData[];
    /** 기간에 모인 값이 하나도 없는가 */
    isEmpty: boolean;
}

/** 페이지별 조회수의 한 줄 */
export interface AnalyticsPageViewData {
    path: AnalyticsPagePath;
    pageViews: number;
    /** 4개 페이지의 합에서 차지하는 비율 — `58%`. 합이 0이면 `—` */
    shareText: string;
}

/** 프로젝트 상세 하나의 조회수. 제목은 화면이 entity project 와 이어 붙인다 */
export interface AnalyticsProjectViewData {
    projectId: string;
    pageViews: number;
    /** 평균 참여 시간 — `2분 10초`. 세션이 없으면 null */
    durationText: string | null;
}

export const ANALYTICS_REFRESH_STATUS = {
    REFRESHED: 'REFRESHED',
    /** GA 에서 받지 못했다. 간직하던 값은 그대로다 */
    FAILED: 'FAILED',
} as const;
export type AnalyticsRefreshStatus =
    (typeof ANALYTICS_REFRESH_STATUS)[keyof typeof ANALYTICS_REFRESH_STATUS];
