import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/util/cn';

import { CONTROL_SIZES } from '../size/size.constants';

const textareaVariants = cva(
    [
        // 배치와 모양
        'w-full min-w-0 rounded-card border border-input bg-card',
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
            // 글자 크기는 Input 과 같은 눈금에서 읽는다. 높이는 rows 가 정해 눈금을 타지 않는다
            size: {
                '2xs': [CONTROL_SIZES['2xs'].text, 'px-2 py-1'],
                xs: [CONTROL_SIZES.xs.text, 'px-2.5 py-1.5'],
                sm: [CONTROL_SIZES.sm.text, 'px-3 py-2'],
                md: [CONTROL_SIZES.md.text, 'px-4 py-2.5'],
                lg: [CONTROL_SIZES.lg.text, 'px-4 py-3'],
                xl: [CONTROL_SIZES.xl.text, 'px-5 py-4'],
                '2xl': [CONTROL_SIZES['2xl'].text, 'px-6 py-5'],
            },
        },
        defaultVariants: { size: 'sm' },
    },
);

type TextareaProps = ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>;

/**
 * 여러 줄 입력. shadcn 의 Textarea 를 바탕으로 했고, 입력만 그린다. 모양은 Input 과 같다.
 * 이름과 오류 문구는 Field · FieldLabel · FieldError 로 붙인다.(src/shared/ui/field/field.tsx)
 */
function Textarea({ className, size, rows = 3, ...props }: TextareaProps) {
    return (
        <textarea
            rows={rows}
            data-slot="textarea"
            className={cn(textareaVariants({ size }), className)}
            {...props}
        />
    );
}

export { Textarea, textareaVariants };
