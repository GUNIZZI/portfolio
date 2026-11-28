import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
    reorderProjectListAction,
    setProjectFeaturedAction,
    setProjectPublishedAction,
} from '@/entities/project/actions/project.actions';
import type { ProjectRowData } from '@/entities/project/model/project.types';

import ProjectList from '../ProjectList';

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), warning: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock('@/shared/ui/toast/ToastProvider', () => ({ useToast: () => toast }));
vi.mock('@/shared/ui/alertDialog/ConfirmDialogProvider', () => ({
    useConfirmDialog: () => ({ addConfirmDialog: vi.fn() }),
}));
vi.mock('@/entities/project/actions/project.actions', () => ({
    reorderProjectListAction: vi.fn(() => Promise.resolve('SAVED')),
    setProjectPublishedAction: vi.fn(() => Promise.resolve('SAVED')),
    setProjectFeaturedAction: vi.fn(() => Promise.resolve('SAVED')),
    deleteProjectAction: vi.fn(() => Promise.resolve('SAVED')),
}));

const ROWS: ProjectRowData[] = [
    {
        id: 'a',
        title: 'A',
        category: 'Admin',
        image: null,
        isPublished: true,
        isFeatured: true,
        updatedAtText: '2026.11.12 (10:12)',
    },
    {
        id: 'b',
        title: 'B',
        category: 'Dashboard',
        image: null,
        isPublished: true,
        isFeatured: false,
        updatedAtText: null,
    },
    {
        id: 'c',
        title: 'C',
        category: 'Admin',
        image: null,
        isPublished: false,
        isFeatured: false,
        updatedAtText: null,
    },
];

/** 표의 몸에 있는 줄의 제목을 위에서부터 읽는다 */
function getTitles() {
    return screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => within(row).getByRole('link').textContent);
}

/** 표 위에 적힌 공개 · 홈에 표시 건수 */
function getCountText() {
    return screen.getByText(/홈에 표시/, { selector: 'p' }).textContent;
}

describe('ProjectList', () => {
    // jsdom 에 없는 것을 채운다. Radix 의 Switch 가 크기를 잴 때 부른다
    beforeAll(() => {
        vi.stubGlobal(
            'ResizeObserver',
            class {
                observe = vi.fn();
                unobserve = vi.fn();
                disconnect = vi.fn();
            },
        );
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('전체 · 공개 · 홈에 표시 건수를 보여 준다', () => {
        render(<ProjectList projects={ROWS} />);
        expect(screen.getByText('전체').parentElement?.textContent).toBe('전체3');
        expect(getCountText()).toBe('공개 2건 · 홈에 표시 1건');
    });

    it('프로젝트가 없으면 없다고 알린다', () => {
        render(<ProjectList projects={[]} />);
        expect(screen.getByText('등록한 프로젝트가 없습니다.')).toBeInTheDocument();
    });

    it('첫 줄은 위로, 끝 줄은 아래로 옮길 수 없다', () => {
        render(<ProjectList projects={ROWS} />);
        expect(screen.getByRole('button', { name: 'A 위로' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'A 아래로' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'C 아래로' })).toBeDisabled();
    });

    it('아래로 버튼을 누르면 줄을 옮기고 곧바로 순서를 저장한다', async () => {
        const user = userEvent.setup();
        render(<ProjectList projects={ROWS} />);

        await user.click(screen.getByRole('button', { name: 'A 아래로' }));

        expect(getTitles()).toEqual(['B', 'A', 'C']);
        expect(reorderProjectListAction).toHaveBeenCalledWith(['b', 'a', 'c']);
        expect(toast.success).toHaveBeenCalledWith('순서를 저장했습니다');
        // 누른 버튼에 포커스가 남는다
        expect(screen.getByRole('button', { name: 'A 아래로' })).toHaveFocus();
    });

    it('끝에 닿아 누른 버튼이 비활성이 되면 반대쪽 버튼으로 포커스를 보낸다', async () => {
        const user = userEvent.setup();
        render(<ProjectList projects={ROWS} />);

        await user.click(screen.getByRole('button', { name: 'B 위로' }));

        expect(getTitles()).toEqual(['B', 'A', 'C']);
        expect(screen.getByRole('button', { name: 'B 아래로' })).toHaveFocus();
    });

    it('순서를 저장하지 못하면 옮기기 전으로 되돌리고 실패를 알린다', async () => {
        vi.mocked(reorderProjectListAction).mockResolvedValueOnce('FAILED');
        const user = userEvent.setup();
        render(<ProjectList projects={ROWS} />);

        await user.click(screen.getByRole('button', { name: 'A 아래로' }));

        expect(getTitles()).toEqual(['A', 'B', 'C']);
        expect(toast.error).toHaveBeenCalledWith('저장하지 못했습니다. 다시 시도해 주세요');
    });

    it('비공개 프로젝트의 홈에 표시 스위치는 누를 수 없다', () => {
        render(<ProjectList projects={ROWS} />);
        expect(screen.getByRole('switch', { name: 'C 홈에 표시' })).toBeDisabled();
        expect(screen.getByRole('switch', { name: 'B 홈에 표시' })).toBeEnabled();
    });

    it('홈에 표시를 켜면 곧바로 저장하고 건수가 바뀐다', async () => {
        const user = userEvent.setup();
        render(<ProjectList projects={ROWS} />);

        await user.click(screen.getByRole('switch', { name: 'B 홈에 표시' }));

        expect(setProjectFeaturedAction).toHaveBeenCalledWith('b', true);
        expect(toast.success).toHaveBeenCalledWith('홈에 표시했습니다');
        expect(getCountText()).toBe('공개 2건 · 홈에 표시 2건');
    });

    it('공개를 끄면 홈에 표시도 함께 꺼지고 스위치가 비활성이 된다', async () => {
        const user = userEvent.setup();
        render(<ProjectList projects={ROWS} />);

        await user.click(screen.getByRole('switch', { name: 'A 공개' }));

        expect(setProjectPublishedAction).toHaveBeenCalledWith('a', false);
        expect(toast.success).toHaveBeenCalledWith('프로젝트를 비공개로 바꿨습니다');
        expect(screen.getByRole('switch', { name: 'A 홈에 표시' })).not.toBeChecked();
        expect(screen.getByRole('switch', { name: 'A 홈에 표시' })).toBeDisabled();
        expect(getCountText()).toBe('공개 1건 · 홈에 표시 0건');
    });

    it('공개 전환을 저장하지 못하면 스위치와 건수를 되돌린다', async () => {
        vi.mocked(setProjectPublishedAction).mockResolvedValueOnce('FAILED');
        const user = userEvent.setup();
        render(<ProjectList projects={ROWS} />);

        await user.click(screen.getByRole('switch', { name: 'A 공개' }));

        expect(screen.getByRole('switch', { name: 'A 공개' })).toBeChecked();
        expect(screen.getByRole('switch', { name: 'A 홈에 표시' })).toBeChecked();
        expect(getCountText()).toBe('공개 2건 · 홈에 표시 1건');
        expect(toast.error).toHaveBeenCalled();
    });
});
