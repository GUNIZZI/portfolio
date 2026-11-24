import { ANALYTICS_REFRESH_STATUS, ANALYTICS_TREND } from '../../model/analytics.types';
import type { AnalyticsRepository } from '../../repositories/analytics.repositories';
import {
    checkAnalyticsRefresh,
    getAnalyticsRealtime,
    getAnalyticsSummary,
    parseAnalyticsPeriodDays,
    toAnalyticsPeriod,
    toChangeData,
    toDurationText,
    toPageViewList,
    toProjectViewList,
    toSummaryData,
    toTrendData,
} from '../analytics.services';

const repository = vi.hoisted(() => ({
    getTotalsList: vi.fn<AnalyticsRepository['getTotalsList']>(),
    getDailyList: vi.fn<AnalyticsRepository['getDailyList']>(),
    getPageList: vi.fn<AnalyticsRepository['getPageList']>(),
    getProjectPageList: vi.fn<AnalyticsRepository['getProjectPageList']>(),
    getRealtimeActiveUsers: vi.fn<AnalyticsRepository['getRealtimeActiveUsers']>(),
}));

vi.mock('../../repositories/analytics.repositories', () => ({
    analyticsRepository: repository,
}));
vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock('@/shared/util/serverEnv', () => ({ getServerEnv: () => ({ GA_PROPERTY_ID: '1' }) }));

beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

describe('parseAnalyticsPeriodDays', () => {
    it('7 · 30 · 90 은 그대로 읽는다', () => {
        expect(parseAnalyticsPeriodDays('7')).toBe(7);
        expect(parseAnalyticsPeriodDays('30')).toBe(30);
        expect(parseAnalyticsPeriodDays('90')).toBe(90);
    });

    it('없거나 3가지가 아닌 값이면 30일이다', () => {
        expect(parseAnalyticsPeriodDays(undefined)).toBe(30);
        expect(parseAnalyticsPeriodDays('14')).toBe(30);
        expect(parseAnalyticsPeriodDays('abc')).toBe(30);
        expect(parseAnalyticsPeriodDays(['7', '90'])).toBe(30);
    });
});

describe('toAnalyticsPeriod', () => {
    // 한국 시각으로 2026.11.17 (10:12) 이다
    const NOW = new Date('2026-11-17T01:12:00Z');

    it('오늘을 뺀 최근 30일과 그 앞의 30일을 정한다', () => {
        const period = toAnalyticsPeriod(30, NOW);
        expect(period.current).toEqual({ startDate: '2026-10-18', endDate: '2026-11-16' });
        expect(period.previous).toEqual({ startDate: '2026-09-18', endDate: '2026-10-17' });
        expect(period.rangeText).toBe('2026.10.18 ~ 2026.11.16');
        expect(period.fetchedAtText).toBe('2026.11.17 (10:12)');
    });

    it('오늘이 며칠인지는 한국 시각으로 따진다', () => {
        // UTC 로는 16일이지만 한국은 17일 새벽이다
        const period = toAnalyticsPeriod(7, new Date('2026-11-16T16:00:00Z'));
        expect(period.current).toEqual({ startDate: '2026-11-10', endDate: '2026-11-16' });
    });
});

describe('toChangeData', () => {
    it('오르고 내린 비율을 기호와 함께 적는다', () => {
        expect(toChangeData(112, 100)).toEqual({ trend: ANALYTICS_TREND.UP, text: '▲ 12%' });
        expect(toChangeData(97, 100)).toEqual({ trend: ANALYTICS_TREND.DOWN, text: '▼ 3%' });
        expect(toChangeData(100, 100)).toEqual({ trend: ANALYTICS_TREND.FLAT, text: '0%' });
    });

    it('직전 기간의 값이 0이면 비율 대신 — 를 적는다', () => {
        expect(toChangeData(5, 0)).toEqual({ trend: ANALYTICS_TREND.NONE, text: '—' });
    });
});

describe('toDurationText', () => {
    it('분과 초로 적고, 1분이 넘으면 초를 2자리로 맞춘다', () => {
        expect(toDurationText(130)).toBe('2분 10초');
        expect(toDurationText(65)).toBe('1분 05초');
        expect(toDurationText(42)).toBe('42초');
        expect(toDurationText(0)).toBe('0초');
    });
});

describe('toSummaryData', () => {
    it('고른 기간의 값과 직전 기간 대비 증감을 낸다', () => {
        const summary = toSummaryData([
            {
                rangeIndex: 1,
                activeUsers: 100,
                sessions: 160,
                pageViews: 560,
                engagementSeconds: 16000,
            },
            {
                rangeIndex: 0,
                activeUsers: 128,
                sessions: 173,
                pageViews: 542,
                engagementSeconds: 17646,
            },
        ]);
        expect(summary.visitors).toEqual({
            value: 128,
            change: { trend: ANALYTICS_TREND.UP, text: '▲ 28%' },
        });
        expect(summary.pageViews.change.text).toBe('▼ 3%');
        // 17646초 / 173번 = 102초
        expect(summary.engagement.value).toBe(102);
        expect(summary.engagement.durationText).toBe('1분 42초');
    });

    it('값이 없는 구간은 0으로 본다', () => {
        const summary = toSummaryData([]);
        expect(summary.visitors.value).toBe(0);
        expect(summary.visitors.change.text).toBe('—');
        expect(summary.engagement.durationText).toBe('0초');
    });
});

describe('toTrendData', () => {
    const RANGE = { startDate: '2026-10-30', endDate: '2026-11-02' };

    it('값이 없는 날을 0으로 채우고 날짜 순으로 놓는다', () => {
        const trend = toTrendData(RANGE, [
            { date: '20261101', activeUsers: 3, pageViews: 9 },
            { date: '20261030', activeUsers: 1, pageViews: 2 },
        ]);
        expect(trend.days).toEqual([
            { date: '2026-10-30', dateText: '10.30', visitors: 1, pageViews: 2 },
            { date: '2026-10-31', dateText: '10.31', visitors: 0, pageViews: 0 },
            { date: '2026-11-01', dateText: '11.01', visitors: 3, pageViews: 9 },
            { date: '2026-11-02', dateText: '11.02', visitors: 0, pageViews: 0 },
        ]);
        expect(trend.isEmpty).toBe(false);
    });

    it('모인 값이 하나도 없으면 빈 상태다', () => {
        expect(toTrendData(RANGE, []).isEmpty).toBe(true);
    });
});

describe('toPageViewList', () => {
    const page = (path: string, pageViews: number) => ({
        path,
        pageViews,
        sessions: 0,
        engagementSeconds: 0,
    });

    it('메뉴 4개를 조회수가 많은 순으로 놓고 비율을 적는다', () => {
        const list = toPageViewList([page('/about', 25), page('/', 75)]);
        expect(list.map((row) => row.path)).toEqual(['/', '/about', '/work', '/colophon']);
        expect(list.map((row) => row.shareText)).toEqual(['75%', '25%', '0%', '0%']);
    });

    it('조회가 하나도 없으면 비율 대신 — 를 적는다', () => {
        expect(toPageViewList([]).every((row) => row.shareText === '—')).toBe(true);
    });
});

describe('toProjectViewList', () => {
    it('주소를 프로젝트의 id 로 바꾸고 같은 프로젝트의 주소를 합친다', () => {
        const list = toProjectViewList([
            { path: '/work/a', pageViews: 50, sessions: 20, engagementSeconds: 2000 },
            { path: '/work/a/', pageViews: 8, sessions: 5, engagementSeconds: 1250 },
            { path: '/work/b', pageViews: 3, sessions: 0, engagementSeconds: 0 },
        ]);
        expect(list).toEqual([
            // 3250초 / 25번 = 130초
            { projectId: 'a', pageViews: 58, durationText: '2분 10초' },
            { projectId: 'b', pageViews: 3, durationText: null },
        ]);
    });

    it('상세보다 깊은 주소와 id 가 없는 주소는 뺀다', () => {
        const list = toProjectViewList([
            { path: '/work/', pageViews: 1, sessions: 1, engagementSeconds: 1 },
            { path: '/work/a/edit', pageViews: 1, sessions: 1, engagementSeconds: 1 },
        ]);
        expect(list).toEqual([]);
    });
});

describe('getAnalyticsSummary', () => {
    it('고른 기간과 직전 기간을 함께 묻는다', async () => {
        repository.getTotalsList.mockResolvedValue([]);
        await getAnalyticsSummary(7);
        const [ranges] = repository.getTotalsList.mock.calls[0] ?? [];
        expect(ranges).toHaveLength(2);
    });
});

describe('getAnalyticsRealtime', () => {
    it('최근 30분의 접속자 수를 낸다', async () => {
        repository.getRealtimeActiveUsers.mockResolvedValue(2);
        expect(await getAnalyticsRealtime()).toEqual({ activeUsers: 2 });
    });

    it('접속자가 없으면 0이다', async () => {
        repository.getRealtimeActiveUsers.mockResolvedValue(0);
        expect(await getAnalyticsRealtime()).toEqual({ activeUsers: 0 });
    });

    it('GA 에 닿지 못하면 던진다', async () => {
        repository.getRealtimeActiveUsers.mockRejectedValue(new Error('unavailable'));
        await expect(getAnalyticsRealtime()).rejects.toThrow('unavailable');
    });
});

describe('checkAnalyticsRefresh', () => {
    it('GA 에 닿으면 새로 고쳐도 된다', async () => {
        repository.getTotalsList.mockResolvedValue([]);
        expect(await checkAnalyticsRefresh(30)).toBe(ANALYTICS_REFRESH_STATUS.REFRESHED);
    });

    it('GA 에 닿지 못하면 실패를 낸다. 던지지 않는다', async () => {
        repository.getTotalsList.mockRejectedValue(new Error('unavailable'));
        expect(await checkAnalyticsRefresh(30)).toBe(ANALYTICS_REFRESH_STATUS.FAILED);
    });
});
