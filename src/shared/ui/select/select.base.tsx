'use client';

import type { ComponentProps } from 'react';

import type { VariantProps } from 'class-variance-authority';
import { Check, ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';

import { cn } from '@/shared/util/cn';

import { inputVariants } from '../input/input';

/*
 * 셀렉트의 부품. shadcn 의 Select 를 Kozipsa 가 고쳐 쓰던 것을 가져왔다.
 * (Kozipsa packages/ui 의 custom/select/select.base.tsx)
 * 구조와 이름은 그대로다. 아래 4가지만 이 사이트에 맞췄다.
 * - 트리거는 Input 의 모양과 크기 눈금을 그대로 입는다. 같은 size 의 Input 과 높이가 같다
 * - 목록이 나타나고 사라지는 연출을 뺐다. 관리 화면에는 연출을 두지 않는다.(docs/plan/admin/README.md 「모션」)
 * - 층은 z-overlay 다.(docs/theme.md 3절)
 * - 쓰지 않는 SelectScrollUpButton · SelectScrollDownButton 과 hideIcon 을 뺐다
 * 화면에서는 이 파일을 바로 쓰지 않고 select.tsx 의 Select 를 쓴다.
 */

function Select({ ...props }: ComponentProps<typeof SelectPrimitive.Root>) {
    return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: ComponentProps<typeof SelectPrimitive.Group>) {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
    className,
    size,
    children,
    ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & VariantProps<typeof inputVariants>) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            className={cn(
                inputVariants({ size }),
                // 배치
                'group/select flex cursor-pointer items-center gap-2 text-left',
                // 목록이 열리면 포커스가 목록 안으로 옮겨 간다. 열린 칸을 알 수 있게 포커스와 같은 테두리를 두른다
                'data-[state=open]:outline-2 data-[state=open]:outline-offset-2 data-[state=open]:outline-ring',
                // 비활성
                'disabled:cursor-default',
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown
                    aria-hidden="true"
                    className="ml-auto size-4 shrink-0 text-decorative group-data-[state=open]/select:rotate-180"
                />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
    className,
    children,
    position = 'popper',
    ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(
                    // 배치. 화면에 남은 높이보다 길어지지 않는다
                    'relative z-overlay max-h-(--radix-select-content-available-height) min-w-32',
                    // 모양
                    'rounded-card border border-input bg-popover text-popover-foreground',
                    // 트리거와 4px 띄운다
                    position === 'popper' &&
                        'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
                    className,
                )}
                position={position}
                {...props}
            >
                <SelectPrimitive.Viewport
                    className={cn(
                        'flex max-h-75 flex-col gap-0.5 overflow-y-auto p-1',
                        position === 'popper' && 'w-full min-w-(--radix-select-trigger-width)',
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
            {...props}
        />
    );
}

function SelectItem({
    className,
    children,
    ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                // 배치와 모양
                'relative flex w-full cursor-pointer items-center rounded-md py-1.5 pr-8 pl-2 select-none',
                // 글자
                'text-sm text-foreground',
                // 키보드와 마우스가 가리키는 항목. 포커스가 항목에 있어 전역 포커스 테두리 대신 면으로 알린다
                'outline-none data-highlighted:bg-state-hover',
                // 고른 항목
                'data-[state=checked]:bg-state-selected data-[state=checked]:text-strong',
                // 고를 수 없는 항목
                'data-disabled:pointer-events-none data-disabled:line-through data-disabled:opacity-disabled',
                className,
            )}
            {...props}
        >
            <span className="absolute right-2 flex size-4 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden="true" className="size-4 text-strong" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}

function SelectSeparator({
    className,
    ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
            {...props}
        />
    );
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
