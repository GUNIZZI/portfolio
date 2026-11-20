import Link from 'next/link';

import type { AnalyticsPeriodDays } from '@/entities/analytics/model/analytics.constants';
import { getAnalyticsProjectViewList } from '@/entities/analytics/services/analytics.services';
import { getProjectOptionList } from '@/entities/project/services/project.services';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table/table';

import { DASHBOARD_MESSAGE, toPeriodHref, toProjectEditHref } from '../model/dashboard.constants';
import type { ProjectViewRowData } from '../model/dashboard.types';
import { toProjectViewRowList } from '../model/dashboard.utils';
import BlockError from './BlockError';

/**
 * 프로젝트와 조회수를 읽어 잇는다. entity 끼리는 서로 부르지 않아 여기서 합친다.(docs/architecture.md 3절)
 * @returns 어느 한쪽이라도 받지 못하면 null. 화면은 이 블록만 오류로 그린다
 */
async function loadProjectViewRowList(
    days: AnalyticsPeriodDays,
): Promise<ProjectViewRowData[] | null> {
    try {
        const [projects, views] = await Promise.all([
            getProjectOptionList(),
            getAnalyticsProjectViewList(days),
        ]);
        return toProjectViewRowList(projects, views);
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface OwnProps {
    days: AnalyticsPeriodDays;
}

/**
 * 프로젝트별 조회수. 공개 · 비공개를 모두 조회수가 많은 순으로 적는다. 조회가 없어도 적는다.
 * 제목을 누르면 프로젝트 수정으로 간다.(docs/plan/admin/dashboard/README.md 「블록별 규칙」)
 */
export default async function ProjectViews({ days }: OwnProps) {
    const rows = await loadProjectViewRowList(days);
    if (!rows) {
        return <BlockError retryHref={toPeriodHref(days)} />;
    }
    if (rows.length === 0) {
        return <p className="text-body text-muted-foreground">{DASHBOARD_MESSAGE.EMPTY}</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="px-4">프로젝트</TableHead>
                    <TableHead className="px-4 text-center">공개</TableHead>
                    <TableHead className="px-4 text-right">조회수</TableHead>
                    <TableHead className="px-4 text-right">평균 참여 시간</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell className="px-4">
                            <Link
                                href={toProjectEditHref(row.id)}
                                className="font-semibold text-strong hover:underline"
                            >
                                {row.title}
                            </Link>
                        </TableCell>
                        <TableCell className="px-4 text-center text-muted-foreground">
                            {row.isPublished ? '공개' : '비공개'}
                        </TableCell>
                        <TableCell className="px-4 text-right tabular-nums">
                            {row.pageViews.toLocaleString('ko-KR')}
                        </TableCell>
                        <TableCell className="px-4 text-right tabular-nums">
                            {row.durationText ?? '—'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
