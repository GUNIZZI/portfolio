import type { AnalyticsPeriodDays } from '@/entities/analytics/model/analytics.constants';
import type { AnalyticsPageViewData } from '@/entities/analytics/model/analytics.types';
import { getAnalyticsPageViewList } from '@/entities/analytics/services/analytics.services';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table/table';

import { DASHBOARD_MESSAGE, PAGE_LABEL, toPeriodHref } from '../model/dashboard.constants';
import BlockError from './BlockError';

/** 받지 못하면 null 을 낸다. 화면은 이 블록만 오류로 그린다 */
async function loadPageViewList(
    days: AnalyticsPeriodDays,
): Promise<AnalyticsPageViewData[] | null> {
    try {
        return await getAnalyticsPageViewList(days);
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface OwnProps {
    days: AnalyticsPeriodDays;
}

/**
 * 페이지별 조회수. 공개 화면의 메뉴 4개를 조회수가 많은 순으로 적는다.
 * 비율은 숫자로만 적는다. 가로 막대는 아직 만들지 않았다.
 * (docs/plan/admin/dashboard/README.md 검토 필요 사항 10번)
 */
export default async function PageViews({ days }: OwnProps) {
    const pages = await loadPageViewList(days);
    if (!pages) {
        return <BlockError retryHref={toPeriodHref(days)} />;
    }
    if (pages.every((page) => page.pageViews === 0)) {
        return <p className="text-body text-muted-foreground">{DASHBOARD_MESSAGE.EMPTY}</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="px-4">페이지</TableHead>
                    <TableHead className="px-4">주소</TableHead>
                    <TableHead className="px-4 text-right">조회수</TableHead>
                    <TableHead className="px-4 text-right">비율</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pages.map((page) => (
                    <TableRow key={page.path}>
                        <TableCell className="px-4 font-semibold text-strong">
                            {PAGE_LABEL[page.path]}
                        </TableCell>
                        <TableCell className="px-4 text-muted-foreground">{page.path}</TableCell>
                        <TableCell className="px-4 text-right tabular-nums">
                            {page.pageViews.toLocaleString('ko-KR')}
                        </TableCell>
                        <TableCell className="px-4 text-right tabular-nums">
                            {page.shareText}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
