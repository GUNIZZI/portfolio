import { cn } from '@/shared/util/cn';

/**
 * 내용이 올 자리를 그리는 면. 면 위로 옅은 빛이 왼쪽에서 오른쪽으로 지나간다.
 * 빛은 before 로 그려 면 밖 왼쪽에 두고, 자리만 옮긴다. 동작 줄이기에서는 그 자리에 머물러 보이지 않는다
 */
const BLOCK_CLASS = cn(
    'relative overflow-hidden rounded-card bg-card',
    'before:absolute before:inset-0 before:-translate-x-full',
    'before:bg-linear-to-r before:from-transparent before:via-state-selected before:to-transparent',
    'motion-safe:before:animate-skeleton',
);

/**
 * AdminGuard 가 세션을 확인하는 동안 본문 자리에 두는 틀. 제목 · 설명 · 본문의 자리만 면으로 그린다.
 * 면 위로 빛이 지나가 진행 중임을 알린다. 동작 줄이기에서는 멈춘 면만 보인다.(2026-11-20 사용자 결정)
 */
export default function AdminGuardFallback() {
    return (
        <main
            role="status"
            aria-busy="true"
            className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10"
        >
            <span className="sr-only">불러오는 중</span>
            <div aria-hidden="true" className="flex flex-col gap-2">
                <div className={cn(BLOCK_CLASS, 'h-9 w-40')} />
                <div className={cn(BLOCK_CLASS, 'h-5 w-72 max-w-full')} />
            </div>
            <div aria-hidden="true" className={cn(BLOCK_CLASS, 'h-80')} />
        </main>
    );
}
