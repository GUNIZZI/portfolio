'use client';

import type { ComponentProps } from 'react';

import { Separator as SeparatorPrimitive } from 'radix-ui';

import { cn } from '@/shared/util/cn';

/**
 * 구분선. shadcn 의 Separator 그대로이고, 색만 이 사이트의 구분선 색(line)이다.
 * 가로 선은 폭을, 세로 선은 높이를 부모에 맞춘다.
 */
function Separator({
    className,
    orientation = 'horizontal',
    decorative = true,
    ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            data-slot="separator"
            decorative={decorative}
            orientation={orientation}
            className={cn(
                'shrink-0 bg-line',
                'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
                'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
                className,
            )}
            {...props}
        />
    );
}

export { Separator };
