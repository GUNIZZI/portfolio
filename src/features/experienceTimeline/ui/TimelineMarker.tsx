'use client';

import { useRef } from 'react';

import { useInView } from 'framer-motion';

import { cn } from '@/shared/util/cn';

interface OwnProps {
    /** 들어간 해 — '2025' */
    startYearText: string;
    /** 떠난 해 — '2014', 재직 중이면 '현재' */
    endYearText: string;
}

/**
 * 타임라인의 회사마다 두는 표시. 세로선 왼쪽의 연도와 선 위의 점이다.
 * 세로선이 지나가면 함께 켜지고, 위로 되돌아가면 꺼진다.
 * 세로선의 끝이 화면 가운데에 있으므로(TimelineLine), 점이 화면 가운데보다 위에 있으면 지나간 것이다.
 * 동작 줄이기에서는 선이 다 그려져 있어 모두 켜 둔다.
 *
 * 연도는 md 이상에서만 선 왼쪽에 둔다. 좁은 화면에는 둘 자리가 없어 회사 이름 줄의 기간이 대신한다.
 */
export default function TimelineMarker({ startYearText, endYearText }: OwnProps) {
    const dotRef = useRef<HTMLSpanElement>(null);
    // 관찰 영역을 위로는 끝없이, 아래로는 화면 가운데까지로 잡는다
    const isPassed = useInView(dotRef, { margin: '99999px 0px -50% 0px' });

    return (
        <>
            <p className="absolute top-3.5 left-0 w-20 text-right max-md:hidden">
                <span
                    className={cn(
                        // 글자
                        'block font-marker text-stat leading-none',
                        // 상태
                        isPassed ? 'text-primary' : 'text-muted-foreground',
                        'motion-reduce:text-primary',
                        // 모션
                        'transition-colors duration-base ease-move',
                    )}
                >
                    {startYearText}
                </span>
                <span className="mt-1 block text-2xs text-muted-foreground tabular-nums">
                    – {endYearText}
                </span>
            </p>
            <span
                ref={dotRef}
                aria-hidden="true"
                className={cn(
                    // 배치와 모양
                    'absolute top-5.5 left-0 z-raised size-3 rounded-full border-2 md:left-24',
                    // 상태
                    isPassed ? 'border-primary bg-primary' : 'border-divider bg-panel',
                    'motion-reduce:border-primary motion-reduce:bg-primary',
                    // 모션
                    'transition-colors duration-base ease-move',
                )}
            />
        </>
    );
}
