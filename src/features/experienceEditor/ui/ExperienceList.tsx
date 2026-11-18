'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { ColumnDef } from '@tanstack/react-table';

import type { ExperienceRowData } from '@/entities/experience/model/experience.types';
import { Button } from '@/shared/ui/button/button';
import { DataTable } from '@/shared/ui/dataTable/dataTable';
import Panel from '@/shared/ui/panel/Panel';

import { EDITOR_MESSAGE, EXPERIENCE_ROUTE, toEditHref } from '../model/experienceEditor.constants';
import ExperienceDeleteButton from './ExperienceDeleteButton';

/** 경력 목록의 열. 폭은 넓은 화면에서만 정하고, 좁은 화면에서는 내용에 맞춰 가로로 스크롤한다 */
const COLUMNS: ColumnDef<ExperienceRowData>[] = [
    {
        id: 'period',
        header: '기간',
        meta: { className: 'px-4 md:w-[18%] tabular-nums text-center' },
        cell: ({ row }) => row.original.periodText,
    },
    {
        id: 'company',
        header: '회사',
        meta: { className: 'px-4' },
        // 행을 눌러도 수정으로 가지만, 키보드로 갈 수 있게 링크를 남긴다
        cell: ({ row }) => (
            <Link
                href={toEditHref(row.original.id)}
                onClick={(event) => {
                    event.stopPropagation();
                }}
                className="font-semibold text-strong"
            >
                {row.original.company}
            </Link>
        ),
    },
    {
        id: 'projects',
        header: '프로젝트',
        meta: { className: 'px-4 md:w-[20%] tabular-nums text-center' },
        cell: ({ row }) => (
            <>
                {row.original.listedCountText}
                {row.original.totalCountText ? (
                    <span className="ml-1 text-caption text-muted-foreground">
                        (실제 {row.original.totalCountText})
                    </span>
                ) : null}
            </>
        ),
    },
    {
        id: 'updatedAt',
        header: '수정 일시',
        meta: { className: 'px-4 md:w-[20%] tabular-nums text-center' },
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
            // 버튼과 확인 창을 누른 것이 행 클릭으로 번지지 않게 막는다. 확인 창은 문서 끝에 그려져도 React 의 이벤트는 이 칸을 거친다
            <span
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <ExperienceDeleteButton
                    id={row.original.id}
                    company={row.original.company}
                    size="2xs"
                />
            </span>
        ),
    },
];

interface OwnProps {
    /** 들어간 해가 늦은 회사부터 놓인 목록. 페이지가 읽어 넘긴다 */
    experiences: ExperienceRowData[];
}

/**
 * 경력 목록(S-01). 회사를 모두 보여 주고, 행이나 회사 이름을 누르면 수정 화면으로 간다.
 * 검색 · 페이지 나누기 · 순서 변경은 없다. page 를 주지 않아 페이저를 그리지 않는다.
 */
export default function ExperienceList({ experiences }: OwnProps) {
    const router = useRouter();

    function hndlRowClick(experience: ExperienceRowData) {
        router.push(toEditHref(experience.id));
    }

    return (
        <Panel>
            <DataTable
                columns={COLUMNS}
                data={{ content: experiences, totalElements: experiences.length }}
                hndlRowClick={hndlRowClick}
                emptyMessage={EDITOR_MESSAGE.EMPTY}
                rightSlot={
                    <Button asChild size="xs" className="items-center">
                        <Link href={EXPERIENCE_ROUTE.NEW}>+ 경력 등록</Link>
                    </Button>
                }
            />
        </Panel>
    );
}
