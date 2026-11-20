import Link from 'next/link';

import {
    ANALYTICS_PERIOD_DAYS,
    type AnalyticsPeriodDays,
} from '@/entities/analytics/model/analytics.constants';
import { cn } from '@/shared/util/cn';

import { toPeriodHref } from '../model/dashboard.constants';

interface OwnProps {
    /** 지금 고른 기간 */
    days: AnalyticsPeriodDays;
}

/**
 * 기간 선택. 7일 · 30일 · 90일의 링크다. 고른 기간은 주소에 남아, 상태를 따로 두지 않는다.
 * 지금 고른 값은 aria-current 로 알린다.(docs/plan/admin/dashboard/README.md 「접근성 · 성능 고려」)
 */
export default function PeriodTabs({ days }: OwnProps) {
    return (
        <nav aria-label="기간" className="flex gap-1 rounded-full border border-border p-1">
            {ANALYTICS_PERIOD_DAYS.map((option) => {
                const isCurrent = option === days;
                return (
                    <Link
                        key={option}
                        href={toPeriodHref(option)}
                        aria-current={isCurrent ? 'true' : undefined}
                        className={cn(
                            'rounded-full px-4 py-1 text-caption tabular-nums',
                            isCurrent
                                ? 'bg-state-selected font-semibold text-strong'
                                : 'text-muted-foreground hover:text-strong',
                        )}
                    >
                        {option}일
                    </Link>
                );
            })}
        </nav>
    );
}
