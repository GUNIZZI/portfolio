'use client';

import type { ComponentProps } from 'react';

import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '@/shared/util/cn';

/**
 * 입력의 이름. shadcn 의 Label 을 바탕으로 했다.
 * 비활성은 입력과 같은 값으로 흐리게 한다.(docs/theme.md 4절)
 */
function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                // 배치
                'flex items-center gap-2 select-none',
                // 글자
                'text-caption leading-none font-medium text-muted-foreground',
                // 비활성
                'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-disabled',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-disabled',
                className,
            )}
            {...props}
        />
    );
}

export { Label };
