import { toPeriodHref } from '../dashboard.constants';
import { toProjectViewRowList } from '../dashboard.utils';

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
