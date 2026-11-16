import { getExperienceList, toExperienceData } from '../experience.services';

const BASE = {
    slug: 'a',
    company: 'A',
    startYear: 2020,
    endYear: 2023,
    summary: '',
    projects: [{ name: 'P', date: '2021.03', tags: ['React'] }],
};

describe('toExperienceData', () => {
    it('떠난 해가 있으면 기간을 두 해로 적는다', () => {
        const data = toExperienceData(BASE);
        expect(data.periodText).toBe('2020 – 2023');
        expect(data.isCurrent).toBe(false);
    });

    it('재직 중이면 끝을 현재로 적는다', () => {
        const data = toExperienceData({ ...BASE, endYear: null });
        expect(data.periodText).toBe('2020 – 현재');
        expect(data.startYearText).toBe('2020');
        expect(data.endYearText).toBe('현재');
        expect(data.isCurrent).toBe(true);
    });

    it('2014년 이후에 시작한 경력만 처음부터 펼친다', () => {
        expect(toExperienceData({ ...BASE, startYear: 2014 }).isOpen).toBe(true);
        expect(toExperienceData({ ...BASE, startYear: 2009, endYear: 2014 }).isOpen).toBe(false);
    });

    it('요약을 쓰지 않았으면 null 로 낸다', () => {
        expect(toExperienceData(BASE).summary).toBeNull();
        expect(toExperienceData({ ...BASE, summary: '프론트엔드 리드' }).summary).toBe(
            '프론트엔드 리드',
        );
    });

    it('작업 상세가 있는 프로젝트만 주소를 갖는다', () => {
        const data = toExperienceData({
            ...BASE,
            projects: [
                { name: 'P', date: '2021', tags: [] },
                { name: 'Q', date: '2022.01', tags: [], workSlug: 'q' },
            ],
        });
        expect(data.projects.map((project) => project.href)).toEqual([null, '/work/q']);
    });
});

describe('toExperienceData 의 프로젝트 수', () => {
    it('목록을 다 적은 회사는 목록의 개수를 적는다', () => {
        const data = toExperienceData(BASE);
        expect(data.projectCountText).toBe('1개');
    });

    it('실제 수가 목록보다 많으면 그 수에 + 를 붙인다', () => {
        const data = toExperienceData({ ...BASE, totalProjects: 40 });
        expect(data.projectCountText).toBe('40개+');
    });

    it('실제 수가 목록보다 많지 않으면 목록의 개수를 쓴다', () => {
        const data = toExperienceData({ ...BASE, totalProjects: 1 });
        expect(data.projectCountText).toBe('1개');
    });
});

describe('getExperienceList', () => {
    it('원문을 검증해 최근 회사부터 낸다', async () => {
        const list = await getExperienceList();
        expect(list.length).toBeGreaterThan(0);
        expect(new Set(list.map((experience) => experience.slug)).size).toBe(list.length);
        expect(list[0]?.isCurrent).toBe(true);
    });
});
