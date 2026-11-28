'use client';

import { type PointerEvent, useState } from 'react';

import { cn } from '@/shared/util/cn';

import { TREND_SERIES } from '../model/dashboard.constants';
import type { TrendChartPointData } from '../model/dashboard.types';

interface OwnProps {
    /** 그래프의 모든 날. 날짜 순이다 */
    points: TrendChartPointData[];
}

/**
 * 그래프에 포인터를 올리면 가장 가까운 날의 값을 적는다. 세로 안내선과 점, 읽기 칸을 그린다.
 * 그래프 영역을 덮는 층이다. 움직이는 연출은 없다.(docs/plan/admin/dashboard/README.md 「모션」)
 * 키보드와 스크린 리더는 같은 값을 표로 읽는다.
 */
export default function TrendChartHover({ points }: OwnProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const active = activeIndex === null ? undefined : points[activeIndex];

    const handlePointer = (event: PointerEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (rect.width === 0) {
            return;
        }
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        setActiveIndex(Math.round(ratio * (points.length - 1)));
    };

    return (
        <div
            className="absolute inset-0"
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => {
                setActiveIndex(null);
            }}
        >
            {active ? (
                <>
                    <div
                        className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-divider"
                        style={{ left: `${active.x}%` }}
                    />
                    {TREND_SERIES.map((series) => (
                        <div
                            key={series.key}
                            className={cn(
                                'pointer-events-none absolute size-2 -translate-1/2 rounded-full',
                                series.dotClass,
                            )}
                            style={{ left: `${active.x}%`, top: `${active[series.yKey]}%` }}
                        />
                    ))}
                    {/* 오른쪽 절반에서는 읽기 칸을 안내선의 왼쪽에 둔다. 그래프 밖으로 나가지 않는다 */}
                    <div
                        className={cn(
                            'pointer-events-none absolute top-2 rounded-card border border-border bg-popover px-3 py-2 text-caption whitespace-nowrap text-popover-foreground',
                            active.x > 50 ? '-ml-2 -translate-x-full' : 'ml-2',
                        )}
                        style={{ left: `${active.x}%` }}
                    >
                        <p className="font-semibold text-strong tabular-nums">{active.dateText}</p>
                        {TREND_SERIES.map((series) => (
                            <p key={series.key} className="flex items-center gap-2 tabular-nums">
                                <span className={cn('size-2 rounded-full', series.dotClass)} />
                                {series.label}
                                <span className="ml-auto pl-3 text-strong">
                                    {active[series.valueKey].toLocaleString('ko-KR')}
                                    {series.unit}
                                </span>
                            </p>
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
}
