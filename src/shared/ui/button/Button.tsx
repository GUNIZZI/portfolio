import type { AnchorHTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/util/cn';

const buttonVariants = cva(
    [
        // 배치와 모양
        'inline-flex items-center gap-2.5 rounded-full',
        // 글자
        'text-body',
        // 모션
        'transition-colors duration-fast ease-move',
    ],
    {
        variants: {
            intent: {
                accent: 'bg-accent font-bold text-accent-foreground hover:text-accent-foreground',
                brand: 'bg-brand font-semibold text-brand-foreground hover:text-brand-foreground',
                outline: 'border-2 border-strong font-semibold hover:bg-chip',
                outlineBrand: 'border-2 border-brand font-semibold hover:bg-chip',
            },
            size: {
                md: 'min-h-11 px-5 text-sm',
                lg: 'min-h-12 px-6.5',
            },
        },
        defaultVariants: { intent: 'accent', size: 'lg' },
    },
);

interface OwnProps
    extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonVariants> {
    href: string;
}

/** 링크 모양 버튼. 페이지 안 이동과 mailto 에 쓴다 */
export default function Button({ intent, size, className, children, ...rest }: OwnProps) {
    return (
        <a className={cn(buttonVariants({ intent, size }), className)} {...rest}>
            {children}
        </a>
    );
}
