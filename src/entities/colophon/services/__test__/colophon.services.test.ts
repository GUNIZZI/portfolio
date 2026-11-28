import { COLOPHON_DEFAULT_CONTENT, COLOPHON_SECTION } from '../../model/colophon.constants';
import { COLOPHON_SECTION_SCHEMAS } from '../../model/colophon.schemas';
import type { ColophonResponse } from '../../model/colophon.types';
import type { ColophonRepository } from '../../repositories/colophon.repositories';
import {
    getColophonData,
    getColophonEditor,
    getColophonTeaser,
    saveColophonSection,
} from '../colophon.services';

const repository = vi.hoisted(() => ({
    getColophon: vi.fn<ColophonRepository['getColophon']>(),
    saveSection: vi.fn<ColophonRepository['saveSection']>(),
}));

vi.mock('../../repositories/colophon.repositories', () => ({ colophonRepository: repository }));
vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

const EMPTY: ColophonResponse = {
    head: null,
    process: null,
    design: null,
    develop: null,
    guards: null,
    human: null,
    stack: null,
};

const HUMAN = {
    items: [
        { title: '정한 것', description: '고친 설명' },
        { title: '승인한 것', description: '설명' },
        { title: '다듬은 것', description: '설명' },
    ],
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe('COLOPHON_DEFAULT_CONTENT', () => {
    it.each(Object.values(COLOPHON_SECTION))(
        '%s 의 처음 값이 그 섹션의 스키마에 맞다',
        (section) => {
            const parsed = COLOPHON_SECTION_SCHEMAS[section].safeParse(
                COLOPHON_DEFAULT_CONTENT[section],
            );

            expect(parsed.success).toBe(true);
            // 다듬을 것이 없어야 한다. 처음 값과 저장한 값이 같은 모양이다
            expect(parsed.data).toEqual(COLOPHON_DEFAULT_CONTENT[section]);
        },
    );
});

describe('getColophonData', () => {
    it('저장한 적이 없는 섹션은 처음 값으로 채운다', async () => {
        repository.getColophon.mockResolvedValue(EMPTY);

        expect(await getColophonData()).toEqual(COLOPHON_DEFAULT_CONTENT);
    });

    it('저장한 섹션은 저장소의 값을 쓰고, 나머지만 처음 값으로 채운다', async () => {
        repository.getColophon.mockResolvedValue({
            ...EMPTY,
            human: { content: HUMAN, updatedAt: '2026-11-27T01:12:00.000Z' },
        });

        const data = await getColophonData();

        expect(data.human).toEqual(HUMAN);
        expect(data.head).toEqual(COLOPHON_DEFAULT_CONTENT.head);
    });
});

describe('getColophonTeaser', () => {
    it('머리의 한 줄 요약과 과정의 단계를 낸다', async () => {
        repository.getColophon.mockResolvedValue({
            ...EMPTY,
            head: {
                content: { ...COLOPHON_DEFAULT_CONTENT.head, summary: '고친 요약' },
                updatedAt: null,
            },
        });

        expect(await getColophonTeaser()).toEqual({
            summary: '고친 요약',
            steps: COLOPHON_DEFAULT_CONTENT.process.items,
        });
    });
});

describe('getColophonEditor', () => {
    it('저장한 섹션에는 한국 시각의 수정 일시를, 저장한 적이 없는 섹션에는 null 을 붙인다', async () => {
        repository.getColophon.mockResolvedValue({
            ...EMPTY,
            human: { content: HUMAN, updatedAt: '2026-11-27T01:12:00.000Z' },
        });

        const editor = await getColophonEditor();

        expect(editor.human).toEqual({ content: HUMAN, updatedAtText: '2026.11.27 (10:12)' });
        expect(editor.head).toEqual({
            content: COLOPHON_DEFAULT_CONTENT.head,
            updatedAtText: null,
        });
    });
});

describe('saveColophonSection', () => {
    it('규칙에 맞으면 다듬은 값으로 저장한다', async () => {
        const isSaved = await saveColophonSection('stack', {
            techs: [' Next.js 16 '],
            fonts: COLOPHON_DEFAULT_CONTENT.stack.fonts,
        });

        expect(isSaved).toBe(true);
        expect(repository.saveSection).toHaveBeenCalledWith('stack', {
            techs: ['Next.js 16'],
            fonts: COLOPHON_DEFAULT_CONTENT.stack.fonts,
        });
    });

    it('과정의 단계를 더하거나 빼도 저장한다', async () => {
        const [first] = COLOPHON_DEFAULT_CONTENT.process.items;
        const added = [
            ...COLOPHON_DEFAULT_CONTENT.process.items,
            { title: '배포한다', role: 'CLAUDE', sectionId: 'stack' },
        ];

        expect(await saveColophonSection('process', { items: added })).toBe(true);
        expect(await saveColophonSection('process', { items: [first] })).toBe(true);
    });

    it.each([
        ['단계가 하나도 없으면', []],
        ['역할이 정해진 것이 아니면', [{ title: '기획한다', role: 'GEMINI', sectionId: 'design' }]],
        [
            '이어지는 섹션이 과정 아래에 없으면',
            [{ title: '기획한다', role: 'ME', sectionId: 'head' }],
        ],
    ])('과정에 %s 저장하지 않는다', async (_name, items) => {
        expect(await saveColophonSection('process', { items })).toBe(false);
        expect(repository.saveSection).not.toHaveBeenCalled();
    });

    it('항목을 더하거나 줄여도 1개 이상이면 저장한다', async () => {
        expect(await saveColophonSection('human', { items: HUMAN.items.slice(0, 1) })).toBe(true);
        expect(
            await saveColophonSection('human', { items: [...HUMAN.items, ...HUMAN.items] }),
        ).toBe(true);
    });

    it.each([
        ['head', { ...COLOPHON_DEFAULT_CONTENT.head, stats: [] }],
        ['design', { items: [] }],
        ['develop', { items: [] }],
        ['guards', { items: [] }],
        ['human', { items: [] }],
        ['stack', { ...COLOPHON_DEFAULT_CONTENT.stack, techs: [] }],
        ['stack', { ...COLOPHON_DEFAULT_CONTENT.stack, fonts: [] }],
    ] as const)('%s 의 목록이 비면 저장하지 않는다', async (section, content) => {
        expect(await saveColophonSection(section, content)).toBe(false);
        expect(repository.saveSection).not.toHaveBeenCalled();
    });

    it('폰트의 견본 글꼴이 이 사이트의 글꼴이 아니면 저장하지 않는다', async () => {
        const [font] = COLOPHON_DEFAULT_CONTENT.stack.fonts;
        const isSaved = await saveColophonSection('stack', {
            techs: ['Next.js 16'],
            fonts: [{ ...font, face: 'COMIC' }],
        });

        expect(isSaved).toBe(false);
    });

    it.each(['javascript:alert(1)', 'http://example.com', 'docs/plan'])(
        '링크의 주소가 %s 이면 저장하지 않는다',
        async (href) => {
            const items = COLOPHON_DEFAULT_CONTENT.develop.items.map((item, index) =>
                index === 0 ? { ...item, links: [{ label: '링크', href }] } : item,
            );

            expect(await saveColophonSection('develop', { items })).toBe(false);
            expect(repository.saveSection).not.toHaveBeenCalled();
        },
    );

    it('링크를 모두 빼도 저장한다', async () => {
        const items = COLOPHON_DEFAULT_CONTENT.develop.items.map((item) => ({
            ...item,
            links: [],
        }));

        expect(await saveColophonSection('develop', { items })).toBe(true);
    });

    it('다른 섹션의 모양으로 보내면 저장하지 않는다', async () => {
        const isSaved = await saveColophonSection('head', HUMAN);

        expect(isSaved).toBe(false);
        expect(repository.saveSection).not.toHaveBeenCalled();
    });
});
