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
import { toTrendChart } from '../model/dashboard.utils';
import BlockError from './BlockError';
import TrendChart from './TrendChart';

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
 * 꺾은선 그래프로 그리고, 같은 값을 표로도 제공한다. 표는 접어 두고 「표로 보기」 를 누르면 편다.
 * (docs/plan/admin/dashboard/README.md 「접근성 · 성능 고려」, wireframe.html S-01 6번)
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
            <TrendChart chart={toTrendChart(trend.days)} />
            <details>
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
