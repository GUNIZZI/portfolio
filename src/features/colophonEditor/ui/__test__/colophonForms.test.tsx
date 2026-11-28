import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { saveColophonSectionAction } from '@/entities/colophon/actions/colophon.actions';
import { COLOPHON_DEFAULT_CONTENT } from '@/entities/colophon/model/colophon.constants';

import DevelopForm from '../DevelopForm';
import HumanForm from '../HumanForm';
import ProcessForm from '../ProcessForm';
import StackForm from '../StackForm';

vi.mock('@/shared/ui/toast/ToastProvider', () => ({
    useToast: () => Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), warning: vi.fn() }),
}));
vi.mock('@/entities/colophon/actions/colophon.actions', () => ({
    saveColophonSectionAction: vi.fn(() => Promise.resolve('SAVED')),
}));

const HUMAN = {
    content: {
        items: [1, 2, 3].map((order) => ({ title: `제목 ${order}`, description: '설명' })),
    },
    updatedAtText: null,
};

const PROCESS = { content: COLOPHON_DEFAULT_CONTENT.process, updatedAtText: null };
const DEVELOP = { content: COLOPHON_DEFAULT_CONTENT.develop, updatedAtText: null };
const STACK = { content: COLOPHON_DEFAULT_CONTENT.stack, updatedAtText: null };

function getInput(name: string) {
    const input = document.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (!input) throw new Error(`${name} 입력을 찾지 못했다`);
    return input;
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('제작 과정 폼의 검증', () => {
    it('고친 내용이 없으면 저장 버튼이 막혀 있다', () => {
        render(<HumanForm data={HUMAN} />);

        expect(screen.getByRole('button', { name: '제가 한 일 저장' })).toBeDisabled();
    });

    it('빈 필수 항목에 스키마가 낸 문구를 그리고 저장을 막는다', async () => {
        render(<HumanForm data={HUMAN} />);

        await userEvent.clear(getInput('items.0.title'));
        expect(await screen.findByText('제목을 입력해 주세요.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '제가 한 일 저장' })).toBeDisabled();
    });

    it('규칙에 맞게 고치면 그 섹션의 내용으로 저장하고, 저장한 값을 새 기준으로 삼는다', async () => {
        render(<HumanForm data={HUMAN} />);

        await userEvent.type(getInput('items.0.title'), ' 고침');
        const save = screen.getByRole('button', { name: '제가 한 일 저장' });
        expect(save).toBeEnabled();
        await userEvent.click(save);

        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('human', {
            items: [
                { title: '제목 1 고침', description: '설명' },
                { title: '제목 2', description: '설명' },
                { title: '제목 3', description: '설명' },
            ],
        });
        expect(await screen.findByRole('button', { name: '제가 한 일 저장' })).toBeDisabled();
    });

    it('과정에 단계를 더하면 빈 단계가 맨 아래에 생기고, 이름을 채우면 그 단계까지 저장한다', async () => {
        render(<ProcessForm data={PROCESS} />);

        await userEvent.click(screen.getByRole('button', { name: '단계 추가' }));
        expect(screen.getByRole('button', { name: '전체 과정 저장' })).toBeDisabled();

        await userEvent.type(screen.getByRole('textbox', { name: '5단계 이름' }), '배포한다');
        await userEvent.click(screen.getByRole('button', { name: '전체 과정 저장' }));

        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('process', {
            items: [
                ...COLOPHON_DEFAULT_CONTENT.process.items,
                { title: '배포한다', role: 'ME', sectionId: 'design' },
            ],
        });
    });

    it('과정의 단계를 빼고 순서를 바꾸면 그 순서로 저장한다', async () => {
        render(<ProcessForm data={PROCESS} />);

        await userEvent.click(screen.getByRole('button', { name: '2단계 빼기' }));
        await userEvent.click(screen.getByRole('button', { name: '3단계 위로' }));
        await userEvent.click(screen.getByRole('button', { name: '전체 과정 저장' }));

        const [concept, , design, develop] = COLOPHON_DEFAULT_CONTENT.process.items;
        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('process', {
            items: [concept, develop, design],
        });
    });

    it('과정의 단계가 하나만 남으면 뺄 수 없다', () => {
        const [first] = COLOPHON_DEFAULT_CONTENT.process.items;
        render(<ProcessForm data={{ content: { items: [first!] }, updatedAtText: null }} />);

        expect(screen.getByRole('button', { name: '1단계 빼기' })).toBeDisabled();
    });

    it('링크의 주소가 https:// 나 / 로 시작하지 않으면 알리고 저장을 막는다', async () => {
        render(<DevelopForm data={DEVELOP} />);

        const href = getInput('items.0.links.0.href');
        await userEvent.clear(href);
        await userEvent.type(href, 'javascript:alert(1)');

        expect(
            await screen.findByText('주소는 https:// 나 / 로 시작해야 합니다.'),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '개발 과정 저장' })).toBeDisabled();
    });

    it('링크를 더하면 빈 줄이 생기고, 채우기 전에는 저장을 막는다', async () => {
        render(<DevelopForm data={DEVELOP} />);

        // 2단계에는 링크가 없다
        const addButtons = screen.getAllByRole('button', { name: '+ 링크 더하기' });
        await userEvent.click(addButtons[1]!);

        expect(screen.getByRole('textbox', { name: '2단계 링크 1 주소' })).toHaveValue('');
        expect(screen.getByRole('button', { name: '개발 과정 저장' })).toBeDisabled();
    });

    it('링크를 빼면 그 링크 없이 저장한다', async () => {
        render(<DevelopForm data={DEVELOP} />);

        await userEvent.click(screen.getByRole('button', { name: '1단계 링크 1 빼기' }));
        await userEvent.click(screen.getByRole('button', { name: '개발 과정 저장' }));

        const [first, ...rest] = COLOPHON_DEFAULT_CONTENT.develop.items;
        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('develop', {
            items: [{ ...first, links: first!.links.slice(1) }, ...rest],
        });
    });

    it('링크의 순서를 바꾸면 그 순서로 저장한다', async () => {
        render(<DevelopForm data={DEVELOP} />);

        await userEvent.click(screen.getByRole('button', { name: '1단계 링크 2 위로' }));
        await userEvent.click(screen.getByRole('button', { name: '개발 과정 저장' }));

        const [first, ...rest] = COLOPHON_DEFAULT_CONTENT.develop.items;
        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('develop', {
            items: [{ ...first, links: first!.links.toReversed() }, ...rest],
        });
    });

    it('개발 단계를 옮기면 그 단계의 링크도 함께 옮긴다', async () => {
        render(<DevelopForm data={DEVELOP} />);

        await userEvent.click(screen.getByRole('button', { name: '1단계 아래로' }));
        await userEvent.click(screen.getByRole('button', { name: '개발 과정 저장' }));

        const [first, second, ...rest] = COLOPHON_DEFAULT_CONTENT.develop.items;
        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('develop', {
            items: [second, first, ...rest],
        });
    });

    it('사람이 한 일에 항목을 더하고, 채운 뒤 앞의 항목을 빼면 그대로 저장한다', async () => {
        render(<HumanForm data={HUMAN} />);

        await userEvent.click(screen.getByRole('button', { name: '항목 추가' }));
        expect(screen.getByRole('button', { name: '제가 한 일 저장' })).toBeDisabled();

        await userEvent.type(getInput('items.3.title'), '새 제목');
        await userEvent.type(getInput('items.3.description'), '새 설명');
        await userEvent.click(screen.getByRole('button', { name: '항목 1 빼기' }));
        await userEvent.click(screen.getByRole('button', { name: '제가 한 일 저장' }));

        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('human', {
            items: [
                { title: '제목 2', description: '설명' },
                { title: '제목 3', description: '설명' },
                { title: '새 제목', description: '새 설명' },
            ],
        });
    });

    it('폰트를 더하면 견본 글꼴이 본문 글꼴인 빈 줄이 생기고, 순서를 바꿔 저장한다', async () => {
        render(<StackForm data={STACK} />);

        await userEvent.click(screen.getByRole('button', { name: '폰트 추가' }));
        await userEvent.type(getInput('fonts.3.name'), 'Pretendard');
        await userEvent.type(getInput('fonts.3.usage'), '관리 화면');
        await userEvent.type(getInput('fonts.3.license'), 'SIL Open Font License 1.1');
        await userEvent.click(screen.getByRole('button', { name: '폰트 4 위로' }));
        await userEvent.click(screen.getByRole('button', { name: '기술과 폰트 저장' }));

        const [marker, hand, sans] = COLOPHON_DEFAULT_CONTENT.stack.fonts;
        expect(saveColophonSectionAction).toHaveBeenCalledExactlyOnceWith('stack', {
            techs: COLOPHON_DEFAULT_CONTENT.stack.techs,
            fonts: [
                marker,
                hand,
                {
                    name: 'Pretendard',
                    face: 'SANS',
                    usage: '관리 화면',
                    license: 'SIL Open Font License 1.1',
                },
                sans,
            ],
        });
    });

    it('목록에 1개만 남으면 뺄 수 없다. 링크는 모두 뺄 수 있다', () => {
        const [step] = COLOPHON_DEFAULT_CONTENT.develop.items;
        render(<DevelopForm data={{ content: { items: [step!] }, updatedAtText: null }} />);

        expect(screen.getByRole('button', { name: '1단계 빼기' })).toBeDisabled();
        expect(screen.getByRole('button', { name: '1단계 링크 1 빼기' })).toBeEnabled();
    });
});
