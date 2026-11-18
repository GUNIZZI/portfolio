import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../../button/button';
import ConfirmDialog from '../ConfirmDialog';
import { ConfirmDialogProvider, useConfirmDialog } from '../ConfirmDialogProvider';

// jsdom 의 처음 주소다. 띄운 화면과 지금 화면이 같아야 창을 그린다
vi.mock('next/navigation', () => ({ usePathname: () => window.location.pathname }));

const hndlConfirm = vi.fn();
const hndlCancel = vi.fn();

function Opener({ id }: { id?: string }) {
    const { addConfirmDialog } = useConfirmDialog();
    return (
        <Button
            onClick={() => {
                addConfirmDialog({
                    id,
                    variant: 'delete',
                    description: '되돌릴 수 없습니다.',
                    confirmText: '삭제',
                    cancelText: '취소',
                    onConfirm: hndlConfirm,
                    onCancel: hndlCancel,
                });
            }}
        >
            지우기
        </Button>
    );
}

function renderOpener(id?: string) {
    render(
        <ConfirmDialogProvider>
            <Opener id={id} />
        </ConfirmDialogProvider>,
    );
}

async function waitForClosed() {
    // 사라지는 연출이 끝난 뒤에 걷어 낸다
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
}

beforeEach(() => {
    hndlConfirm.mockClear();
    hndlCancel.mockClear();
});

describe('addConfirmDialog', () => {
    it('부르면 종류의 기본 제목과 설명을 그리고, 처음 포커스를 취소에 둔다', async () => {
        renderOpener();
        await userEvent.click(screen.getByRole('button', { name: '지우기' }));

        const dialog = screen.getByRole('alertdialog', { name: '삭제 하시겠습니까?' });
        expect(dialog).toHaveAccessibleDescription('되돌릴 수 없습니다.');
        await waitFor(() => expect(screen.getByRole('button', { name: '취소' })).toHaveFocus());
    });

    it('실행 버튼을 누르면 onConfirm 을 부르고 창을 닫는다', async () => {
        renderOpener();
        await userEvent.click(screen.getByRole('button', { name: '지우기' }));
        await userEvent.click(screen.getByRole('button', { name: '삭제' }));

        expect(hndlConfirm).toHaveBeenCalledOnce();
        expect(hndlCancel).not.toHaveBeenCalled();
        await waitForClosed();
    });

    it('취소 버튼과 Esc 는 onCancel 을 부르고, 닫으면 포커스를 띄운 버튼으로 돌려준다', async () => {
        renderOpener();
        const opener = screen.getByRole('button', { name: '지우기' });
        await userEvent.click(opener);
        await userEvent.click(screen.getByRole('button', { name: '취소' }));
        await waitForClosed();
        expect(opener).toHaveFocus();

        await userEvent.click(opener);
        await userEvent.keyboard('{Escape}');
        await waitForClosed();

        expect(hndlCancel).toHaveBeenCalledTimes(2);
        expect(hndlConfirm).not.toHaveBeenCalled();
    });

    it('같은 id 는 한 번만 뜬다', async () => {
        renderOpener('delete-experience');
        const opener = screen.getByRole('button', { name: '지우기' });
        await userEvent.click(opener);
        // 창이 떠 있는 동안은 뒤의 버튼을 마우스로 누를 수 없다. 직접 누른다
        opener.click();

        await waitFor(() => {
            expect(screen.getAllByRole('alertdialog')).toHaveLength(1);
        });
    });
});

describe('ConfirmDialog', () => {
    it('cancelText 가 없으면 취소 버튼을 그리지 않는다', () => {
        render(<ConfirmDialog open onOpenChange={vi.fn()} title="저장했습니다" />);

        expect(screen.getByRole('alertdialog', { name: '저장했습니다' })).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(1);
    });
});
