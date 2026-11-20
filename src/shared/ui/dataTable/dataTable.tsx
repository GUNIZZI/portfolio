'use client';

import {
    type MouseEvent,
    type ReactNode,
    type Ref,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import {
    type Cell,
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    type OnChangeFn,
    type RowSelectionState,
    type SortingState,
    type Table as TanStackTable,
    useReactTable,
} from '@tanstack/react-table';
import { X } from 'lucide-react';

import { cn } from '@/shared/util/cn';

import { Button } from '../button/button';
import { Pagination } from '../pagination/pagination';
import { Separator } from '../separator/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table/table';
import type { DataTablePage } from './dataTable.types';

/*
 * 목록 표. Kozipsa 의 DataTable 을 가져왔다.(Kozipsa packages/ui 의 custom/dataTable, 2026-11-18 사용자 결정)
 * prop 의 이름과 동작은 Kozipsa 와 같다. 다른 점은 dataTable.md 의 「Kozipsa 원본과 다른 점」 에 있다.
 */

/** 페이지 크기를 주지 않았을 때 쓰는 값. 페이저가 없으면 쓰이지 않는다 */
const DEFAULT_PAGE_SIZE = 10;
/** 한 번에 늘어놓는 페이지 번호의 개수 */
const DEFAULT_PAGING_LEN = 10;
/** 누른 자리에서 이만큼(px) 넘게 움직였으면 끌기로 보고 행 클릭으로 세지 않는다 */
const DRAG_THRESHOLD = 5;
const DEFAULT_EMPTY_MESSAGE = '데이터가 없습니다.';

const COUNT_FORMAT = new Intl.NumberFormat('ko-KR');

interface OwnProps<TRow> {
    /**
     * 컬럼 정의. TanStack 의 ColumnDef 그대로다. 열의 폭과 정렬은 meta.className 으로 정한다
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 열마다 값의 타입이 달라 한 타입으로 묶을 수 없다. TanStack 의 관례다
    columns: ColumnDef<TRow, any>[];
    /** 목록 한 페이지. 없으면 아무것도 그리지 않는다 */
    data: DataTablePage<TRow> | null | undefined;
    /** 한 페이지 건수와 한 번에 늘어놓을 번호의 개수. 페이저를 쓸 때 준다 */
    opts?: { pageSize: number; pagingLen?: number };
    /** 지금 페이지. 1부터 센다. 주지 않거나 null 이면 페이저를 그리지 않는다 */
    page?: number | null;
    hndlPage?: (page: number) => void;
    /** 바깥이 정한 정렬. 주면 안쪽 상태를 이 값에 맞춘다 */
    sorts?: SortingState;
    /** 정렬을 다 풀었을 때 되돌아갈 정렬 */
    defaultSort?: SortingState;
    hndlSort?: (sorting: SortingState) => void;
    /** 바깥이 정한 필터. 주면 안쪽 상태를 이 값에 맞춘다 */
    filters?: ColumnFiltersState;
    hndlFilter?: (filters: ColumnFiltersState) => void;
    hndlRowClick?: (item: TRow) => void;
    /** 참을 돌려준 행은 눌리지 않고 커서도 바뀌지 않는다 */
    disabledRow?: (item: TRow) => boolean;
    /** 선택된 행. 선택의 정본이다. 행의 id 로 대조한다 */
    selections?: TRow[];
    /** hndlRowRemoveSelection 없이 주면 이 페이지의 선택 전부를, 함께 주면 늘어난 행만 받는다 */
    hndlRowSelection?: (rows: TRow[]) => void;
    /** 이 페이지에서 선택을 푼 행을 받는다 */
    hndlRowRemoveSelection?: (rows: TRow[]) => void;
    /** 주면 선택이 있을 때 머리줄에 선택을 모두 푸는 버튼이 붙는다 */
    onClearSelection?: () => void;
    /** 머리줄의 오른쪽 끝. 검색 조건이나 등록 버튼을 둔다 */
    rightSlot?: ReactNode;
    /** 「전체 N」 을 보여 주는가 */
    visibleTotalCnt?: boolean;
    /** 표의 머리 행을 보여 주는가 */
    visibleHeader?: boolean;
    className?: string;
    /** 셀이 table.options.meta 로 꺼내 쓸 값. fullData · totalCount · pageIndex · pageSize 와 이름이 겹치면 덮는다 */
    meta?: Record<string, unknown>;
    /** 행이 없을 때의 문구. 주면 빈 칸의 높이가 문구에 맞게 줄어든다 */
    emptyMessage?: string;
    /** TanStack 의 table 인스턴스를 내준다. 바깥에서 정렬을 초기화할 때 쓴다 */
    ref?: Ref<TanStackTable<TRow>>;
}

/** 행의 id. 선택을 대조할 때 쓴다. id 가 없는 행은 선택이 붙지 않는다 */
function readId(row: unknown): unknown {
    return typeof row === 'object' && row !== null && 'id' in row ? row.id : undefined;
}

function hasSameId(a: unknown, b: unknown): boolean {
    const id = readId(a);
    return id !== undefined && id === readId(b);
}

function isSameState(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

function getCellClassName<TRow>(cell: Cell<TRow, unknown>): string | undefined {
    const className = cell.column.columnDef.meta?.className;
    return typeof className === 'function'
        ? className({ row: cell.row, column: cell.column, table: cell.getContext().table })
        : className;
}

/**
 * 바깥이 잘라 준 한 페이지를 그리는 목록 표. 정렬 · 필터 · 선택은 상태만 갖고 핸들러로 바깥에 알린다.
 * 데이터를 실제로 바꾸는 것은 그 핸들러를 받은 쪽이다.
 */
function DataTable<TRow>({
    columns,
    data,
    opts,
    page = null,
    hndlPage,
    sorts,
    defaultSort,
    hndlSort,
    filters,
    hndlFilter,
    hndlRowClick,
    disabledRow,
    selections,
    hndlRowSelection,
    hndlRowRemoveSelection,
    onClearSelection,
    rightSlot,
    visibleTotalCnt = true,
    visibleHeader = true,
    className,
    meta,
    emptyMessage,
    ref,
}: OwnProps<TRow>) {
    const rows = data?.content ?? [];
    const totalCount = data?.totalElements ?? 0;
    const pageSize = opts?.pageSize ?? DEFAULT_PAGE_SIZE;

    // 정렬. 바깥이 준 값이 바뀌면 안쪽 상태를 맞춘다
    const [sorting, setSorting] = useState<SortingState>(sorts ?? []);
    const [prevSorts, setPrevSorts] = useState(sorts);
    if (sorts !== prevSorts) {
        setPrevSorts(sorts);
        if (sorts && !isSameState(sorting, sorts)) {
            setSorting(sorts);
        }
    }

    // 필터
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(filters ?? []);
    const [prevFilters, setPrevFilters] = useState(filters);
    if (filters !== prevFilters) {
        setPrevFilters(filters);
        if (filters && !isSameState(columnFilters, filters)) {
            setColumnFilters(filters);
        }
    }

    // 선택. 정본은 바깥의 selections 다. 이 페이지의 행 가운데 선택된 것을 자리(index)로 옮겨 적는다
    const rowSelection: RowSelectionState = {};
    rows.forEach((row, index) => {
        if (selections?.some((selected) => hasSameId(selected, row))) {
            rowSelection[String(index)] = true;
        }
    });

    const hndlSortingChange: OnChangeFn<SortingState> = (updater) => {
        const changed = typeof updater === 'function' ? updater(sorting) : updater;
        const next = defaultSort && changed.length === 0 ? defaultSort : changed;
        setSorting(next);
        hndlSort?.(next);
    };

    const hndlColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
        const next = typeof updater === 'function' ? updater(columnFilters) : updater;
        setColumnFilters(next);
        hndlFilter?.(next);
    };

    const hndlRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
        const next = typeof updater === 'function' ? updater(rowSelection) : updater;
        const selectedRows = rows.filter((_, index) => next[String(index)]);
        const prevSelections = selections ?? [];
        const addedRows = selectedRows.filter(
            (row) => !prevSelections.some((selected) => hasSameId(selected, row)),
        );
        // 다른 페이지에서 고른 행은 지금 화면에 없다는 이유로 풀지 않는다
        const removedRows = prevSelections.filter(
            (selected) =>
                rows.some((row) => hasSameId(row, selected)) &&
                !selectedRows.some((row) => hasSameId(row, selected)),
        );
        if (addedRows.length === 0 && removedRows.length === 0) {
            return;
        }
        if (!hndlRowRemoveSelection) {
            hndlRowSelection?.(selectedRows);
            return;
        }
        if (addedRows.length > 0) {
            hndlRowSelection?.(addedRows);
        }
        if (removedRows.length > 0) {
            hndlRowRemoveSelection(removedRows);
        }
    };

    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table 은 메모이제이션할 수 없는 함수를 낸다. 이 컴포넌트는 그 값을 메모하지 않는다
    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // 자르고 정렬하고 거르는 일은 바깥이 한다. 여기서는 상태만 갖는다
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        enableMultiSort: true,
        enableSortingRemoval: true,
        // Shift · Cmd · Ctrl 을 누른 채 누르면 여러 열로 정렬한다
        isMultiSortEvent: (event) => {
            const { shiftKey, metaKey, ctrlKey } = event as MouseEvent;
            return shiftKey || metaKey || ctrlKey;
        },
        onSortingChange: hndlSortingChange,
        onColumnFiltersChange: hndlColumnFiltersChange,
        onRowSelectionChange: hndlRowSelectionChange,
        pageCount: Math.max(1, Math.ceil(totalCount / pageSize)),
        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination: { pageIndex: Math.max(0, (page ?? 1) - 1), pageSize },
        },
        meta: {
            fullData: data,
            totalCount,
            pageIndex: page ?? 1,
            pageSize,
            ...meta,
        },
    });
    useImperativeHandle(ref, () => table, [table]);

    /** 누른 자리. 셀의 글자를 긁는 동안 행 클릭이 일어나지 않게 뗀 자리와 견준다 */
    const mouseDownRef = useRef<{ x: number; y: number } | null>(null);

    function hndlRowMouseDown(event: MouseEvent) {
        mouseDownRef.current = { x: event.clientX, y: event.clientY };
    }

    function hndlRowClickEvent(event: MouseEvent, item: TRow) {
        const start = mouseDownRef.current;
        if (
            start &&
            (Math.abs(event.clientX - start.x) > DRAG_THRESHOLD ||
                Math.abs(event.clientY - start.y) > DRAG_THRESHOLD)
        ) {
            return;
        }
        if (disabledRow?.(item)) return;
        hndlRowClick?.(item);
    }

    if (!data) {
        return null;
    }

    // 빈 목록의 칸은 보이는 열을 모두 덮는다. 문자열 className 에 hidden 이 든 열은 세지 않는다
    const visibleColumnCount = columns.filter((column) => {
        const metaClassName = column.meta?.className;
        return typeof metaClassName === 'string' ? !metaClassName.includes('hidden') : true;
    }).length;
    const hasToolbar = visibleTotalCnt || selections !== undefined || Boolean(rightSlot);
    const tableRows = table.getRowModel().rows;

    return (
        <div
            data-slot="data-table"
            className={cn('w-full px-6 py-5 text-sm text-strong', className)}
        >
            {hasToolbar ? (
                <div className="flex flex-nowrap items-end pb-3">
                    <div className="flex items-center gap-2">
                        {visibleTotalCnt ? (
                            <span className="flex gap-1 text-xs font-normal text-muted-foreground">
                                <span>전체</span>
                                <strong className="font-semibold text-primary">
                                    {COUNT_FORMAT.format(totalCount)}
                                </strong>
                            </span>
                        ) : null}
                        {selections ? (
                            <>
                                {visibleTotalCnt ? (
                                    <Separator orientation="vertical" className="h-3" />
                                ) : null}
                                <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                                    선택
                                    <span className="font-semibold text-strong">
                                        {selections.length}
                                    </span>
                                    {selections.length > 0 && onClearSelection ? (
                                        <Button
                                            variant="ghost"
                                            size="2xs"
                                            aria-label="선택 모두 풀기"
                                            onClick={onClearSelection}
                                            className="items-center"
                                        >
                                            <X className="size-3.5" aria-hidden="true" />
                                        </Button>
                                    ) : null}
                                </span>
                            </>
                        ) : null}
                    </div>
                    <div className="ml-auto">{rightSlot}</div>
                </div>
            ) : null}
            <Table className="md:table-fixed">
                {visibleHeader ? (
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    const metaClassName = header.column.columnDef.meta?.className;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            scope="col"
                                            className={
                                                typeof metaClassName === 'string'
                                                    ? metaClassName
                                                    : undefined
                                            }
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                ) : null}
                <TableBody>
                    {tableRows.length > 0 ? (
                        tableRows.map((row) => {
                            const isRowDisabled = disabledRow?.(row.original) ?? false;
                            return (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? 'selected' : undefined}
                                    onMouseDown={hndlRowMouseDown}
                                    onClick={(event) => {
                                        hndlRowClickEvent(event, row.original);
                                    }}
                                    className={cn(
                                        hndlRowClick && !isRowDisabled && 'cursor-pointer',
                                    )}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn('min-h-7', getCellClassName(cell))}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow className="hover:bg-transparent">
                            <TableCell
                                colSpan={visibleColumnCount}
                                className={cn(
                                    'text-center text-muted-foreground',
                                    emptyMessage ? 'h-45' : 'h-100',
                                )}
                            >
                                {emptyMessage ?? DEFAULT_EMPTY_MESSAGE}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {page !== null ? (
                <Pagination
                    totalCount={totalCount}
                    page={page}
                    pageSize={pageSize}
                    visiblePages={opts?.pagingLen ?? DEFAULT_PAGING_LEN}
                    onPageChange={hndlPage}
                    className="pt-7.5 pb-4"
                />
            ) : null}
        </div>
    );
}

export { DataTable };
