'use client';

import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/shared/util/cn';

/*
 * 켜고 끄는 스위치. shadcn 의 Switch 를 Kozipsa 가 고쳐 쓰던 것을 가져왔다.
 * (Kozipsa packages/ui 의 custom/switch/switch.tsx, 2026-11-18 사용자 결정)
 * 구조와 크기는 그대로다. 아래 3가지만 이 사이트에 맞췄다.
 * - 색을 이 사이트의 토큰으로 옮겼다. 켜지면 primary, 꺼지면 input 이다
 * - 손잡이는 꺼졌을 때 strong 이다. card 는 다크에서 트랙과 밝기가 비슷해 보이지 않는다.
 *   Kozipsa 는 dark: 로 뒤집지만 여기서는 쓰지 않는다.(docs/theme.md 원칙 4)
 * - 쓰는 곳이 없는 variant 를 뺐다
 */

const switchVariants = cva(
    [
        // 배치와 모양. 테두리는 손잡이와 트랙 사이의 1px 틈이다
        'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent',
        // 켜짐 · 꺼짐
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        // 상태
        'aria-invalid:border-destructive',
        // 비활성
        'disabled:pointer-events-none disabled:data-[state=checked]:bg-chip disabled:data-[state=unchecked]:bg-chip',
        // 모션
        'transition-colors duration-fast ease-move',
    ],
    {
        variants: {
            // 트랙의 크기. 손잡이가 굴러갈 폭이라 높이의 약 1.7배다
            size: {
                xs: 'h-3.5 w-6',
                sm: 'h-4 w-7',
                base: 'h-4.5 w-8',
                lg: 'h-5 w-9',
                xl: 'h-6 w-10',
            },
        },
        defaultVariants: { size: 'base' },
    },
);

const switchThumbVariants = cva(
    [
        // 모양
        'pointer-events-none block rounded-full',
        // 켜짐 · 꺼짐. 켜지면 트랙의 오른쪽 끝까지 간다. 2px 는 트랙의 좌우 테두리다
        'data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=checked]:bg-primary-foreground',
        'data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-strong',
        // 비활성
        'group-disabled/switch:data-[state=checked]:bg-muted-foreground',
        'group-disabled/switch:data-[state=unchecked]:bg-muted-foreground',
        // 모션. 동작 줄이기에서는 지속시간이 0ms 라 바로 옮겨 간다
        'transition-[translate] duration-fast ease-move',
    ],
    {
        variants: {
            // 손잡이의 크기. 트랙의 높이보다 2px 작다
            size: {
                xs: 'size-3',
                sm: 'size-3.5',
                base: 'size-4',
                lg: 'size-4.5',
                xl: 'size-5',
            },
        },
        defaultVariants: { size: 'base' },
    },
);

type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root> &
    VariantProps<typeof switchVariants>;

/** 스위치. 이름은 `<label htmlFor>` 로 잇거나 aria-label 로 준다 */
function Switch({ className, size, ...props }: SwitchProps) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn('group/switch', switchVariants({ size }), className)}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={switchThumbVariants({ size })}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch, switchVariants };
