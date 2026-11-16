import { cn } from '@/shared/util/cn';

import {
    DOODLE_FILTER_ID,
    DOODLE_SHAPES,
    DOODLE_TONE_CLASS,
    type DoodleShape,
    type DoodleTone,
} from './doodle.constants';

interface DoodleParts {
    d: string;
    drips?: string;
    dots?: readonly (readonly [number, number, number])[];
}

interface OwnProps {
    shape: DoodleShape;
    tone: DoodleTone;
    /** 본문보다 뒤처지는 비율. 0 이면 본문과 함께, 음수면 본문보다 빠르게 움직인다 */
    lag?: number;
    /** 자리 · 크기 · 기울기 — top-30 left-[45%] w-9 rotate-12 처럼 준다 */
    className?: string;
}

/**
 * 붓과 스프레이로 그린 거리 낙서 하나. Backdrop 안에 놓는다.
 * data-drift 와 data-lag 는 Backdrop 이 읽어 스크롤 시차를 준다.
 */
export default function Doodle({ shape, tone, lag = 0, className }: OwnProps) {
    const parts: DoodleParts = DOODLE_SHAPES[shape];
    const toneClass = DOODLE_TONE_CLASS[tone];

    return (
        <div data-drift data-lag={lag} className={cn('absolute', className)}>
            <svg viewBox="0 0 48 48" className="block w-full overflow-visible">
                <g
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${DOODLE_FILTER_ID})`}
                    className={toneClass.stroke}
                >
                    <path d={parts.d} strokeWidth="5.5" />
                    {parts.drips ? <path d={parts.drips} strokeWidth="2.6" /> : null}
                    {parts.dots?.map(([cx, cy, r]) => (
                        <circle
                            key={`${cx}-${cy}`}
                            cx={cx}
                            cy={cy}
                            r={r}
                            stroke="none"
                            className={toneClass.fill}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}
