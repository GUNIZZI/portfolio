import type { ExperienceResponse } from '../../model/experience.types';
import type { ExperienceRepository } from '../../repositories/experience.repositories';
import {
    createExperience,
    deleteExperience,
    getExperienceEditor,
    getExperienceList,
    sortExperienceList,
    toExperienceData,
    toExperienceRowData,
    updateExperience,
} from '../experience.services';

const repository = vi.hoisted(() => ({
    getExperienceList: vi.fn<ExperienceRepository['getExperienceList']>(),
    createExperience: vi.fn<ExperienceRepository['createExperience']>(),
    updateExperience: vi.fn<ExperienceRepository['updateExperience']>(),
    deleteExperience: vi.fn<ExperienceRepository['deleteExperience']>(),
}));

vi.mock('../../repositories/experience.repositories', () => ({
    experienceRepository: repository,
}));
vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

beforeEach(() => {
    vi.resetAllMocks();
});

const BASE: ExperienceResponse = {
    id: 'a',
    company: 'A',
    startYear: 2020,
    endYear: 2023,
    summary: '',
    projects: [{ name: 'P', date: '2021.03', tags: ['React'] }],
    updatedAt: null,
};

describe('toExperienceData', () => {
    it('떠난 해가 있으면 기간을 두 해로 적는다', () => {
        const data = toExperienceData(BASE, []);
        expect(data.periodText).toBe('2020 – 2023');
        expect(data.isCurrent).toBe(false);
    });

    it('재직 중이면 끝을 현재로 적는다', () => {
        const data = toExperienceData({ ...BASE, endYear: null }, []);
        expect(data.periodText).toBe('2020 – 현재');
        expect(data.startYearText).toBe('2020');
        expect(data.endYearText).toBe('현재');
        expect(data.isCurrent).toBe(true);
    });

    it('2014년 이후에 시작한 경력만 처음부터 펼친다', () => {
        expect(toExperienceData({ ...BASE, startYear: 2014 }, []).isOpen).toBe(true);
        expect(toExperienceData({ ...BASE, startYear: 2009, endYear: 2014 }, []).isOpen).toBe(
            false,
        );
    });

    it('요약을 쓰지 않았으면 null 로 낸다', () => {
        expect(toExperienceData(BASE, []).summary).toBeNull();
        expect(toExperienceData({ ...BASE, summary: '프론트엔드 리드' }, []).summary).toBe(
            '프론트엔드 리드',
        );
    });

    it('작업 상세가 있는 프로젝트만 주소를 갖는다', () => {
        const experience = {
            ...BASE,
            projects: [
                { name: 'P', date: '2021', tags: [] },
                { name: 'Q', date: '2022.01', tags: [], projectId: 'q' },
                { name: 'R', date: '2023.01', tags: [], projectId: 'hidden' },
            ],
        };
        const data = toExperienceData(experience, ['q']);
        expect(data.projects.map((project) => project.href)).toEqual([null, '/work/q', null]);
    });

    it('비공개이거나 지워진 프로젝트에 이은 줄은 주소 없이 이름만 낸다', () => {
        const data = toExperienceData(
            { ...BASE, projects: [{ name: 'Q', date: '2022.01', tags: [], projectId: 'q' }] },
            [],
        );
        expect(data.projects[0]).toMatchObject({ name: 'Q', href: null });
    });
});

describe('toExperienceData 의 프로젝트 수', () => {
    it('목록을 다 적은 회사는 목록의 개수를 적는다', () => {
        const data = toExperienceData(BASE, []);
        expect(data.projectCountText).toBe('1개');
    });

    it('실제 수가 목록보다 많으면 그 수에 + 를 붙인다', () => {
        const data = toExperienceData({ ...BASE, totalProjects: 40 }, []);
        expect(data.projectCountText).toBe('40개+');
    });

    it('실제 수가 목록보다 많지 않으면 목록의 개수를 쓴다', () => {
        const data = toExperienceData({ ...BASE, totalProjects: 1 }, []);
        expect(data.projectCountText).toBe('1개');
    });
});

describe('toExperienceRowData', () => {
    it('목록에 적은 수와 실제 수를 따로 낸다', () => {
        const row = toExperienceRowData({
            ...BASE,
            totalProjects: 50,
            updatedAt: '2026-11-17T01:12:00.000Z',
        });
        expect(row.listedCountText).toBe('1개');
        expect(row.totalCountText).toBe('50개+');
        expect(row.updatedAtText).toBe('2026.11.17 (10:12)');
    });

    it('실제 수를 적지 않았으면 null 로 낸다', () => {
        expect(toExperienceRowData(BASE).totalCountText).toBeNull();
    });
});

describe('sortExperienceList', () => {
    it('들어간 해가 늦은 회사부터 놓는다', () => {
        const list = sortExperienceList([
            { ...BASE, id: 'old', startYear: 2009, endYear: 2014 },
            { ...BASE, id: 'now', startYear: 2025, endYear: null },
            { ...BASE, id: 'mid', startYear: 2014, endYear: 2025 },
        ]);
        expect(list.map((item) => item.id)).toEqual(['now', 'mid', 'old']);
    });

    it('들어간 해가 같으면 재직 중인 회사를 앞에 놓는다', () => {
        const list = sortExperienceList([
            { ...BASE, id: 'left', startYear: 2020, endYear: 2021 },
            { ...BASE, id: 'now', startYear: 2020, endYear: null },
        ]);
        expect(list.map((item) => item.id)).toEqual(['now', 'left']);
    });
});

describe('getExperienceList', () => {
    it('저장소의 순서와 상관없이 최근 회사부터 낸다', async () => {
        repository.getExperienceList.mockResolvedValue([
            { ...BASE, id: 'old', startYear: 2009, endYear: 2014 },
            { ...BASE, id: 'now', startYear: 2025, endYear: null },
        ]);

        const list = await getExperienceList([]);
        expect(list.map((item) => item.id)).toEqual(['now', 'old']);
        expect(list[0]?.isCurrent).toBe(true);
    });

    it('경력이 없으면 빈 목록을 낸다', async () => {
        repository.getExperienceList.mockResolvedValue([]);
        expect(await getExperienceList([])).toEqual([]);
    });
});

describe('getExperienceEditor', () => {
    it('id 와 수정 일시를 뺀 내용을 낸다', async () => {
        repository.getExperienceList.mockResolvedValue([
            { ...BASE, updatedAt: '2026-11-17T01:12:00.000Z' },
        ]);

        const editor = await getExperienceEditor('a');
        expect(editor?.updatedAtText).toBe('2026.11.17 (10:12)');
        expect(editor?.content).toEqual({
            company: 'A',
            startYear: 2020,
            endYear: 2023,
            summary: '',
            projects: [{ name: 'P', date: '2021.03', tags: ['React'] }],
        });
    });

    it('없는 id 면 null 을 낸다', async () => {
        repository.getExperienceList.mockResolvedValue([BASE]);
        expect(await getExperienceEditor('none')).toBeNull();
    });
});

const CONTENT = {
    company: ' A ',
    startYear: 2020,
    endYear: 2023,
    summary: '',
    projects: [{ name: 'P', date: '2021.03', tags: ['React'] }],
};

describe('createExperience', () => {
    it('규칙에 맞으면 다듬은 값으로 등록한다', async () => {
        const status = await createExperience(CONTENT);

        expect(status).toBe('SAVED');
        expect(repository.createExperience).toHaveBeenCalledWith({ ...CONTENT, company: 'A' });
    });

    it('값이 없는 선택 항목은 키째로 뺀다', async () => {
        await createExperience({
            ...CONTENT,
            totalProjects: undefined,
            projects: [{ name: 'P', date: '2021', tags: [], projectId: undefined }],
        });

        const [saved] = repository.createExperience.mock.calls[0] ?? [];
        expect(saved).not.toHaveProperty('totalProjects');
        expect(saved?.projects[0]).not.toHaveProperty('projectId');
    });

    it('떠난 해가 들어간 해보다 앞서면 등록하지 않는다', async () => {
        const status = await createExperience({ ...CONTENT, endYear: 2019 });

        expect(status).toBe('INVALID');
        expect(repository.createExperience).not.toHaveBeenCalled();
    });

    it('연도가 4자리가 아니면 등록하지 않는다', async () => {
        expect(await createExperience({ ...CONTENT, startYear: 20, endYear: null })).toBe(
            'INVALID',
        );
    });

    it('시기의 형식이 다르면 등록하지 않는다', async () => {
        const status = await createExperience({
            ...CONTENT,
            projects: [{ name: 'P', date: '25.5', tags: [] }],
        });
        expect(status).toBe('INVALID');
    });

    it('프로젝트가 0건이어도 등록한다', async () => {
        expect(await createExperience({ ...CONTENT, projects: [] })).toBe('SAVED');
    });
});

describe('updateExperience', () => {
    it('고칠 경력이 없으면 NOT_FOUND 를 낸다', async () => {
        repository.updateExperience.mockResolvedValue(false);
        expect(await updateExperience('none', CONTENT)).toBe('NOT_FOUND');
    });

    it('규칙에 맞으면 그 id 의 경력을 고친다', async () => {
        repository.updateExperience.mockResolvedValue(true);

        expect(await updateExperience('a', CONTENT)).toBe('SAVED');
        expect(repository.updateExperience).toHaveBeenCalledWith('a', {
            ...CONTENT,
            company: 'A',
        });
    });

    it('규칙에 맞지 않으면 저장소를 부르지 않는다', async () => {
        expect(await updateExperience('a', { ...CONTENT, company: ' ' })).toBe('INVALID');
        expect(repository.updateExperience).not.toHaveBeenCalled();
    });
});

describe('deleteExperience', () => {
    it('지울 경력이 없으면 NOT_FOUND 를 낸다', async () => {
        repository.deleteExperience.mockResolvedValue(false);
        expect(await deleteExperience('none')).toBe('NOT_FOUND');
    });

    it('지웠으면 SAVED 를 낸다', async () => {
        repository.deleteExperience.mockResolvedValue(true);
        expect(await deleteExperience('a')).toBe('SAVED');
    });
});
