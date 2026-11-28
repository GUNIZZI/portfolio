import type { AnalyticsPeriodDays } from '@/entities/analytics/model/analytics.constants';
import { getAnalyticsPlanViewList } from '@/entities/analytics/services/analytics.services';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table/table';
import { PLAN_DOCS } from '@/config/planDocs';

import { DASHBOARD_MESSAGE, toPeriodHref, toPlanViewerHref } from '../model/dashboard.constants';
import type { PlanViewRowData } from '../model/dashboard.types';
import { toPlanViewRowList } from '../model/dashboard.utils';
import BlockError from './BlockError';

/**
 * 기획 문서의 목록에 조회수를 잇는다
 * @returns 받지 못하면 null. 화면은 이 블록만 오류로 그린다
 */
async function loadPlanViewRowList(days: AnalyticsPeriodDays): Promise<PlanViewRowData[] | null> {
    try {
        return toPlanViewRowList(PLAN_DOCS, await getAnalyticsPlanViewList(days));
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface OwnProps {
    days: AnalyticsPeriodDays;
}

/**
 * 기획 문서별 조회수. 기획 뷰어에서 본 문서를 조회수가 많은 순으로 적는다. 조회가 없어도 적는다.
 * 이름을 누르면 뷰어의 그 문서를 새 탭으로 연다.(docs/plan/admin/dashboard/README.md 「블록별 규칙」)
 */
export default async function PlanViews({ days }: OwnProps) {
    const rows = await loadPlanViewRowList(days);
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
                    <TableHead className="px-4">기획 문서</TableHead>
                    <TableHead className="px-4">화면의 주소</TableHead>
                    <TableHead className="px-4 text-right">조회수</TableHead>
                    <TableHead className="px-4 text-right">평균 참여 시간</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.key}>
                        <TableCell className="px-4">
                            {/* 뷰어는 Next 의 페이지가 아니라 정적 파일이라 <a> 로 연다 */}
                            <a
                                href={toPlanViewerHref(row.key)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-strong hover:underline"
                            >
                                {row.name}
                                <span className="sr-only"> (새 탭)</span>
                            </a>
                        </TableCell>
                        <TableCell className="px-4 text-muted-foreground">{row.route}</TableCell>
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
