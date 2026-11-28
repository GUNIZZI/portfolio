import { toPeriodHref, toPlanViewerHref } from '../dashboard.constants';
import { toPlanViewRowList, toProjectViewRowList, toTrendChart } from '../dashboard.utils';

const PROJECTS = [
    { id: 'a', title: 'A', isPublished: true },
    { id: 'b', title: 'B', isPublished: false },
    { id: 'c', title: 'C', isPublished: true },
];

describe('toProjectViewRowList', () => {
    it('조회수가 많은 순으로 놓고, 조회가 없는 프로젝트도 0으로 적는다', () => {
        const rows = toProjectViewRowList(PROJECTS, [
            { projectId: 'c', pageViews: 31, durationText: '1분 05초' },
        ]);
        expect(rows).toEqual([
            { id: 'c', title: 'C', isPublished: true, pageViews: 31, durationText: '1분 05초' },
            { id: 'a', title: 'A', isPublished: true, pageViews: 0, durationText: null },
            { id: 'b', title: 'B', isPublished: false, pageViews: 0, durationText: null },
        ]);
    });

    it('삭제한 프로젝트의 조회수는 뺀다', () => {
        const rows = toProjectViewRowList(PROJECTS, [
            { projectId: 'gone', pageViews: 99, durationText: null },
        ]);
        expect(rows.map((row) => row.id)).toEqual(['a', 'b', 'c']);
    });
});

describe('toPeriodHref', () => {
    it('30일은 처음 값이라 주소에 적지 않는다', () => {
        expect(toPeriodHref(30)).toBe('/admin/dashboard');
        expect(toPeriodHref(7)).toBe('/admin/dashboard?days=7');
        expect(toPeriodHref(90)).toBe('/admin/dashboard?days=90');
    });
});

/** 11.01 부터 하루씩 이어지는 날. 값을 주지 않은 날은 0이다 */
function toDays(count: number, values: Record<number, [number, number]> = {}) {
    return Array.from({ length: count }, (_, index) => {
        const day = String(index + 1).padStart(2, '0');
        const [visitors, pageViews] = values[index] ?? [0, 0];
        return { date: `2026-11-${day}`, dateText: `11.${day}`, visitors, pageViews };
    });
}

describe('toTrendChart', () => {
    it('첫날은 왼쪽 끝, 마지막 날은 오른쪽 끝에 놓는다', () => {
        const { points } = toTrendChart(toDays(7));
        expect(points.map((point) => point.x)).toEqual([0, 16.67, 33.33, 50, 66.67, 83.33, 100]);
    });

    it('방문자와 조회수는 같은 세로 눈금을 쓴다', () => {
        const { points, yTicks } = toTrendChart(toDays(7, { 2: [12, 231] }));
        expect(yTicks.map((tick) => tick.value)).toEqual([0, 50, 100, 150, 200, 250]);
        expect(yTicks.at(0)?.y).toBe(100);
        expect(yTicks.at(-1)?.y).toBe(0);
        expect(points.at(2)?.visitorsY).toBe(95.2);
        expect(points.at(2)?.pageViewsY).toBe(7.6);
        expect(points.at(0)?.visitorsY).toBe(100);
    });

    it('값이 작아도 눈금은 정수다', () => {
        expect(toTrendChart(toDays(7, { 0: [1, 1] })).yTicks.map((tick) => tick.value)).toEqual([
            0, 1,
        ]);
        expect(toTrendChart(toDays(7, { 0: [3, 7] })).yTicks.map((tick) => tick.value)).toEqual([
            0, 2, 4, 6, 8,
        ]);
    });

    it('값이 모두 0이어도 눈금을 만든다', () => {
        const { points, yTicks } = toTrendChart(toDays(7));
        expect(yTicks.map((tick) => tick.value)).toEqual([0, 1]);
        expect(points.every((point) => point.visitorsY === 100)).toBe(true);
    });

    it('7일은 날짜를 모두 적고, 양 끝은 안쪽으로 붙인다', () => {
        const { xLabels } = toTrendChart(toDays(7));
        expect(xLabels).toHaveLength(7);
        expect(xLabels.at(0)?.align).toBe('start');
        expect(xLabels.at(1)?.align).toBe('center');
        expect(xLabels.at(-1)?.align).toBe('end');
    });

    it('좁은 화면에서는 마지막 날부터 하나 걸러 숨긴다', () => {
        const { xLabels } = toTrendChart(toDays(7));
        expect(xLabels.map((label) => label.isMinor)).toEqual([
            false,
            true,
            false,
            true,
            false,
            true,
            false,
        ]);
    });

    it('30일은 마지막 날부터 5일 간격으로 적는다', () => {
        const { xLabels } = toTrendChart(toDays(30));
        expect(xLabels.map((label) => label.text)).toEqual([
            '11.05',
            '11.10',
            '11.15',
            '11.20',
            '11.25',
            '11.30',
        ]);
    });

    it('90일도 날짜가 7개를 넘지 않고 마지막 날을 적는다', () => {
        const days = toDays(90);
        const { xLabels } = toTrendChart(days);
        expect(xLabels.length).toBeLessThanOrEqual(7);
        expect(xLabels.at(-1)?.text).toBe(days.at(-1)?.dateText);
    });

    it('가장 많은 날을 한 줄로 적는다', () => {
        const { summaryText } = toTrendChart(toDays(7, { 1: [1200, 10], 4: [3, 31] }));
        expect(summaryText).toContain('방문자는 11.02 에 1,200명');
        expect(summaryText).toContain('조회수는 11.05 에 31회');
    });
});

const PLAN_DOCS = [
    { key: 'home', name: '메인 > 홈', route: '/' },
    { key: 'admin/dashboard', name: '관리 > 대시보드', route: '/admin/dashboard' },
] as const;

describe('toPlanViewRowList', () => {
    it('조회수가 많은 순으로 놓고, 조회가 없는 문서도 0으로 적는다', () => {
        const rows = toPlanViewRowList(PLAN_DOCS, [
            { key: 'admin/dashboard', pageViews: 12, durationText: '1분 00초' },
        ]);

        expect(rows).toEqual([
            {
                key: 'admin/dashboard',
                name: '관리 > 대시보드',
                route: '/admin/dashboard',
                pageViews: 12,
                durationText: '1분 00초',
            },
            { key: 'home', name: '메인 > 홈', route: '/', pageViews: 0, durationText: null },
        ]);
    });

    it('목록에 없는 문서의 조회수는 뺀다', () => {
        const rows = toPlanViewRowList(PLAN_DOCS, [
            { key: 'parts', pageViews: 7, durationText: null },
        ]);

        expect(rows.map((row) => row.key)).toEqual(['home', 'admin/dashboard']);
    });
});

describe('toPlanViewerHref', () => {
    it('뷰어의 주소에 기획 폴더의 경로를 해시로 붙인다', () => {
        expect(toPlanViewerHref('admin/dashboard')).toBe('/plan/index.html#admin/dashboard');
    });
});
