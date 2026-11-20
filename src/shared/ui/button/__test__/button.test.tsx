import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../button';

describe('Button 의 isLoading', () => {
    it('실행 중에는 aria-busy 로 알리고, 눌러도 onClick 을 부르지 않는다', async () => {
        const hndlClick = vi.fn();
        render(
            <Button isLoading onClick={hndlClick}>
                저장
            </Button>,
        );

        const button = screen.getByRole('button', { name: '저장' });
        expect(button).toHaveAttribute('aria-busy', 'true');
        expect(button).toBeEnabled();

        // pointer-events 는 jsdom 이 계산하지 않는다. 키보드로 누른다
        button.focus();
        await userEvent.keyboard('{Enter}');
        expect(hndlClick).not.toHaveBeenCalled();
    });

    it('실행 중에는 Enter 로도 폼을 다시 제출하지 않는다', async () => {
        const hndlSubmit = vi.fn((event: React.SyntheticEvent) => {
            event.preventDefault();
        });
        render(
            <form onSubmit={hndlSubmit}>
                <input aria-label="회사" />
                <Button type="submit" isLoading>
                    저장
                </Button>
            </form>,
        );

        await userEvent.type(screen.getByRole('textbox', { name: '회사' }), '{Enter}');
        expect(hndlSubmit).not.toHaveBeenCalled();
    });

    it('실행 중이 아니면 평소처럼 눌린다', async () => {
        const hndlClick = vi.fn();
        render(<Button onClick={hndlClick}>저장</Button>);

        const button = screen.getByRole('button', { name: '저장' });
        expect(button).not.toHaveAttribute('aria-busy');

        await userEvent.click(button);
        expect(hndlClick).toHaveBeenCalledOnce();
    });
});

describe('Button 의 arrow · icon', () => {
    it('arrow="end" 는 글자 뒤에, arrow="start" 는 글자 앞에 화살표를 그린다', () => {
        const { rerender } = render(<Button arrow="end">다음</Button>);
        const content = () => screen.getByRole('button', { name: '다음' }).lastElementChild;

        expect(content()?.lastElementChild).toHaveClass('lucide-arrow-right');

        rerender(<Button arrow="start">다음</Button>);
        expect(content()?.firstElementChild).toHaveClass('lucide-arrow-left');
    });

    it('sweep 에서 화살표만 밀리고, icon 과 자식으로 넣은 아이콘은 밀리지 않는다', () => {
        render(
            <Button effect="sweep" arrow="end" icon={<svg data-testid="icon" />}>
                <svg data-testid="child" />
                보내기
            </Button>,
        );
        const arrow = screen.getByRole('button', { name: '보내기' }).querySelector('.lucide');

        expect(arrow?.getAttribute('class')).toContain('translate-x-1');
        expect(screen.getByTestId('icon').getAttribute('class') ?? '').not.toContain('translate');
        expect(screen.getByTestId('child').getAttribute('class') ?? '').not.toContain('translate');
    });

    it('effect 를 주지 않으면 화살표도 밀리지 않는다', () => {
        render(<Button arrow="end">다음</Button>);
        const arrow = screen.getByRole('button', { name: '다음' }).querySelector('.lucide');

        expect(arrow?.getAttribute('class')).not.toContain('translate');
    });
});
