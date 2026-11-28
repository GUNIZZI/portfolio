import { cn } from '@/shared/util/cn';

import { TREND_SERIES } from '../model/dashboard.constants';
import type { TrendChartData } from '../model/dashboard.types';
import TrendChartHover from './TrendChartHover';

/** 가로축 날짜의 맞춤. 양 끝의 날짜는 그래프 밖으로 나가지 않게 안쪽으로 붙인다 */
const LABEL_ALIGN_CLASS = {
    start: '',
    center: '-translate-x-1/2',
    end: '-translate-x-full',
} as const;

interface OwnProps {
    chart: TrendChartData;
}

/**
 * 방문자 추이의 꺾은선 그래프. 선은 방문자와 조회수 2개이고 같은 세로 눈금을 쓴다.
 * 라이브러리 없이 SVG 로 그린다. 선은 색과 모양(실선 · 점선)으로 함께 구별한다.
 * (2026-11-25 사용자 결정, docs/plan/admin/dashboard/README.md 검토 필요 사항 10번)
 * 선만 SVG 로 그리고 글자는 HTML 로 얹는다. 폭에 맞춰 늘려도 글자 크기가 변하지 않는다.
 * 스크린 리더에는 요약 한 줄만 읽어 주고, 값은 아래의 표가 대신한다.
 */
export default function TrendChart({ chart }: OwnProps) {
    return (
        <div role="img" aria-label={chart.summaryText} className="flex flex-col gap-3">
            <ul className="flex flex-wrap gap-4 text-caption text-muted-foreground">
                {TREND_SERIES.map((series) => (
                    <li key={series.key} className="flex items-center gap-2">
                        <svg viewBox="0 0 24 2" className="h-0.5 w-6" aria-hidden="true">
                            <line
                                x1="0"
                                y1="1"
                                x2="24"
                                y2="1"
                                strokeWidth="2"
                                strokeDasharray={series.dash}
                                className={series.strokeClass}
                            />
                        </svg>
                        {series.label}
                    </li>
                ))}
            </ul>

            <div className="flex gap-2">
                <div className="relative h-60 w-10 shrink-0 text-2xs text-muted-foreground tabular-nums">
                    {chart.yTicks.map((tick) => (
                        <span
                            key={tick.value}
                            className="absolute right-0 -translate-y-1/2"
                            style={{ top: `${tick.y}%` }}
                        >
                            {tick.value.toLocaleString('ko-KR')}
                        </span>
                    ))}
                </div>
                <div className="relative h-60 min-w-0 flex-1">
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 size-full overflow-visible"
                        fill="none"
                    >
                        {chart.yTicks.map((tick) => (
                            <line
                                key={tick.value}
                                x1="0"
                                y1={tick.y}
                                x2="100"
                                y2={tick.y}
                                strokeWidth="1"
                                vectorEffect="non-scaling-stroke"
                                className="stroke-line"
                            />
                        ))}
                        {TREND_SERIES.map((series) => (
                            <polyline
                                key={series.key}
                                points={chart.points
                                    .map((point) => `${point.x},${point[series.yKey]}`)
                                    .join(' ')}
                                strokeWidth="2"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeDasharray={series.dash}
                                vectorEffect="non-scaling-stroke"
                                className={series.strokeClass}
                            />
                        ))}
                    </svg>
                    <TrendChartHover points={chart.points} />
                </div>
            </div>

            <div className="relative ml-12 h-4 text-2xs text-muted-foreground tabular-nums">
                {chart.xLabels.map((label) => (
                    <span
                        key={label.text}
                        className={cn(
                            'absolute top-0',
                            LABEL_ALIGN_CLASS[label.align],
                            label.isMinor && 'max-sm:hidden',
                        )}
                        style={{ left: `${label.x}%` }}
                    >
                        {label.text}
                    </span>
                ))}
            </div>
        </div>
    );
}
