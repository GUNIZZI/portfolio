import type { AnalyticsPeriodDays } from '@/entities/analytics/model/analytics.constants';
import type { AnalyticsTrendData } from '@/entities/analytics/model/analytics.types';
import { getAnalyticsTrend } from '@/entities/analytics/services/analytics.services';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table/table';

import { DASHBOARD_MESSAGE, toPeriodHref } from '../model/dashboard.constants';
import BlockError from './BlockError';

/** 받지 못하면 null 을 낸다. 화면은 이 블록만 오류로 그린다 */
async function loadTrend(days: AnalyticsPeriodDays): Promise<AnalyticsTrendData | null> {
    try {
        return await getAnalyticsTrend(days);
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface OwnProps {
    days: AnalyticsPeriodDays;
}

/**
 * 방문자 추이. 일별 방문자와 조회수다. 값이 없는 날은 0으로 적는다.
 * 그래프의 자리는 비워 두고 같은 값의 표만 그린다. 그래프를 만드는 방법을 정하지 않았다.
 * (2026-11-20 사용자 결정, docs/plan/admin/dashboard/README.md 검토 필요 사항 10번)
 */
export default async function VisitorTrend({ days }: OwnProps) {
    const trend = await loadTrend(days);
    if (!trend) {
        return <BlockError retryHref={toPeriodHref(days)} />;
    }
    if (trend.isEmpty) {
        return <p className="text-body text-muted-foreground">{DASHBOARD_MESSAGE.EMPTY}</p>;
    }

    return (
        <>
            {/* 그래프가 올 자리 */}
            <div
                aria-hidden="true"
                className="h-60 rounded-card border border-dashed border-border"
            />
            <details open>
                <summary className="cursor-pointer text-caption text-muted-foreground">
                    표로 보기
                </summary>
                {/* 90일이면 표가 길다. 높이를 잡아 안에서 스크롤한다 */}
                <div className="mt-3 max-h-80 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4">날짜</TableHead>
                                <TableHead className="px-4 text-right">방문자</TableHead>
                                <TableHead className="px-4 text-right">조회수</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trend.days.map((day) => (
                                <TableRow key={day.date}>
                                    <TableCell className="px-4 tabular-nums">
                                        {day.dateText}
                                    </TableCell>
                                    <TableCell className="px-4 text-right tabular-nums">
                                        {day.visitors.toLocaleString('ko-KR')}
                                    </TableCell>
                                    <TableCell className="px-4 text-right tabular-nums">
                                        {day.pageViews.toLocaleString('ko-KR')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </details>
        </>
    );
}
