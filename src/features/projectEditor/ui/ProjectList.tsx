'use client';

import { createContext, use, useEffect, useId, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

import {
    reorderProjectListAction,
    setProjectFeaturedAction,
    setProjectPublishedAction,
} from '@/entities/project/actions/project.actions';
import {
    PROJECT_SAVE_STATUS,
    type ProjectRowData,
    type ProjectSaveStatus,
} from '@/entities/project/model/project.types';
import { Button } from '@/shared/ui/button/button';
import { DataTable } from '@/shared/ui/dataTable/dataTable';
import Panel from '@/shared/ui/panel/Panel';
import { Switch } from '@/shared/ui/switch/switch';
import { useToast } from '@/shared/ui/toast/ToastProvider';
import { moveItem } from '@/shared/util/list';

import { EDITOR_MESSAGE, PROJECT_ROUTE, toEditHref } from '../model/projectEditor.constants';
import { toProjectCounts, withFeatured, withPublished } from '../model/projectEditor.utils';
import ProjectDeleteButton from './ProjectDeleteButton';

/** 줄을 옮긴 뒤 포커스를 보낼 버튼 */
const MOVE_TARGET = { UP: 'up', DOWN: 'down' } as const;
type MoveTarget = (typeof MOVE_TARGET)[keyof typeof MOVE_TARGET];

/** 목록의 칸이 부르는 동작. 목록이 갖고 있는 상태를 바꾸므로 컨텍스트로 내려 준다 */
interface ListActionsData {
    /** 버튼의 요소 id 앞에 붙는 값. 옮긴 뒤 포커스를 보낼 때 이 id 로 찾는다 */
    listId: string;
    rowCount: number;
    onMove: (index: number, offset: -1 | 1) => void;
    onPublishedChange: (row: ProjectRowData, isPublished: boolean) => void;
    onFeaturedChange: (row: ProjectRowData, isFeatured: boolean) => void;
}

const ListActionsContext = createContext<ListActionsData | null>(null);

function useListActions(): ListActionsData {
    const actions = use(ListActionsContext);
    if (!actions) {
        throw new Error('목록의 칸은 ProjectList 안에서만 쓴다');
    }
    return actions;
}

interface CellAttributes {
    row: ProjectRowData;
}

/** 순서 칸. 번호와 위 · 아래 버튼이다. 첫 행의 위 버튼과 끝 행의 아래 버튼은 비활성이다 */
function OrderCell({ row, index }: CellAttributes & { index: number }) {
    const { listId, rowCount, onMove } = useListActions();

    return (
        <div className="flex items-center justify-center gap-2">
            <span className="w-5 text-center text-muted-foreground tabular-nums">{index + 1}</span>
            <div className="flex items-center gap-1">
                <Button
                    id={`${listId}-${row.id}-${MOVE_TARGET.UP}`}
                    variant="secondary"
                    size="2xs"
                    aria-label={`${row.title} 위로`}
                    disabled={index === 0}
                    onClick={() => {
                        onMove(index, -1);
                    }}
                    className="flex w-6.5 items-center justify-center p-0"
                >
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                    id={`${listId}-${row.id}-${MOVE_TARGET.DOWN}`}
                    variant="secondary"
                    size="2xs"
                    aria-label={`${row.title} 아래로`}
                    disabled={index === rowCount - 1}
                    onClick={() => {
                        onMove(index, 1);
                    }}
                    className="flex w-6.5 items-center justify-center p-0"
                >
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}

/** 공개 칸. 누르면 곧바로 저장한다 */
function PublishedCell({ row }: CellAttributes) {
    const { onPublishedChange } = useListActions();

    return (
        <Switch
            aria-label={`${row.title} 공개`}
            checked={row.isPublished}
            onCheckedChange={(checked) => {
                onPublishedChange(row, checked);
            }}
        />
    );
}

/** 홈 노출 칸. 비공개 프로젝트는 켤 수 없다 */
function FeaturedCell({ row }: CellAttributes) {
    const { onFeaturedChange } = useListActions();

    return (
        <Switch
            aria-label={`${row.title} 홈 노출`}
            checked={row.isFeatured}
            disabled={!row.isPublished}
            onCheckedChange={(checked) => {
                onFeaturedChange(row, checked);
            }}
        />
    );
}

/**
 * 프로젝트 목록의 열. 폭은 넓은 화면에서만 정하고, 좁은 화면에서는 내용에 맞춰 가로로 스크롤한다.
 * 컴포넌트 밖에 둔다. 안에서 만들면 그릴 때마다 칸이 새 컴포넌트가 되어, 누른 버튼과 스위치가 다시 만들어지고 포커스를 잃는다.
 * 칸이 부를 동작은 ListActionsContext 로 받는다
 */
const COLUMNS: ColumnDef<ProjectRowData>[] = [
    {
        id: 'order',
        header: '순서',
        meta: { className: 'px-4 md:w-32 text-center' },
        cell: ({ row }) => <OrderCell row={row.original} index={row.index} />,
    },
    {
        id: 'image',
        header: '썸네일',
        meta: { className: 'px-4 text-center md:w-24' },
        cell: ({ row }) =>
            row.original.image ? (
                <Image
                    src={row.original.image.src}
                    alt={row.original.image.alt}
                    width={64}
                    height={32}
                    className="h-8 w-16 rounded-md object-cover"
                />
            ) : (
                <span className="text-caption text-muted-foreground">-</span>
            ),
    },
    {
        id: 'title',
        header: '제목',
        meta: { className: 'px-4 whitespace-normal' },
        cell: ({ row }) => (
            <Link href={toEditHref(row.original.id)} className="font-semibold text-strong">
                {row.original.title}
            </Link>
        ),
    },
    {
        id: 'category',
        header: '분류',
        meta: { className: 'px-4 text-center md:w-[16%]' },
        cell: ({ row }) => (
            <span className="rounded-md bg-badge px-2 py-0.75 text-2xs font-semibold">
                {row.original.category}
            </span>
        ),
    },
    {
        id: 'published',
        header: '공개',
        meta: { className: 'px-4 md:w-20 text-center' },
        cell: ({ row }) => <PublishedCell row={row.original} />,
    },
    {
        id: 'featured',
        header: '홈 노출',
        meta: { className: 'px-4 md:w-20 text-center' },
        cell: ({ row }) => <FeaturedCell row={row.original} />,
    },
    {
        id: 'updatedAt',
        header: '수정 일시',
        meta: { className: 'px-4 md:w-[18%] tabular-nums text-center' },
        cell: ({ row }) => (
            <span className="text-caption text-muted-foreground">
                {row.original.updatedAtText ?? '—'}
            </span>
        ),
    },
    {
        id: 'delete',
        header: '삭제',
        meta: { className: 'px-4 md:w-20 text-center' },
        cell: ({ row }) => (
            <ProjectDeleteButton
                id={row.original.id}
                title={row.original.title}
                size="2xs"
                // 순서 칸의 버튼과 같은 네모로 맞추고 칸의 가운데에 놓는다
                className="mx-auto flex w-6.5 items-center justify-center p-0"
            />
        ),
    },
];

interface OwnProps {
    /** 순서대로 놓인 전체 목록. 비공개도 들어 있다. 페이지가 읽어 넘긴다 */
    projects: ProjectRowData[];
}

/**
 * 프로젝트 목록(S-01). 공개 · 비공개를 모두 순서대로 보여 준다.
 * 순서 · 공개 · 홈 노출은 여기서 바로 바꾸고, 바꾸면 곧바로 저장한다.
 * 화면을 먼저 바꿔 두고, 저장하지 못하면 바꾸기 전으로 되돌린다.(docs/plan/admin/README.md 「목록」 · 「순서」 · 「홈 노출」)
 * 순서는 행의 위 · 아래 버튼으로 옮긴다. 끌기는 없다.(docs/plan/admin/README.md 요구사항 30)
 * 검색 · 페이지 나누기 · 정렬은 없다. page 를 주지 않아 페이저를 그리지 않는다.
 */
export default function ProjectList({ projects }: OwnProps) {
    const [rows, setRows] = useState(projects);
    // 서버가 새 목록을 주면 화면의 목록을 거기에 맞춘다
    const [prevProjects, setPrevProjects] = useState(projects);
    if (projects !== prevProjects) {
        setPrevProjects(projects);
        setRows(projects);
    }

    const [isPending, startTransition] = useTransition();
    const toast = useToast();
    const listId = useId();
    const focusTargetRef = useRef<{ id: string; target: MoveTarget } | null>(null);

    // 줄이 옮겨져 그려진 뒤에 포커스를 보낸다. 누른 버튼이 끝에 닿아 비활성이 되면 포커스가 사라지기 때문이다
    useEffect(() => {
        const focusTarget = focusTargetRef.current;
        if (!focusTarget) return;
        focusTargetRef.current = null;
        document.getElementById(`${listId}-${focusTarget.id}-${focusTarget.target}`)?.focus();
    }, [rows, listId]);

    const counts = toProjectCounts(rows);

    /**
     * 화면을 먼저 바꾸고 저장한다. 저장하지 못하면 바꾸기 전으로 되돌리고 실패를 알린다
     * @param next - 바꾼 뒤의 목록
     * @param save - 저장하는 서버 액션
     * @param message - 저장했을 때의 토스트 문구
     */
    function applyChange(
        next: ProjectRowData[],
        save: () => Promise<ProjectSaveStatus>,
        message: string,
    ) {
        // 앞의 저장이 끝나기 전에는 받지 않는다. 겹쳐 보내면 되돌릴 기준이 어긋난다
        if (isPending) return;

        const previous = rows;
        setRows(next);
        startTransition(async () => {
            const status = await save();
            if (status === PROJECT_SAVE_STATUS.SAVED) {
                toast.success(message);
                return;
            }
            setRows(previous);
            toast.error(
                status === PROJECT_SAVE_STATUS.NOT_FOUND
                    ? EDITOR_MESSAGE.NOT_FOUND
                    : EDITOR_MESSAGE.FAILED,
            );
        });
    }

    function hndlMove(index: number, offset: -1 | 1) {
        const row = rows[index];
        if (!row || isPending) return;

        // 누른 버튼에 포커스를 남긴다. 끝에 닿아 그 버튼이 비활성이 되면 반대쪽 버튼으로 보낸다
        const target = index + offset;
        const isAtEnd = target === 0 || target === rows.length - 1;
        const pressed = offset === -1 ? MOVE_TARGET.UP : MOVE_TARGET.DOWN;
        const opposite = offset === -1 ? MOVE_TARGET.DOWN : MOVE_TARGET.UP;
        focusTargetRef.current = { id: row.id, target: isAtEnd ? opposite : pressed };

        const next = moveItem(rows, index, offset);
        applyChange(
            next,
            () => reorderProjectListAction(next.map((item) => item.id)),
            EDITOR_MESSAGE.ORDER_SAVED,
        );
    }

    function hndlPublishedChange(row: ProjectRowData, isPublished: boolean) {
        applyChange(
            withPublished(rows, row.id, isPublished),
            () => setProjectPublishedAction(row.id, isPublished),
            isPublished ? EDITOR_MESSAGE.PUBLISHED : EDITOR_MESSAGE.UNPUBLISHED,
        );
    }

    function hndlFeaturedChange(row: ProjectRowData, isFeatured: boolean) {
        applyChange(
            withFeatured(rows, row.id, isFeatured),
            () => setProjectFeaturedAction(row.id, isFeatured),
            isFeatured ? EDITOR_MESSAGE.FEATURED : EDITOR_MESSAGE.UNFEATURED,
        );
    }

    return (
        <Panel>
            <ListActionsContext
                value={{
                    listId,
                    rowCount: rows.length,
                    onMove: hndlMove,
                    onPublishedChange: hndlPublishedChange,
                    onFeaturedChange: hndlFeaturedChange,
                }}
            >
                <DataTable
                    columns={COLUMNS}
                    data={{ content: rows, totalElements: rows.length }}
                    emptyMessage={EDITOR_MESSAGE.EMPTY}
                    rightSlot={
                        <div className="flex items-center gap-4">
                            {/* 「전체 N」 은 표가 왼쪽에 그린다. 공개와 홈 노출 건수를 이어 적는다 */}
                            <p className="text-xs text-muted-foreground tabular-nums">
                                공개{' '}
                                <strong className="font-semibold text-strong">
                                    {counts.published}
                                </strong>
                                건 · 홈 노출{' '}
                                <strong className="font-semibold text-strong">
                                    {counts.featured}
                                </strong>
                                건
                            </p>
                            <Button asChild size="xs" className="items-center">
                                <Link href={PROJECT_ROUTE.NEW}>+ 프로젝트 등록</Link>
                            </Button>
                        </div>
                    }
                />
            </ListActionsContext>
        </Panel>
    );
}
