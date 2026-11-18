import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/util/cn';

/**
 * 크기마다의 고리. 바깥으로 갈수록 느리게 도는 고리 3개를 겹친다.
 * 가운데 고리가 요소 자신이고, 바깥 고리 2개는 before · after 로 그린다. 굵기와 벌어진 정도는 Kozipsa 의 값이다
 */
const SIZE_CLASS = {
    xs: 'size-3 border before:-inset-1 before:border after:-inset-1.5 after:border',
    sm: 'size-5 border-2 before:-inset-1.5 before:border-2 after:-inset-2.25 after:border-2',
    md: 'size-8 border-3 before:-inset-2.5 before:border-3 after:-inset-3.75 after:border-3',
    lg: 'size-12 border-5 before:-inset-3.5 before:border-5 after:-inset-5.25 after:border-5',
} as const;

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
    size?: keyof typeof SIZE_CLASS;
    /** 고리 옆에 적는 문구 */
    text?: string;
}

/**
 * 진행 중임을 알리는 로더. Kozipsa 의 Loader 를 가져왔다.(Kozipsa packages/ui 의 loader/Loader.tsx)
 * 고리의 한쪽만 칠해 돌린다. 동작 줄이기에서는 돌지 않고 멈춘 고리만 보인다.
 * 꾸밈이라 보조 기술에는 읽히지 않는다. 진행 중임은 쓰는 쪽이 aria-busy 로 알린다.
 */
export default function Loader({ className, size = 'md', text, ...rest }: OwnProps) {
    return (
        <div
            aria-hidden="true"
            className={cn('flex items-center justify-center', className)}
            {...rest}
        >
            <div
                className={cn(
                    // 가운데 고리
                    'relative rounded-full border-transparent border-r-muted-foreground',
                    // 바깥 고리 2개
                    'before:absolute before:rounded-full before:border-transparent before:border-r-muted-foreground',
                    'after:absolute after:rounded-full after:border-transparent after:border-r-muted-foreground',
                    SIZE_CLASS[size],
                    // 모션. 바깥 고리일수록 느리다
                    'motion-safe:animate-loader motion-safe:before:animate-loader-slow motion-safe:after:animate-loader-slower',
                )}
            />
            {text ? <span className="pl-4 text-2xs text-muted-foreground">{text}</span> : null}
        </div>
    );
}
