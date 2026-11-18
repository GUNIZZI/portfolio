import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { saveAboutSectionAction } from '@/entities/about/actions/about.actions';

import HomeForm from '../HomeForm';
import PrinciplesForm from '../PrinciplesForm';

vi.mock('@/shared/ui/toast/ToastProvider', () => ({
    useToast: () => Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), warning: vi.fn() }),
}));
vi.mock('@/entities/about/actions/about.actions', () => ({
    saveAboutSectionAction: vi.fn(() => Promise.resolve('SAVED')),
}));

const PRINCIPLES = {
    content: {
        items: [1, 2, 3, 4].map((order) => ({ title: `제목 ${order}`, description: '설명' })),
    },
    updatedAtText: null,
};

const HOME = {
    content: {
        lines: ['첫 문단'],
        stats: [
            { value: 30, suffix: '', label: '나이' },
            { value: 50, suffix: '+', label: '프로젝트' },
            { value: 10, suffix: '년', label: '경력' },
        ],
    },
    updatedAtText: null,
};

function getInput(name: string) {
    const input = document.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (!input) throw new Error(`${name} 입력을 찾지 못했다`);
    return input;
}

describe('소개 폼의 검증', () => {
    it('고친 내용이 없으면 저장 버튼이 막혀 있다', () => {
        render(<PrinciplesForm data={PRINCIPLES} />);

        expect(screen.getByRole('button', { name: '일하는 방식 저장' })).toBeDisabled();
    });

    it('빈 필수 항목에 스키마가 낸 문구를 그리고 저장을 막는다', async () => {
        render(<PrinciplesForm data={PRINCIPLES} />);

        await userEvent.clear(getInput('items.0.title'));
        expect(await screen.findByText('제목을 입력해 주세요.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '일하는 방식 저장' })).toBeDisabled();
    });

    it('규칙에 맞게 고치면 그 내용으로 저장하고, 저장한 값을 새 기준으로 삼는다', async () => {
        render(<PrinciplesForm data={PRINCIPLES} />);

        await userEvent.type(getInput('items.0.title'), ' 고침');
        const save = screen.getByRole('button', { name: '일하는 방식 저장' });
        expect(save).toBeEnabled();
        await userEvent.click(save);

        expect(saveAboutSectionAction).toHaveBeenCalledExactlyOnceWith('principles', {
            items: [
                { title: '제목 1 고침', description: '설명' },
                { title: '제목 2', description: '설명' },
                { title: '제목 3', description: '설명' },
                { title: '제목 4', description: '설명' },
            ],
        });
        expect(await screen.findByRole('button', { name: '일하는 방식 저장' })).toBeDisabled();
    });

    it('숫자를 비우면 숫자만 입력하라고 알린다', async () => {
        render(<HomeForm data={HOME} />);

        await userEvent.clear(getInput('stats.0.value'));
        expect(await screen.findByText('숫자만 입력해 주세요.')).toBeInTheDocument();
    });

    it('소개 문단에 빈 줄을 더하면 그 줄에 알린다', async () => {
        render(<HomeForm data={HOME} />);

        await userEvent.click(screen.getByRole('button', { name: '+ 문단 더하기' }));
        expect(await screen.findByText('소개 문단을 입력해 주세요.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '홈 소개 저장' })).toBeDisabled();
    });
});
