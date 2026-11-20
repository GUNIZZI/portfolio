import { PROJECT_SAVE_STATUS, type ProjectResponse } from '../../model/project.types';
import type { ProjectRepository } from '../../repositories/project.repositories';
import {
    createProject,
    deleteProject,
    discardProjectImage,
    getFeaturedProjectList,
    getProject,
    getProjectEditor,
    getProjectIdList,
    getProjectList,
    getProjectOptionList,
    getProjectRowList,
    reorderProjectList,
    sanitizeProjectBody,
    setProjectFeatured,
    setProjectPublished,
    sortProjectList,
    toBodyImageList,
    toProjectData,
    toProjectDetailData,
    toProjectRowData,
    updateProject,
} from '../project.services';

const repository = vi.hoisted(() => ({
    getProjectList: vi.fn<ProjectRepository['getProjectList']>(),
    getProject: vi.fn<ProjectRepository['getProject']>(),
    createProject: vi.fn<ProjectRepository['createProject']>(),
    updateProject: vi.fn<ProjectRepository['updateProject']>(),
    updateProjectFlags: vi.fn<ProjectRepository['updateProjectFlags']>(),
    updateProjectOrder: vi.fn<ProjectRepository['updateProjectOrder']>(),
    deleteProject: vi.fn<ProjectRepository['deleteProject']>(),
    createImageUploadToken: vi.fn<ProjectRepository['createImageUploadToken']>(),
    deleteImage: vi.fn<ProjectRepository['deleteImage']>(),
}));

vi.mock('../../repositories/project.repositories', () => ({
    projectRepository: repository,
}));
vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

beforeEach(() => {
    vi.resetAllMocks();
});

const IMAGE_SRC = 'https://store.public.blob.vercel-storage.com/projects/a.png';
const IMAGE = { src: IMAGE_SRC, alt: 'A 화면', width: 400, height: 200 };

const BASE: ProjectResponse = {
    id: 'a',
    title: 'A',
    category: 'Admin',
    summary: 'React',
    image: null,
    published: true,
    featured: false,
    order: 0,
    team: [],
    scope: [],
    stack: [],
    links: [],
    updatedAt: null,
};

/** 폼이 보내는 내용 */
const CONTENT = {
    title: 'A',
    category: 'Admin',
    summary: 'React',
    image: null,
    published: false,
    featured: false,
    team: [],
    scope: [],
    stack: [],
    links: [],
};

describe('toProjectData', () => {
    it('상세 주소가 없으면 작업 상세를 가리킨다', () => {
        expect(toProjectData(BASE).href).toBe('/work/a');
    });

    it('상세 주소가 있으면 그대로 쓴다', () => {
        expect(toProjectData({ ...BASE, href: 'https://example.com' }).href).toBe(
            'https://example.com',
        );
    });
});

describe('toProjectRowData', () => {
    it('수정 일시를 한국 시각의 문구로 적고, 기록이 없으면 null 로 낸다', () => {
        expect(toProjectRowData(BASE).updatedAtText).toBeNull();
        expect(
            toProjectRowData({ ...BASE, updatedAt: '2026-11-12T01:12:00.000Z' }).updatedAtText,
        ).toBe('2026.11.12 (10:12)');
    });

    it('비공개 프로젝트는 저장소의 값과 상관없이 홈 노출이 꺼진 것으로 낸다', () => {
        const row = toProjectRowData({ ...BASE, published: false, featured: true });
        expect(row.isPublished).toBe(false);
        expect(row.isFeatured).toBe(false);
    });

    it('썸네일은 주소와 대체 텍스트만 낸다', () => {
        expect(toProjectRowData({ ...BASE, image: IMAGE }).image).toEqual({
            src: IMAGE_SRC,
            alt: 'A 화면',
        });
    });
});

describe('sortProjectList', () => {
    it('순서가 작은 것부터 놓는다', () => {
        const list = sortProjectList([
            { ...BASE, id: 'c', order: 2 },
            { ...BASE, id: 'a', order: 0 },
            { ...BASE, id: 'b', order: 1 },
        ]);
        expect(list.map((project) => project.id)).toEqual(['a', 'b', 'c']);
    });
});

describe('공개 화면의 목록', () => {
    beforeEach(() => {
        repository.getProjectList.mockResolvedValue([
            { ...BASE, id: 'hidden', order: 0, published: false, featured: false },
            { ...BASE, id: 'second', order: 2, published: true, featured: true },
            { ...BASE, id: 'first', order: 1, published: true, featured: false },
        ]);
    });

    it('작업 목록은 공개한 프로젝트만 순서대로 낸다', async () => {
        const list = await getProjectList();
        expect(list.map((project) => project.id)).toEqual(['first', 'second']);
    });

    it('홈은 공개한 것 가운데 홈 노출을 켠 프로젝트만 낸다', async () => {
        const list = await getFeaturedProjectList();
        expect(list.map((project) => project.id)).toEqual(['second']);
    });

    it('미리 그릴 상세는 공개한 프로젝트뿐이다', async () => {
        expect(await getProjectIdList()).toEqual(['first', 'second']);
    });

    it('상세는 공개한 프로젝트만 찾고, 앞뒤 작업도 공개한 것끼리 잇는다', async () => {
        expect(await getProject('hidden')).toBeNull();
        expect(await getProject('none')).toBeNull();

        const first = await getProject('first');
        expect(first?.prev).toBeNull();
        expect(first?.next).toEqual({ title: 'A', href: '/work/second' });
    });
});

describe('관리 화면의 목록', () => {
    beforeEach(() => {
        repository.getProjectList.mockResolvedValue([
            { ...BASE, id: 'b', order: 1, category: 'App', published: false },
            { ...BASE, id: 'a', order: 0, category: 'Admin' },
            { ...BASE, id: 'c', order: 2, category: 'Admin' },
        ]);
    });

    it('비공개를 포함한 전체를 순서대로 낸다', async () => {
        const rows = await getProjectRowList();
        expect(rows.map((row) => row.id)).toEqual(['a', 'b', 'c']);
    });

    it('프로젝트를 고르는 목록에는 공개 여부가 함께 나온다', async () => {
        const options = await getProjectOptionList();
        expect(options).toEqual([
            { id: 'a', title: 'A', isPublished: true },
            { id: 'b', title: 'A', isPublished: false },
            { id: 'c', title: 'A', isPublished: true },
        ]);
    });

    it('수정 폼에는 폼이 다루는 항목만 넘긴다', async () => {
        const editor = await getProjectEditor('a');
        expect(editor?.content).toEqual({ ...CONTENT, published: true });
        expect(await getProjectEditor('none')).toBeNull();
    });
});

describe('toProjectDetailData', () => {
    const list: ProjectResponse[] = [
        { ...BASE, id: 'a', title: 'A' },
        {
            ...BASE,
            id: 'b',
            title: 'B',
            role: '프론트엔드 개발',
            period: { start: '2025.03', end: '2026.01' },
            stack: ['Next.js'],
            body: '  <p>본문</p>  ',
        },
        { ...BASE, id: 'c', title: 'C', period: { start: '2025.06' }, body: '   ' },
    ];

    it('앞뒤 작업은 목록의 순서를 따른다', () => {
        const data = toProjectDetailData(list, 1);
        expect(data?.prev).toEqual({ title: 'A', href: '/work/a' });
        expect(data?.next).toEqual({ title: 'C', href: '/work/c' });
    });

    it('첫 작업에는 이전이, 마지막 작업에는 다음이 없다', () => {
        expect(toProjectDetailData(list, 0)?.prev).toBeNull();
        expect(toProjectDetailData(list, 2)?.next).toBeNull();
    });

    it('기간은 두 시기로 적고, 끝이 없으면 진행 중으로 적는다', () => {
        expect(toProjectDetailData(list, 1)?.periodText).toBe('2025.03 – 2026.01');
        expect(toProjectDetailData(list, 2)?.periodText).toBe('2025.06 – 진행 중');
        expect(toProjectDetailData(list, 0)?.periodText).toBeNull();
    });

    it('본문은 앞뒤 공백을 떼고, 비어 있으면 null 로 낸다', () => {
        expect(toProjectDetailData(list, 1)?.body).toBe('<p>본문</p>');
        expect(toProjectDetailData(list, 2)?.body).toBeNull();
        expect(toProjectDetailData(list, 0)?.body).toBeNull();
    });

    it('팀 구성을 파트와 인원으로 한 줄에 적고, 없으면 null 로 낸다', () => {
        const withTeam: ProjectResponse[] = [
            {
                ...BASE,
                team: [
                    { part: '프론트엔드', count: 2 },
                    { part: '디자이너', count: 1 },
                ],
            },
        ];
        expect(toProjectDetailData(withTeam, 0)?.teamText).toBe('프론트엔드 2명 · 디자이너 1명');
        expect(toProjectDetailData(list, 0)?.teamText).toBeNull();
    });

    it('맡은 범위는 적은 순서와 상관없이 기획 · 디자인 · 퍼블리싱 · 개발 순서로 놓는다', () => {
        const withScope: ProjectResponse[] = [
            {
                ...BASE,
                scope: [
                    { area: 'development', level: 'lead' },
                    { area: 'design', level: 'part' },
                    { area: 'publishing', level: 'sole' },
                ],
            },
        ];
        expect(toProjectDetailData(withScope, 0)?.scope).toEqual([
            { areaLabel: '디자인', level: 'part', levelLabel: '참여' },
            { areaLabel: '퍼블리싱', level: 'sole', levelLabel: '전담' },
            { areaLabel: '개발', level: 'lead', levelLabel: '주도' },
        ]);
        expect(toProjectDetailData(list, 0)?.scope).toEqual([]);
    });

    it('없는 자리면 null 을 낸다', () => {
        expect(toProjectDetailData(list, 9)).toBeNull();
    });
});

describe('createProject', () => {
    it('맨 뒤에 놓는다', async () => {
        repository.getProjectList.mockResolvedValue([
            { ...BASE, id: 'a', order: 0 },
            { ...BASE, id: 'b', order: 4 },
        ]);
        expect(await createProject(CONTENT)).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.createProject).toHaveBeenCalledWith(CONTENT, 5);
    });

    it('첫 프로젝트의 순서는 0 이다', async () => {
        repository.getProjectList.mockResolvedValue([]);
        await createProject(CONTENT);
        expect(repository.createProject).toHaveBeenCalledWith(CONTENT, 0);
    });

    it('규칙에 맞지 않으면 저장하지 않는다', async () => {
        expect(await createProject({ ...CONTENT, title: '  ' })).toBe(PROJECT_SAVE_STATUS.INVALID);
        // 정해 둔 분류가 아니다
        expect(await createProject({ ...CONTENT, category: 'Etc' })).toBe(
            PROJECT_SAVE_STATUS.INVALID,
        );
        expect(
            await createProject({
                ...CONTENT,
                image: { ...IMAGE, src: 'https://example.com/a.png' },
            }),
        ).toBe(PROJECT_SAVE_STATUS.INVALID);
        expect(repository.createProject).not.toHaveBeenCalled();
    });

    it('비공개로 저장하면 홈 노출을 끄고, 비운 상세 주소는 키째로 뺀다', async () => {
        repository.getProjectList.mockResolvedValue([]);
        await createProject({ ...CONTENT, featured: true, href: undefined });
        const [saved] = repository.createProject.mock.calls[0] ?? [];
        expect(saved?.featured).toBe(false);
        expect(saved).not.toHaveProperty('href');
    });
});

describe('상세 항목의 검증', () => {
    beforeEach(() => {
        repository.getProjectList.mockResolvedValue([]);
    });

    it('팀 · 맡은 범위 · 기간 · 기술 · 링크 · 본문을 함께 저장한다', async () => {
        const detail = {
            team: [{ part: '프론트엔드', count: 2 }],
            role: '프론트엔드 개발',
            scope: [{ area: 'development', level: 'lead' }],
            period: { start: '2025.06' },
            stack: ['Next.js'],
            links: [{ label: '서비스', href: 'https://example.com' }],
            body: '<h2>개요</h2><p>본문</p>',
        };
        expect(await createProject({ ...CONTENT, ...detail })).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.createProject).toHaveBeenCalledWith({ ...CONTENT, ...detail }, 0);
    });

    it('규칙에 맞지 않는 상세 항목은 저장하지 않는다', async () => {
        const invalid = [
            { team: [{ part: '', count: 1 }] },
            { team: [{ part: '프론트엔드', count: 0 }] },
            { period: { start: '2025' } },
            { period: { start: '2025.06', end: '2025.01' } },
            { links: [{ label: '서비스', href: 'example.com' }] },
            { links: [{ label: '', href: 'https://example.com' }] },
            {
                scope: [
                    { area: 'design', level: 'part' },
                    { area: 'design', level: 'lead' },
                ],
            },
        ];
        for (const detail of invalid) {
            expect(await createProject({ ...CONTENT, ...detail })).toBe(
                PROJECT_SAVE_STATUS.INVALID,
            );
        }
        expect(repository.createProject).not.toHaveBeenCalled();
    });

    it('본문은 정제해서 저장하고, 비었으면 키째로 뺀다', async () => {
        await createProject({
            ...CONTENT,
            body: '<h2>개요</h2><script>alert(1)</script><p onclick="x()">본문</p>',
        });
        expect(repository.createProject.mock.calls[0]?.[0].body).toBe('<h2>개요</h2><p>본문</p>');

        await createProject({ ...CONTENT, body: '<p></p>' });
        expect(repository.createProject.mock.calls[1]?.[0]).not.toHaveProperty('body');
    });
});

describe('sanitizeProjectBody', () => {
    it('에디터의 서식 태그는 남긴다', () => {
        const body =
            '<h2>개요</h2><h3>배경</h3><p><strong>굵게</strong> <s>취소</s> <code>code</code></p>' +
            '<ul><li><p>항목</p></li></ul><blockquote><p>인용</p></blockquote><pre><code>x</code></pre><hr />';
        expect(sanitizeProjectBody(body)).toBe(body);
    });

    it('스크립트와 이벤트 속성을 걷어 낸다', () => {
        expect(
            sanitizeProjectBody(
                '<p style="color:red" onclick="x()">글</p><script>x()</script><iframe src="x"></iframe>',
            ),
        ).toBe('<p>글</p>');
    });

    it('이미지는 이미지 저장소의 주소만 남긴다', () => {
        const image =
            '<img src="https://store.public.blob.vercel-storage.com/projects/a.webp" alt="화면" />';
        expect(sanitizeProjectBody(`<p>${image}</p>`)).toBe(`<p>${image}</p>`);
        expect(
            sanitizeProjectBody('<p>글<img src="https://example.com/a.png" onerror="x()"></p>'),
        ).toBe('<p>글</p>');
    });

    it('표는 칸의 병합만 남기고 모양 속성을 걷어 낸다', () => {
        expect(
            sanitizeProjectBody(
                '<table style="min-width: 50px"><colgroup><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="2" rowspan="1"><p>머리</p></th></tr><tr><td><p>칸</p></td><td><p>칸</p></td></tr></tbody></table>',
            ),
        ).toBe(
            '<table><tbody><tr><th colspan="2" rowspan="1"><p>머리</p></th></tr><tr><td><p>칸</p></td><td><p>칸</p></td></tr></tbody></table>',
        );
    });

    it('링크는 http · https 주소만 남긴다', () => {
        expect(sanitizeProjectBody('<a href="https://example.com">링크</a>')).toBe(
            '<a href="https://example.com">링크</a>',
        );
        expect(sanitizeProjectBody('<a href="javascript:alert(1)">링크</a>')).toBe('<a>링크</a>');
    });

    it('글자가 없으면 null 을 낸다', () => {
        expect(sanitizeProjectBody(undefined)).toBeNull();
        expect(sanitizeProjectBody('<p></p>')).toBeNull();
        expect(sanitizeProjectBody('<h2>  </h2><p><br></p>')).toBeNull();
        expect(sanitizeProjectBody('<hr>')).not.toBeNull();
    });

    it('글자 없이 이미지만 있어도 남긴다', () => {
        expect(
            sanitizeProjectBody(
                '<p><img src="https://store.public.blob.vercel-storage.com/projects/a.webp" alt="화면"></p>',
            ),
        ).not.toBeNull();
    });
});

describe('toBodyImageList', () => {
    it('본문에 든 이미지 저장소의 주소를 겹치지 않게 낸다', () => {
        const a = 'https://store.public.blob.vercel-storage.com/projects/a.webp';
        const b = 'https://store.public.blob.vercel-storage.com/projects/b.webp';
        expect(
            toBodyImageList(
                `<p><img src="${a}" alt=""></p><p>글</p><p><img src="${b}" alt=""><img src="${a}" alt=""></p><img src="https://example.com/c.png">`,
            ),
        ).toEqual([a, b]);
        expect(toBodyImageList(undefined)).toEqual([]);
    });
});

describe('updateProject', () => {
    it('그 id 의 프로젝트가 없으면 고치지 않는다', async () => {
        repository.getProject.mockResolvedValue(null);
        expect(await updateProject('none', CONTENT)).toBe(PROJECT_SAVE_STATUS.NOT_FOUND);
        expect(repository.updateProject).not.toHaveBeenCalled();
    });

    it('썸네일을 바꾸거나 지우면 이전 파일을 지운다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, image: IMAGE });
        expect(await updateProject('a', CONTENT)).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.deleteImage).toHaveBeenCalledWith(IMAGE_SRC);
    });

    it('본문에서 뺀 이미지의 파일을 지운다', async () => {
        const other = 'https://store.public.blob.vercel-storage.com/projects/b.png';
        repository.getProject.mockResolvedValue({
            ...BASE,
            body: `<p><img src="${IMAGE_SRC}" alt=""></p><p><img src="${other}" alt=""></p>`,
        });
        await updateProject('a', { ...CONTENT, body: `<p><img src="${other}" alt=""></p>` });
        expect(repository.deleteImage).toHaveBeenCalledTimes(1);
        expect(repository.deleteImage).toHaveBeenCalledWith(IMAGE_SRC);
    });

    it('썸네일이 그대로면 파일을 지우지 않는다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, image: IMAGE });
        await updateProject('a', { ...CONTENT, image: { ...IMAGE, alt: '바꾼 설명' } });
        expect(repository.deleteImage).not.toHaveBeenCalled();
    });

    it('이전 파일을 지우지 못해도 저장한 것으로 본다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, image: IMAGE });
        repository.deleteImage.mockRejectedValue(new Error('blob'));
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        expect(await updateProject('a', CONTENT)).toBe(PROJECT_SAVE_STATUS.SAVED);
    });
});

describe('setProjectPublished', () => {
    it('비공개로 바꾸면 홈 노출도 함께 끈다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, published: true, featured: true });
        expect(await setProjectPublished('a', false)).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.updateProjectFlags).toHaveBeenCalledWith('a', {
            published: false,
            featured: false,
        });
    });

    it('다시 공개해도 홈 노출은 꺼져 있다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, published: false, featured: false });
        await setProjectPublished('a', true);
        expect(repository.updateProjectFlags).toHaveBeenCalledWith('a', {
            published: true,
            featured: false,
        });
    });

    it('그 id 의 프로젝트가 없으면 바꾸지 않는다', async () => {
        repository.getProject.mockResolvedValue(null);
        expect(await setProjectPublished('none', true)).toBe(PROJECT_SAVE_STATUS.NOT_FOUND);
    });
});

describe('setProjectFeatured', () => {
    it('공개한 프로젝트는 홈 노출을 켜고 끌 수 있다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, published: true });
        expect(await setProjectFeatured('a', true)).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.updateProjectFlags).toHaveBeenCalledWith('a', {
            published: true,
            featured: true,
        });
    });

    it('비공개 프로젝트는 홈 노출을 켤 수 없다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, published: false });
        expect(await setProjectFeatured('a', true)).toBe(PROJECT_SAVE_STATUS.INVALID);
        expect(repository.updateProjectFlags).not.toHaveBeenCalled();
    });
});

describe('reorderProjectList', () => {
    beforeEach(() => {
        repository.getProjectList.mockResolvedValue([
            { ...BASE, id: 'a' },
            { ...BASE, id: 'b' },
            { ...BASE, id: 'c' },
        ]);
    });

    it('받은 차례대로 순서를 저장한다', async () => {
        expect(await reorderProjectList(['c', 'a', 'b'])).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.updateProjectOrder).toHaveBeenCalledWith(['c', 'a', 'b']);
    });

    it('지금 있는 프로젝트 전체를 한 번씩 적지 않았으면 저장하지 않는다', async () => {
        for (const ids of [
            ['a', 'b'],
            ['a', 'b', 'b'],
            ['a', 'b', 'x'],
            ['a', 'b', 'c', 'd'],
            'a',
        ]) {
            expect(await reorderProjectList(ids)).toBe(PROJECT_SAVE_STATUS.INVALID);
        }
        expect(repository.updateProjectOrder).not.toHaveBeenCalled();
    });
});

describe('deleteProject', () => {
    it('문서와 썸네일 파일을 함께 지운다', async () => {
        repository.getProject.mockResolvedValue({ ...BASE, image: IMAGE });
        expect(await deleteProject('a')).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.deleteProject).toHaveBeenCalledWith('a');
        expect(repository.deleteImage).toHaveBeenCalledWith(IMAGE_SRC);
    });

    it('본문 이미지의 파일도 함께 지운다', async () => {
        repository.getProject.mockResolvedValue({
            ...BASE,
            body: `<p><img src="${IMAGE_SRC}" alt=""></p>`,
        });
        await deleteProject('a');
        expect(repository.deleteImage).toHaveBeenCalledWith(IMAGE_SRC);
    });

    it('그 id 의 프로젝트가 없으면 지우지 않는다', async () => {
        repository.getProject.mockResolvedValue(null);
        expect(await deleteProject('none')).toBe(PROJECT_SAVE_STATUS.NOT_FOUND);
        expect(repository.deleteProject).not.toHaveBeenCalled();
    });
});

describe('discardProjectImage', () => {
    it('저장하지 않은 썸네일 파일을 지운다', async () => {
        repository.getProjectList.mockResolvedValue([BASE]);
        expect(await discardProjectImage(IMAGE_SRC)).toBe(PROJECT_SAVE_STATUS.SAVED);
        expect(repository.deleteImage).toHaveBeenCalledWith(IMAGE_SRC);
    });

    it('저장된 프로젝트가 본문에 쓰는 파일은 지우지 않는다', async () => {
        repository.getProjectList.mockResolvedValue([
            { ...BASE, body: `<p><img src="${IMAGE_SRC}" alt=""></p>` },
        ]);
        expect(await discardProjectImage(IMAGE_SRC)).toBe(PROJECT_SAVE_STATUS.INVALID);
        expect(repository.deleteImage).not.toHaveBeenCalled();
    });

    it('저장된 프로젝트가 쓰는 파일은 지우지 않는다', async () => {
        repository.getProjectList.mockResolvedValue([{ ...BASE, image: IMAGE }]);
        expect(await discardProjectImage(IMAGE_SRC)).toBe(PROJECT_SAVE_STATUS.INVALID);
        expect(repository.deleteImage).not.toHaveBeenCalled();
    });

    it('이미지 저장소의 주소가 아니면 지우지 않는다', async () => {
        expect(await discardProjectImage('https://example.com/a.png')).toBe(
            PROJECT_SAVE_STATUS.INVALID,
        );
        expect(repository.deleteImage).not.toHaveBeenCalled();
    });
});
