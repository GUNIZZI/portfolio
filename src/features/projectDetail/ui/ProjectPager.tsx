import Link from 'next/link';

import type { ProjectNeighborData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';
import { cn } from '@/shared/util/cn';

interface OwnProps {
    prev: ProjectNeighborData | null;
    next: ProjectNeighborData | null;
}

const CARD_CLASS = cn(
    // 배치와 모양
    'flex min-h-20 min-w-0 flex-[1_1_240px] flex-col justify-center gap-1 rounded-card border border-border-card bg-card px-5 py-4',
    // hover
    'hover:border-brand',
    // 모션
    'transition-colors duration-fast ease-move',
);

/** 상세 아래에서 옆 작업으로 가는 링크. 첫 작업에는 이전이, 마지막 작업에는 다음이 없다 */
export default function ProjectPager({ prev, next }: OwnProps) {
    if (!prev && !next) return null;

    return (
        <nav aria-label="다른 작업" className="flex flex-wrap gap-4">
            {prev ? (
                <Link href={prev.href} className={CARD_CLASS}>
                    <span className="flex items-center gap-1.5 text-caption text-muted">
                        <Icon name="arrowRight" size={14} strokeWidth={2} className="rotate-180" />
                        이전 작업
                    </span>
                    <span className="text-body font-bold">{prev.title}</span>
                </Link>
            ) : (
                // 다음 작업이 오른쪽에 놓이도록 자리를 비워 둔다
                <span aria-hidden="true" className="flex-[1_1_240px] max-md:hidden" />
            )}
            {next ? (
                <Link href={next.href} className={cn(CARD_CLASS, 'items-end text-right')}>
                    <span className="flex items-center gap-1.5 text-caption text-muted">
                        다음 작업
                        <Icon name="arrowRight" size={14} strokeWidth={2} />
                    </span>
                    <span className="text-body font-bold">{next.title}</span>
                </Link>
            ) : null}
        </nav>
    );
}
