import type { ReactNode } from 'react';

import { cn } from '@/shared/util/cn';

const UNDERLINE_CLASS = {
    accent: 'stroke-accent',
    brand: 'stroke-brand',
} as const;

interface OwnProps {
    children: ReactNode;
    /** 제목 아래 마커 밑줄 색. 없으면 그리지 않는다 */
    underline?: keyof typeof UNDERLINE_CLASS;
    /** 밑줄 길이 클래스 — w-37.5 처럼 준다 */
    underlineClassName?: string;
    className?: string;
}

/** 마커로 쓴 섹션 제목과 그 아래 손으로 그은 밑줄 */
export default function MarkerHeading({
    children,
    underline,
    underlineClassName,
    className,
}: OwnProps) {
    return (
        <div className="flex flex-col">
            <h2 className={cn('font-marker text-section font-normal', className)}>{children}</h2>
            {underline ? (
                <svg
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className={cn('h-2.5 w-42.5', underlineClassName)}
                >
                    <path
                        d="M3 8 C 60 3, 130 2, 197 5"
                        fill="none"
                        className={UNDERLINE_CLASS[underline]}
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                </svg>
            ) : null}
        </div>
    );
}
