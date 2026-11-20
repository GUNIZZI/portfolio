'use client';

import type { ComponentProps, ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/util/cn';

import { CONTROL_SIZES } from '../size/size.constants';

const inputVariants = cva(
    [
        // 배치와 모양
        'w-full min-w-0 rounded-card border border-input bg-card',
        // 글자
        'text-strong placeholder:text-decorative',
        // 상태
        'aria-invalid:border-destructive',
        // 포커스. 입력끼리 붙어 있어 전역 값(4px)보다 좁게 띄운다
        'focus-visible:outline-offset-2',
        // 비활성
        'disabled:pointer-events-none disabled:opacity-disabled',
    ],
    {
        variants: {
            // 높이와 글자 크기는 버튼과 함께 쓰는 눈금에서 읽고, 좌우 여백만 여기서 더한다
            size: {
                '2xs': [CONTROL_SIZES['2xs'].height, CONTROL_SIZES['2xs'].text, 'px-2'],
                xs: [CONTROL_SIZES.xs.height, CONTROL_SIZES.xs.text, 'px-2.5'],
                sm: [CONTROL_SIZES.sm.height, CONTROL_SIZES.sm.text, 'px-3'],
                md: [CONTROL_SIZES.md.height, CONTROL_SIZES.md.text, 'px-4'],
                lg: [CONTROL_SIZES.lg.height, CONTROL_SIZES.lg.text, 'px-4'],
                xl: [CONTROL_SIZES.xl.height, CONTROL_SIZES.xl.text, 'px-5'],
                '2xl': [CONTROL_SIZES['2xl'].height, CONTROL_SIZES['2xl'].text, 'px-6'],
            },
        },
        defaultVariants: { size: 'sm' },
    },
);

// 네이티브 size(글자 수로 정하는 폭)는 받지 않는다. 같은 이름을 크기 단계로 쓴다
type InputProps = Omit<ComponentProps<'input'>, 'size'> &
    VariantProps<typeof inputVariants> & {
        /** 입력칸 안쪽, 값의 앞에 붙는 글자. `https://` 같은 머리말에 쓴다 */
        beforeLabel?: ReactNode;
        /** 입력칸 안쪽, 값의 뒤에 붙는 글자. 원 · 개 같은 단위에 쓴다 */
        afterLabel?: ReactNode;
    };

/**
 * 입력칸 안쪽에 붙는 글자. 누르면 뒤의 상자가 받아 입력에 초점을 준다. Select 도 같은 모양으로 쓴다.
 * 색은 입력 글자색의 30% 다.(2026-11-17 사용자 결정) 비활성일 때는 상자와 함께 더 흐려진다.
 * 크기는 입력의 size 와 상관없이 text-xs 다. 입력이 2xs 일 때만 입력과 같은 크기를 쓴다.(2026-11-17 사용자 결정)
 */
const ADORNMENT_CLASS = 'pointer-events-none shrink-0 text-current/30 select-none';

/**
 * 한 줄 입력. shadcn 의 Input 을 바탕으로 했고, 입력만 그린다.
 * 이름과 오류 문구는 Field · FieldLabel · FieldError 로 붙인다.(src/shared/ui/field/field.tsx)
 * beforeLabel · afterLabel 은 Kozipsa 의 Input 에서 가져왔다. 둘 중 하나라도 주면
 * 상자(div)가 입력의 모양을 대신 입고, 그 안에 글자와 바탕 없는 입력을 나란히 놓는다.
 */
function Input({ className, type, size, beforeLabel, afterLabel, ...props }: InputProps) {
    if (!beforeLabel && !afterLabel) {
        return (
            <input
                type={type}
                data-slot="input"
                className={cn(inputVariants({ size }), className)}
                {...props}
            />
        );
    }

    // 2xs 는 입력의 글자(11px)가 text-xs(12px)보다 작다. 붙는 글자가 값보다 커지지 않게 입력을 따른다
    const adornmentClass = cn(ADORNMENT_CLASS, size !== '2xs' && 'text-xs');

    return (
        // 상자의 빈 곳이나 글자를 눌러도 입력에 초점이 간다. 키보드는 입력에 바로 닿아 따로 다루지 않는다
        <div
            data-slot="input-group"
            className={cn(
                inputVariants({ size }),
                // 배치
                'flex cursor-text items-center gap-2',
                // 상태. 안쪽 입력의 상태를 상자가 대신 보여 준다
                'has-[input[aria-invalid=true]]:border-destructive',
                'has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-disabled',
                // 포커스. 입력끼리 붙어 있어 전역 값(4px)보다 좁게 띄운다
                'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring',
                className,
            )}
            onClick={(event) => {
                event.currentTarget.querySelector('input')?.focus();
            }}
        >
            {beforeLabel ? <span className={adornmentClass}>{beforeLabel}</span> : null}
            <input
                type={type}
                data-slot="input"
                // 글자 정렬은 상자를 따른다. 입력은 text-align 을 물려받지 않아 따로 적는다
                className="min-w-0 flex-1 bg-transparent [text-align:inherit] outline-none placeholder:text-decorative"
                {...props}
            />
            {afterLabel ? <span className={adornmentClass}>{afterLabel}</span> : null}
        </div>
    );
}

export { ADORNMENT_CLASS, Input, inputVariants };
