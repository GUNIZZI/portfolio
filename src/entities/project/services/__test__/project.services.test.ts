import {
    getProject,
    getProjectList,
    getProjectSlugList,
    toProjectData,
    toProjectDetailData,
} from '../project.services';

describe('toProjectData', () => {
    it('상세 주소가 없으면 작업 상세를 가리킨다', () => {
        const data = toProjectData({
            slug: 'a',
            title: 'A',
            category: 'Web',
            summary: 'React',
            image: null,
            team: [],
            scope: [],
            stack: [],
            links: [],
        });
        expect(data.href).toBe('/work/a');
    });

    it('상세 주소가 있으면 그대로 쓴다', () => {
        const data = toProjectData({
            slug: 'a',
            title: 'A',
            category: 'Web',
            summary: 'React',
            href: 'https://example.com',
            image: null,
            team: [],
            scope: [],
            stack: [],
            links: [],
        });
        expect(data.href).toBe('https://example.com');
    });
});

describe('getProjectList', () => {
    it('원문을 검증해 순서대로 낸다', async () => {
        const list = await getProjectList();
        expect(list.length).toBeGreaterThan(0);
        expect(new Set(list.map((project) => project.slug)).size).toBe(list.length);
    });
});

describe('toProjectDetailData', () => {
    const base = {
        category: 'Web',
        summary: 'React',
        image: null,
        team: [],
        scope: [],
        stack: [],
        links: [],
    };
    const list = [
        { ...base, slug: 'a', title: 'A' },
        {
            ...base,
            slug: 'b',
            title: 'B',
            role: '프론트엔드 개발',
            period: { start: '2025.03', end: '2026.01' },
            stack: ['Next.js'],
            body: '  <p>본문</p>  ',
        },
        { ...base, slug: 'c', title: 'C', period: { start: '2025.06' }, body: '   ' },
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
        const withTeam = [
            {
                ...base,
                slug: 't',
                title: 'T',
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
        const withScope = [
            {
                ...base,
                slug: 's',
                title: 'S',
                scope: [
                    { area: 'development' as const, level: 'lead' as const },
                    { area: 'design' as const, level: 'part' as const },
                    { area: 'publishing' as const, level: 'sole' as const },
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

describe('getProject', () => {
    it('slug 로 상세 한 건을 찾고, 없으면 null 을 낸다', async () => {
        const [slug] = await getProjectSlugList();
        expect(slug).toBeDefined();
        expect((await getProject(slug ?? ''))?.slug).toBe(slug);
        expect(await getProject('없는-작업')).toBeNull();
    });
});
