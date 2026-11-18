import type { ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTable } from '../dataTable';
import type { DataTablePage } from '../dataTable.types';

interface Item {
    id: number;
    title: string;
}

const FIRST: Item = { id: 1, title: '첫째' };
const SECOND: Item = { id: 2, title: '둘째' };
const THIRD: Item = { id: 3, title: '셋째' };
const ITEMS: Item[] = [FIRST, SECOND, THIRD];

const PAGE: DataTablePage<Item> = { content: ITEMS, totalElements: 1234 };

const COLUMNS: ColumnDef<Item>[] = [
    {
        id: 'select',
        header: '고르기',
        cell: ({ row }) => (
            <input
                type="checkbox"
                aria-label={`${row.original.title} 선택`}
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            />
        ),
    },
    {
        id: 'title',
        accessorKey: 'title',
        header: ({ column }) => (
            <button type="button" onClick={column.getToggleSortingHandler()}>
                제목
            </button>
        ),
        meta: { className: 'w-40' },
    },
];

describe('DataTable 그리기', () => {
    it('머리 행과 받은 행을 그린다', () => {
        render(<DataTable columns={COLUMNS} data={PAGE} />);

        expect(screen.getByRole('columnheader', { name: '제목' })).toHaveClass('w-40');
        expect(screen.getAllByRole('row')).toHaveLength(ITEMS.length + 1);
        expect(screen.getByRole('cell', { name: '둘째' })).toHaveClass('w-40');
    });

    it('data 가 없으면 아무것도 그리지 않는다', () => {
        const { container } = render(<DataTable columns={COLUMNS} data={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('전체 건수를 천 단위로 끊어 적고, 끌 수 있다', () => {
        const { rerender } = render(<DataTable columns={COLUMNS} data={PAGE} />);
        expect(screen.getByText('1,234')).toBeInTheDocument();

        rerender(<DataTable columns={COLUMNS} data={PAGE} visibleTotalCnt={false} />);
        expect(screen.queryByText('1,234')).not.toBeInTheDocument();
    });

    it('행이 없으면 문구 한 줄을 모든 열에 걸쳐 그린다', () => {
        render(
            <DataTable
                columns={COLUMNS}
                data={{ content: [], totalElements: 0 }}
                emptyMessage="등록한 경력이 없습니다."
            />,
        );

        const cell = screen.getByRole('cell', { name: '등록한 경력이 없습니다.' });
        expect(cell).toHaveAttribute('colspan', String(COLUMNS.length));
    });

    it('머리줄의 오른쪽 끝에 넘긴 것을 그린다', () => {
        render(<DataTable columns={COLUMNS} data={PAGE} rightSlot={<a href="/new">등록</a>} />);
        expect(screen.getByRole('link', { name: '등록' })).toBeInTheDocument();
    });
});

describe('DataTable 페이저', () => {
    it('page 를 주지 않으면 페이저를 그리지 않는다', () => {
        render(<DataTable columns={COLUMNS} data={PAGE} />);
        expect(screen.queryByRole('navigation', { name: '페이지' })).not.toBeInTheDocument();
    });

    it('page 를 주면 페이저를 그리고 누른 번호를 알린다', async () => {
        const hndlPage = vi.fn();
        render(
            <DataTable
                columns={COLUMNS}
                data={PAGE}
                opts={{ pageSize: 10, pagingLen: 5 }}
                page={1}
                hndlPage={hndlPage}
            />,
        );

        const pager = screen.getByRole('navigation', { name: '페이지' });
        expect(within(pager).getByRole('button', { name: '1' })).toHaveAttribute(
            'aria-current',
            'page',
        );
        expect(within(pager).getByRole('button', { name: '이전 페이지' })).toBeDisabled();

        await userEvent.click(within(pager).getByRole('button', { name: '3' }));
        expect(hndlPage).toHaveBeenCalledWith(3);

        await userEvent.click(within(pager).getByRole('button', { name: '다음 페이지' }));
        expect(hndlPage).toHaveBeenLastCalledWith(2);
    });
});

describe('DataTable 행 클릭', () => {
    it('누른 행의 값을 알린다', async () => {
        const hndlRowClick = vi.fn();
        render(<DataTable columns={COLUMNS} data={PAGE} hndlRowClick={hndlRowClick} />);

        await userEvent.click(screen.getByRole('cell', { name: '둘째' }));
        expect(hndlRowClick).toHaveBeenCalledWith(SECOND);
    });

    it('disabledRow 가 참을 돌려준 행은 눌리지 않고 커서도 바뀌지 않는다', async () => {
        const hndlRowClick = vi.fn();
        render(
            <DataTable
                columns={COLUMNS}
                data={PAGE}
                hndlRowClick={hndlRowClick}
                disabledRow={(item) => item.id === 2}
            />,
        );

        const disabledRow = screen.getByRole('cell', { name: '둘째' }).closest('tr');
        const enabledRow = screen.getByRole('cell', { name: '첫째' }).closest('tr');
        expect(disabledRow).not.toHaveClass('cursor-pointer');
        expect(enabledRow).toHaveClass('cursor-pointer');

        await userEvent.click(screen.getByRole('cell', { name: '둘째' }));
        expect(hndlRowClick).not.toHaveBeenCalled();
    });
});

describe('DataTable 정렬', () => {
    it('처음 그릴 때는 알리지 않고, 머리를 누르면 정렬을 알린다', async () => {
        const hndlSort = vi.fn();
        render(<DataTable columns={COLUMNS} data={PAGE} hndlSort={hndlSort} />);
        expect(hndlSort).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole('button', { name: '제목' }));
        expect(hndlSort).toHaveBeenLastCalledWith([{ id: 'title', desc: false }]);
    });

    it('정렬을 다 풀면 defaultSort 로 되돌린다', async () => {
        const hndlSort = vi.fn();
        const defaultSort = [{ id: 'title', desc: true }];
        render(
            <DataTable
                columns={COLUMNS}
                data={PAGE}
                sorts={defaultSort}
                defaultSort={defaultSort}
                hndlSort={hndlSort}
            />,
        );

        // 내림 → 없음. 없음 대신 기본 정렬로 돌아간다
        await userEvent.click(screen.getByRole('button', { name: '제목' }));
        expect(hndlSort).toHaveBeenLastCalledWith(defaultSort);
    });
});

describe('DataTable 선택', () => {
    it('selections 에 있는 행을 선택된 것으로 그리고 개수를 적는다', () => {
        render(<DataTable columns={COLUMNS} data={PAGE} selections={[SECOND]} />);

        expect(screen.getByRole('checkbox', { name: '둘째 선택' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: '첫째 선택' })).not.toBeChecked();
        expect(screen.getByText('선택').parentElement).toHaveTextContent('선택1');
    });

    it('hndlRowSelection 만 주면 이 페이지의 선택 전부를 알린다', async () => {
        const hndlRowSelection = vi.fn();
        render(
            <DataTable
                columns={COLUMNS}
                data={PAGE}
                selections={[FIRST]}
                hndlRowSelection={hndlRowSelection}
            />,
        );

        await userEvent.click(screen.getByRole('checkbox', { name: '셋째 선택' }));
        expect(hndlRowSelection).toHaveBeenCalledWith([FIRST, THIRD]);
    });

    it('hndlRowRemoveSelection 을 함께 주면 늘어난 행과 줄어든 행을 나눠 알린다', async () => {
        const hndlRowSelection = vi.fn();
        const hndlRowRemoveSelection = vi.fn();
        // 4번은 다른 페이지에서 고른 행이다
        const otherPageItem = { id: 4, title: '넷째' };
        render(
            <DataTable
                columns={COLUMNS}
                data={PAGE}
                selections={[FIRST, otherPageItem]}
                hndlRowSelection={hndlRowSelection}
                hndlRowRemoveSelection={hndlRowRemoveSelection}
            />,
        );

        await userEvent.click(screen.getByRole('checkbox', { name: '셋째 선택' }));
        expect(hndlRowSelection).toHaveBeenCalledWith([THIRD]);
        expect(hndlRowRemoveSelection).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole('checkbox', { name: '첫째 선택' }));
        expect(hndlRowRemoveSelection).toHaveBeenCalledWith([FIRST]);
    });

    it('onClearSelection 을 주면 선택이 있을 때 모두 푸는 버튼이 붙는다', async () => {
        const onClearSelection = vi.fn();
        render(
            <DataTable
                columns={COLUMNS}
                data={PAGE}
                selections={[FIRST]}
                onClearSelection={onClearSelection}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: '선택 모두 풀기' }));
        expect(onClearSelection).toHaveBeenCalledOnce();
    });
});
