import type { AnalyticsPeriodDays } from '@/entities/analytics/model/analytics.constants';
import {
    ANALYTICS_TREND,
    type AnalyticsChangeData,
    type AnalyticsSummaryData,
    type AnalyticsTrend,
} from '@/entities/analytics/model/analytics.types';
import { getAnalyticsSummary } from '@/entities/analytics/services/analytics.services';
import Panel from '@/shared/ui/panel/Panel';
import { cn } from '@/shared/util/cn';

import { toPeriodHref } from '../model/dashboard.constants';
import BlockError from './BlockError';

/**
 * 증감의 색. 오르면 success, 내리면 destructive 다.(2026-11-20 사용자 결정)
 * 색으로만 나타내지 않는다. 문구에 기호와 숫자가 함께 있다
 */
const TREND_CLASS: Record<AnalyticsTrend, string> = {
    [ANALYTICS_TREND.UP]: 'text-success',
    [ANALYTICS_TREND.DOWN]: 'text-destructive',
    [ANALYTICS_TREND.FLAT]: 'text-muted-foreground',
    [ANALYTICS_TREND.NONE]: 'text-muted-foreground',
};

interface CardProps {
    label: string;
    /** 크게 적는 값 — `128` · `1분 42초` */
    valueText: string;
    /** 값 뒤에 작게 적는 단위. 값에 단위가 들어 있으면 주지 않는다 */
    unit?: string;
    change: AnalyticsChangeData;
    days: AnalyticsPeriodDays;
}

function SummaryCard({ label, valueText, unit, change, days }: CardProps) {
    return (
        <Panel className="flex flex-col gap-2 p-5">
            <p className="text-caption text-muted-foreground">{label}</p>
            <p className="text-stat font-bold text-strong tabular-nums">
                {valueText}
                {unit ? (
                    <span className="ml-1 text-caption font-normal text-muted-foreground">
                        {unit}
                    </span>
                ) : null}
            </p>
            <p className="text-caption text-muted-foreground">
                <span className={cn('font-semibold tabular-nums', TREND_CLASS[change.trend])}>
                    {change.text}
                </span>{' '}
                직전 {days}일보다
            </p>
        </Panel>
    );
}

/** 받지 못하면 null 을 낸다. 화면은 이 블록만 오류로 그린다 */
async function loadSummary(days: AnalyticsPeriodDays): Promise<AnalyticsSummaryData | null> {
    try {
        return await getAnalyticsSummary(days);
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface OwnProps {
    days: AnalyticsPeriodDays;
}

/**
 * 요약 카드 4개. 방문자 · 세션 · 조회수 · 평균 참여 시간과 직전 기간 대비 증감이다.
 * 모인 값이 없으면 0으로 그린다. 넓은 화면에서는 한 줄에 4개, 좁은 화면에서는 2개씩 놓는다.
 * (docs/plan/admin/dashboard/README.md 「블록별 규칙」 · 「반응형」)
 */
export default async function SummaryCards({ days }: OwnProps) {
    const summary = await loadSummary(days);
    if (!summary) {
        return (
            <Panel className="p-6">
                <BlockError retryHref={toPeriodHref(days)} />
            </Panel>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryCard
                label="방문자"
                valueText={summary.visitors.value.toLocaleString('ko-KR')}
                unit="명"
                change={summary.visitors.change}
                days={days}
            />
            <SummaryCard
                label="세션"
                valueText={summary.sessions.value.toLocaleString('ko-KR')}
                unit="번"
                change={summary.sessions.change}
                days={days}
            />
            <SummaryCard
                label="조회수"
                valueText={summary.pageViews.value.toLocaleString('ko-KR')}
                unit="번"
                change={summary.pageViews.change}
                days={days}
            />
            <SummaryCard
                label="평균 참여 시간"
                valueText={summary.engagement.durationText}
                change={summary.engagement.change}
                days={days}
            />
        </div>
    );
}
