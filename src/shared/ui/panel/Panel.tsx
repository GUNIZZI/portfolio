import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/util/cn';

/** 섹션을 묶는 큰 면. 반투명이고 뒤를 흐려 배경 낙서가 비친다. 모서리가 둥글다 */
export default function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'rounded-3xl border border-border bg-panel-glass backdrop-blur-sm',
                className,
            )}
            {...rest}
        />
    );
}
