import type { ComponentProps, CSSProperties } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/util/cn';

import { CONTROL_SIZES } from '../size/size.constants';

const textareaVariants = cva(
    [
        // 배치와 모양
        'w-full min-w-0 rounded-card border border-input bg-card',
        // 높이. 내용만큼 늘어나고, 손으로 끌어 바꾸지 못한다
        'field-sizing-content resize-none',
        // 글자
        'leading-relaxed text-strong placeholder:text-decorative',
        // 상태
        'aria-invalid:border-destructive',
        // 포커스. 입력끼리 붙어 있어 전역 값(4px)보다 좁게 띄운다
        'focus-visible:outline-offset-2',
        // 비활성
        'disabled:pointer-events-none disabled:text-muted-foreground',
    ],
    {
        variants: {
            // 글자 크기는 Input 과 같은 눈금에서 읽는다. 높이는 rows 가 정해 눈금을 타지 않는다.
            // 가장 낮은 높이는 rows 줄(--rows)에 위아래 여백과 테두리(2px)를 더한 값이다
            size: {
                '2xs': [
                    CONTROL_SIZES['2xs'].text,
                    'min-h-[calc(var(--rows)*1lh+0.5rem+2px)] px-2 py-1',
                ],
                xs: [
                    CONTROL_SIZES.xs.text,
                    'min-h-[calc(var(--rows)*1lh+0.75rem+2px)] px-2.5 py-1.5',
                ],
                sm: [CONTROL_SIZES.sm.text, 'min-h-[calc(var(--rows)*1lh+1rem+2px)] px-3 py-2'],
                md: [
                    CONTROL_SIZES.md.text,
                    'min-h-[calc(var(--rows)*1lh+1.25rem+2px)] px-4 py-2.5',
                ],
                lg: [CONTROL_SIZES.lg.text, 'min-h-[calc(var(--rows)*1lh+1.5rem+2px)] px-4 py-3'],
                xl: [CONTROL_SIZES.xl.text, 'min-h-[calc(var(--rows)*1lh+2rem+2px)] px-5 py-4'],
                '2xl': [
                    CONTROL_SIZES['2xl'].text,
                    'min-h-[calc(var(--rows)*1lh+2.5rem+2px)] px-6 py-5',
                ],
            },
        },
        defaultVariants: { size: 'sm' },
    },
);

type TextareaProps = ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>;

/**
 * 여러 줄 입력. shadcn 의 Textarea 를 바탕으로 했고, 입력만 그린다. 모양은 Input 과 같다.
 * 이름과 오류 문구는 Field · FieldLabel · FieldError 로 붙인다.(src/shared/ui/field/field.tsx)
 *
 * 높이는 내용만큼 늘어난다(field-sizing: content). 이때 브라우저가 rows 를 보지 않아,
 * rows 를 가장 낮은 높이로 바꿔 넣는다. 처음에는 rows 줄이고 그보다 길어지면 늘어난다.
 * field-sizing 을 모르는 브라우저(Firefox)에서는 rows 줄로 고정되고 안에서 스크롤한다.
 * (2026-11-18 사용자 결정)
 */
function Textarea({ className, size, rows = 3, style, ...props }: TextareaProps) {
    return (
        <textarea
            rows={rows}
            data-slot="textarea"
            className={cn(textareaVariants({ size }), className)}
            // 여기서 넣은 줄 수를 textareaVariants 의 min-h 가 읽는다
            style={{ '--rows': rows, ...style } as CSSProperties}
            {...props}
        />
    );
}

export { Textarea, textareaVariants };
