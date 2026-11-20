import { ExperienceFormSchema } from '../experienceEditor.schemas';
import type { ExperienceFormValue } from '../experienceEditor.types';

const VALUE: ExperienceFormValue = {
    company: 'KOCOM',
    startYear: '2025',
    isCurrent: false,
    endYear: '2026',
    summary: '',
    totalProjects: '',
    projects: [{ name: 'Design System', date: '2025.06', tags: ['React'], projectId: '' }],
};

/** 오류가 난 자리와 문구. 자리는 `projects.0.date` 처럼 점으로 잇는다 */
function toErrors(value: ExperienceFormValue): Record<string, string> {
    const result = ExperienceFormSchema.safeParse(value);
    if (result.success) return {};
    return Object.fromEntries(
        result.error.issues.map((issue) => [issue.path.join('.'), issue.message]),
    );
}

describe('ExperienceFormSchema', () => {
    it('규칙에 맞으면 글자로 적은 연도를 숫자로 바꿔 저장할 내용을 낸다', () => {
        const result = ExperienceFormSchema.safeParse({ ...VALUE, totalProjects: '50' });
        expect(result.success).toBe(true);
        expect(result.data).toMatchObject({ startYear: 2025, endYear: 2026, totalProjects: 50 });
    });

    it('빈 필수 항목을 그 항목의 자리에 알린다', () => {
        const [project] = VALUE.projects;
        const errors = toErrors({
            ...VALUE,
            company: ' ',
            projects: project ? [{ ...project, name: '' }] : [],
        });
        expect(errors).toEqual({
            company: '회사를 입력해 주세요.',
            'projects.0.name': '이름을 입력해 주세요.',
        });
    });

    it('연도가 비었거나 4자리 숫자가 아니면 같은 문구로 알린다', () => {
        expect(toErrors({ ...VALUE, startYear: '' })).toEqual({
            startYear: '연도 4자리를 입력해 주세요.',
        });
        expect(toErrors({ ...VALUE, startYear: '25' })).toEqual({
            startYear: '연도 4자리를 입력해 주세요.',
        });
        expect(toErrors({ ...VALUE, endYear: '이천' })).toEqual({
            endYear: '연도 4자리를 입력해 주세요.',
        });
    });

    it('퇴사가 입사보다 앞서면 퇴사의 자리에 알린다', () => {
        expect(toErrors({ ...VALUE, endYear: '2024' })).toEqual({
            endYear: '퇴사날짜는 입사날짜보다 앞설 수 없습니다.',
        });
        expect(toErrors({ ...VALUE, endYear: '2025' })).toEqual({});
    });

    it('재직 중이면 퇴사를 보지 않는다', () => {
        expect(toErrors({ ...VALUE, isCurrent: true, endYear: '' })).toEqual({});
    });

    it('실제 프로젝트 수는 비우거나 1 이상의 숫자여야 한다', () => {
        expect(toErrors({ ...VALUE, totalProjects: '0' })).toEqual({
            totalProjects: '1 이상의 숫자를 입력해 주세요.',
        });
        expect(toErrors({ ...VALUE, totalProjects: '많이' })).toEqual({
            totalProjects: '1 이상의 숫자를 입력해 주세요.',
        });
    });

    it('시기가 비었거나 형식이 다르면 그 줄의 자리에 알린다', () => {
        const [project] = VALUE.projects;
        for (const date of ['', '25.5']) {
            const errors = toErrors({
                ...VALUE,
                projects: project ? [{ ...project, date }] : [],
            });
            expect(errors).toEqual({ 'projects.0.date': '2025.06 또는 2022 처럼 입력해 주세요.' });
        }
    });
});
