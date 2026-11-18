import type { ExperienceFormValue } from '../experienceEditor.types';
import { toContent, toFormValue } from '../experienceEditor.utils';

const VALUE: ExperienceFormValue = {
    company: 'KOCOM',
    startYear: '2025',
    isCurrent: false,
    endYear: '2026',
    summary: '',
    totalProjects: '',
    projects: [{ name: 'Design System', date: '2025.06', tags: ['React'], workSlug: '' }],
};

describe('toFormValue', () => {
    it('등록 화면이면 모두 빈 값이다', () => {
        const value = toFormValue(null, []);
        expect(value.company).toBe('');
        expect(value.isCurrent).toBe(false);
        expect(value.projects).toEqual([]);
    });

    it('재직 중이면 떠난 해를 비우고 재직 중을 켠다', () => {
        const value = toFormValue(
            { company: 'A', startYear: 2025, endYear: null, summary: '', projects: [] },
            [],
        );
        expect(value.isCurrent).toBe(true);
        expect(value.endYear).toBe('');
    });

    it('등록된 프로젝트에 없는 연결은 잇지 않음으로 바꾼다', () => {
        const value = toFormValue(
            {
                company: 'A',
                startYear: 2020,
                endYear: 2023,
                summary: '',
                totalProjects: 50,
                projects: [
                    { name: 'P', date: '2021', tags: [], workSlug: 'kozipsa' },
                    { name: 'Q', date: '2022', tags: [], workSlug: 'gone' },
                ],
            },
            ['kozipsa'],
        );
        expect(value.totalProjects).toBe('50');
        expect(value.projects.map((project) => project.workSlug)).toEqual(['kozipsa', '']);
    });
});

describe('toContent', () => {
    it('글자로 적은 연도와 수를 숫자로 바꾼다', () => {
        const content = toContent({ ...VALUE, totalProjects: '50' });
        expect(content.startYear).toBe(2025);
        expect(content.endYear).toBe(2026);
        expect(content.totalProjects).toBe(50);
    });

    it('재직 중이면 떠난 해에 적은 값이 있어도 null 로 낸다', () => {
        expect(toContent({ ...VALUE, isCurrent: true }).endYear).toBeNull();
    });

    it('값이 없는 선택 항목은 내지 않는다', () => {
        const content = toContent(VALUE);
        expect(content).not.toHaveProperty('totalProjects');
        expect(content.projects[0]).toEqual({
            name: 'Design System',
            date: '2025.06',
            tags: ['React'],
        });
    });

    it('이은 프로젝트가 있으면 slug 를 낸다', () => {
        const [project] = VALUE.projects;
        const content = toContent({
            ...VALUE,
            projects: project ? [{ ...project, workSlug: 'kozipsa' }] : [],
        });
        expect(content.projects[0]?.workSlug).toBe('kozipsa');
    });

    it('폼으로 다녀와도 저장된 내용이 바뀌지 않는다', () => {
        const saved = {
            company: 'A',
            startYear: 2014,
            endYear: 2025,
            summary: '요약',
            totalProjects: 50,
            projects: [{ name: 'P', date: '2021.03', tags: ['Vue'], workSlug: 'p' }],
        };
        expect(toContent(toFormValue(saved, ['p']))).toEqual(saved);
    });
});
