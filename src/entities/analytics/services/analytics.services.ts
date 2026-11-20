import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { toUpdatedAtText } from '@/shared/util/dateText';
import { getServerEnv } from '@/shared/util/serverEnv';

import {
    ANALYTICS_PAGE_PATHS,
    ANALYTICS_PERIOD_DAYS,
    ANALYTICS_PROJECT_PATH_PREFIX,
    type AnalyticsPeriodDays,
    DEFAULT_ANALYTICS_PERIOD_DAYS,
    toAnalyticsCacheTag,
} from '../model/analytics.constants';
import {
    ANALYTICS_REFRESH_STATUS,
    ANALYTICS_TREND,
    type AnalyticsChangeData,
    type AnalyticsDailyResponse,
    type AnalyticsDateRange,
    type AnalyticsPageResponse,
    type AnalyticsPageViewData,
    type AnalyticsPeriodData,
    type AnalyticsProjectViewData,
    type AnalyticsRefreshStatus,
    type AnalyticsSummaryData,
    type AnalyticsTotalsResponse,
    type AnalyticsTrendData,
} from '../model/analytics.types';
import { analyticsRepository } from '../repositories/analytics.repositories';

const DAY_MS = 24 * 60 * 60 * 1000;

/** 오늘이 며칠인지는 한국 시각으로 따진다. GA 속성의 시간대도 한국으로 맞춰 둔다 */
const SEOUL_DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

/**
 * 주소의 기간 값을 읽는다
 * @param value - 주소의 `days`. 없거나 여러 개일 수 있다
 * @returns 7 · 30 · 90 이 아니면 30
 */
export function parseAnalyticsPeriodDays(
    value: string | string[] | undefined,
): AnalyticsPeriodDays {
    const days = ANALYTICS_PERIOD_DAYS.find((item) => String(item) === value);
    return days ?? DEFAULT_ANALYTICS_PERIOD_DAYS;
}

/** `2026-11-16` 에서 offset 일 떨어진 날짜. 날짜만 다루므로 UTC 로 센다 */
function shiftDate(date: string, offset: number): string {
    return new Date(Date.parse(`${date}T00:00:00Z`) + offset * DAY_MS).toISOString().slice(0, 10);
}

function toDotDate(date: string): string {
    return date.replaceAll('-', '.');
}

/**
 * 기간의 구간을 정한다. 오늘은 넣지 않는다. GA 가 오늘 값을 다 모으지 못했기 때문이다.
 * (docs/plan/admin/dashboard/README.md 「기간」)
 * @param now - 값을 받는 시각. 기준 시각이 된다
 */
export function toAnalyticsPeriod(days: AnalyticsPeriodDays, now: Date): AnalyticsPeriodData {
    const endDate = shiftDate(SEOUL_DATE_FORMAT.format(now), -1);
    const startDate = shiftDate(endDate, 1 - days);
    const previousEndDate = shiftDate(startDate, -1);

    return {
        days,
        current: { startDate, endDate },
        previous: { startDate: shiftDate(previousEndDate, 1 - days), endDate: previousEndDate },
        rangeText: `${toDotDate(startDate)} ~ ${toDotDate(endDate)}`,
        fetchedAtText: toUpdatedAtText(now.toISOString()) ?? '',
    };
}

/**
 * 직전 기간 대비 증감을 비율로 적는다
 * @returns 직전 기간의 값이 0이면 견줄 수 없어 「—」 를 낸다
 */
export function toChangeData(current: number, previous: number): AnalyticsChangeData {
    if (previous === 0) {
        return { trend: ANALYTICS_TREND.NONE, text: '—' };
    }
    const rate = Math.round(((current - previous) / previous) * 100);
    if (rate > 0) {
        return { trend: ANALYTICS_TREND.UP, text: `▲ ${rate}%` };
    }
    if (rate < 0) {
        return { trend: ANALYTICS_TREND.DOWN, text: `▼ ${-rate}%` };
    }
    return { trend: ANALYTICS_TREND.FLAT, text: '0%' };
}

/** 초를 `2분 10초` · `1분 05초` · `42초` 로 적는다 */
export function toDurationText(seconds: number): string {
    const total = Math.round(seconds);
    const minutes = Math.floor(total / 60);
    const rest = total % 60;
    return minutes > 0 ? `${minutes}분 ${String(rest).padStart(2, '0')}초` : `${rest}초`;
}

/** 세션 1번의 평균 참여 시간(초). 세션이 없으면 0 */
function toAverageSeconds(engagementSeconds: number, sessions: number): number {
    return sessions > 0 ? engagementSeconds / sessions : 0;
}

const EMPTY_TOTALS = { activeUsers: 0, sessions: 0, pageViews: 0, engagementSeconds: 0 };

/**
 * 합계 2개(고른 기간 · 직전 기간)를 요약 카드로 바꾼다
 * @param totalsList - 값이 없는 구간은 빠져 있다. 빠진 구간은 0으로 본다
 */
export function toSummaryData(
    totalsList: readonly AnalyticsTotalsResponse[],
): AnalyticsSummaryData {
    const current = totalsList.find((totals) => totals.rangeIndex === 0) ?? EMPTY_TOTALS;
    const previous = totalsList.find((totals) => totals.rangeIndex === 1) ?? EMPTY_TOTALS;
    const engagement = toAverageSeconds(current.engagementSeconds, current.sessions);
    const previousEngagement = toAverageSeconds(previous.engagementSeconds, previous.sessions);

    return {
        visitors: {
            value: current.activeUsers,
            change: toChangeData(current.activeUsers, previous.activeUsers),
        },
        sessions: {
            value: current.sessions,
            change: toChangeData(current.sessions, previous.sessions),
        },
        pageViews: {
            value: current.pageViews,
            change: toChangeData(current.pageViews, previous.pageViews),
        },
        engagement: {
            value: Math.round(engagement),
            change: toChangeData(Math.round(engagement), Math.round(previousEngagement)),
            durationText: toDurationText(engagement),
        },
    };
}

/**
 * 날짜마다의 값을 기간의 모든 날로 채운다. 값이 없는 날은 0이다
 * @param dailyList - 값이 있는 날만 있다. 날짜는 `20261116` 형식이다
 */
export function toTrendData(
    range: AnalyticsDateRange,
    dailyList: readonly AnalyticsDailyResponse[],
): AnalyticsTrendData {
    const byDate = new Map(dailyList.map((daily) => [daily.date, daily]));
    const days = [];
    for (let date = range.startDate; date <= range.endDate; date = shiftDate(date, 1)) {
        const daily = byDate.get(date.replaceAll('-', ''));
        days.push({
            date,
            dateText: toDotDate(date.slice(5)),
            visitors: daily?.activeUsers ?? 0,
            pageViews: daily?.pageViews ?? 0,
        });
    }
    return { days, isEmpty: days.every((day) => day.visitors === 0 && day.pageViews === 0) };
}

/** 메뉴 4개의 조회수를 많은 순으로 놓는다. 조회가 없는 페이지도 0으로 적는다 */
export function toPageViewList(
    pageList: readonly AnalyticsPageResponse[],
): AnalyticsPageViewData[] {
    const rows = ANALYTICS_PAGE_PATHS.map((path) => ({
        path,
        pageViews: pageList.find((page) => page.path === path)?.pageViews ?? 0,
    }));
    const total = rows.reduce((sum, row) => sum + row.pageViews, 0);

    return rows
        .map((row) => ({
            ...row,
            shareText: total > 0 ? `${Math.round((row.pageViews / total) * 100)}%` : '—',
        }))
        .toSorted((a, b) => b.pageViews - a.pageViews);
}

/**
 * 프로젝트 상세의 주소를 프로젝트의 id 로 바꾼다. 같은 프로젝트의 주소가 여러 개면 합친다.
 * 끝에 `/` 가 붙은 주소가 따로 모일 수 있다
 */
export function toProjectViewList(
    pageList: readonly AnalyticsPageResponse[],
): AnalyticsProjectViewData[] {
    const byId = new Map<string, Omit<AnalyticsPageResponse, 'path'>>();
    for (const page of pageList) {
        const projectId = page.path.slice(ANALYTICS_PROJECT_PATH_PREFIX.length).replace(/\/$/, '');
        // 상세보다 깊은 주소는 프로젝트가 아니다
        if (!projectId || projectId.includes('/')) {
            continue;
        }
        const sum = byId.get(projectId) ?? { pageViews: 0, sessions: 0, engagementSeconds: 0 };
        byId.set(projectId, {
            pageViews: sum.pageViews + page.pageViews,
            sessions: sum.sessions + page.sessions,
            engagementSeconds: sum.engagementSeconds + page.engagementSeconds,
        });
    }

    return [...byId].map(([projectId, sum]) => ({
        projectId,
        pageViews: sum.pageViews,
        durationText:
            sum.sessions > 0
                ? toDurationText(toAverageSeconds(sum.engagementSeconds, sum.sessions))
                : null,
    }));
}

/** GA 속성 id 를 적어 두었는가. 없으면 GA 를 부르지 않고 연결 실패로 그린다 */
export function isAnalyticsConfigured(): boolean {
    return Boolean(getServerEnv().GA_PROPERTY_ID);
}

/**
 * 기간의 구간과 기준 시각을 정해 1시간 간직한다. 그동안 모든 블록이 같은 구간을 쓴다.
 * 새로 고침하면 그 기간의 캐시가 지워져 지금 시각으로 다시 정한다.
 * (docs/plan/admin/dashboard/README.md 「갱신」)
 */
// eslint-disable-next-line @typescript-eslint/require-await -- 'use cache' 는 async 함수에만 붙일 수 있다
export async function getAnalyticsPeriod(days: AnalyticsPeriodDays): Promise<AnalyticsPeriodData> {
    'use cache';
    cacheTag(toAnalyticsCacheTag(days));
    cacheLife('hours');

    return toAnalyticsPeriod(days, new Date());
}

/**
 * 요약 카드. GA 에서 받은 값을 1시간 간직한다. 받지 못해 던진 것은 간직하지 않는다
 * @throws GA 에서 받지 못했을 때
 */
export async function getAnalyticsSummary(
    days: AnalyticsPeriodDays,
): Promise<AnalyticsSummaryData> {
    'use cache';
    cacheTag(toAnalyticsCacheTag(days));
    cacheLife('hours');

    const period = await getAnalyticsPeriod(days);
    return toSummaryData(
        await analyticsRepository.getTotalsList([period.current, period.previous]),
    );
}

/**
 * 방문자 추이
 * @throws GA 에서 받지 못했을 때
 */
export async function getAnalyticsTrend(days: AnalyticsPeriodDays): Promise<AnalyticsTrendData> {
    'use cache';
    cacheTag(toAnalyticsCacheTag(days));
    cacheLife('hours');

    const period = await getAnalyticsPeriod(days);
    return toTrendData(period.current, await analyticsRepository.getDailyList(period.current));
}

/**
 * 페이지별 조회수. 조회수가 많은 순이다
 * @throws GA 에서 받지 못했을 때
 */
export async function getAnalyticsPageViewList(
    days: AnalyticsPeriodDays,
): Promise<AnalyticsPageViewData[]> {
    'use cache';
    cacheTag(toAnalyticsCacheTag(days));
    cacheLife('hours');

    const period = await getAnalyticsPeriod(days);
    return toPageViewList(
        await analyticsRepository.getPageList(period.current, ANALYTICS_PAGE_PATHS),
    );
}

/**
 * 프로젝트별 조회수. 조회가 있는 프로젝트만 있고 순서는 정해져 있지 않다
 * @throws GA 에서 받지 못했을 때
 */
export async function getAnalyticsProjectViewList(
    days: AnalyticsPeriodDays,
): Promise<AnalyticsProjectViewData[]> {
    'use cache';
    cacheTag(toAnalyticsCacheTag(days));
    cacheLife('hours');

    const period = await getAnalyticsPeriod(days);
    return toProjectViewList(await analyticsRepository.getProjectPageList(period.current));
}

/**
 * 새로 고침해도 되는지 GA 를 한 번 불러 확인한다.
 * 받지 못하면 캐시를 지우지 않는다. 지우고 나서 받지 못하면 간직하던 값까지 잃는다.
 * (docs/plan/admin/dashboard/README.md 「받지 못했을 때」)
 */
export async function checkAnalyticsRefresh(
    days: AnalyticsPeriodDays,
): Promise<AnalyticsRefreshStatus> {
    try {
        const period = toAnalyticsPeriod(days, new Date());
        await analyticsRepository.getTotalsList([period.current]);
        return ANALYTICS_REFRESH_STATUS.REFRESHED;
    } catch (error) {
        console.error(error);
        return ANALYTICS_REFRESH_STATUS.FAILED;
    }
}
