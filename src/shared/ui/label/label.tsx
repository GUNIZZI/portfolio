'use client';

import type { ComponentProps } from 'react';

import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '@/shared/util/cn';

/**
 * 입력의 이름. shadcn 의 Label 을 바탕으로 했다.
 * 비활성은 흐리게 하지 않고 글자색을 한 단계 낮춘다. 위계는 글자색으로 만든다.(docs/theme.md 원칙 3)
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
                'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-decorative',
                'peer-disabled:cursor-not-allowed peer-disabled:text-decorative',
                className,
            )}
            {...props}
        />
    );
}

export { Label };
