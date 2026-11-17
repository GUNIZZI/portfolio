import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/util/cn';

/**
 * hover · 포커스 연출은 세 가지가 함께 움직인다.
 * - 다른 색의 면이 왼쪽에서 밀려 들어와 버튼을 덮는다. 색이 뚝 바뀌지 않고 채워진다
 * - 버튼의 면이 오른쪽으로 조금 넓어진다
 * - 맨 끝의 아이콘(화살표)이 조금 늦게 따라 오른쪽으로 밀린다
 * 넓어지는 것은 폭을 바꾸지 않고, 처음부터 오른쪽으로 더 길게 깔아 둔 면을 clip-path 로 가렸다가 드러낸다.
 * 폭을 움직이면 매 프레임 레이아웃을 다시 계산하고 옆의 요소를 민다.(docs/motion.md 원칙 4)
 * 동작 줄이기에서는 색만 바로 바뀌고, 넓어지거나 밀리지 않는다.
 * effect 가 none 이면 언제나 색만 바로 바뀐다. 연출을 두지 않는 관리 화면이 쓴다.
 */
const buttonVariants = cva(
    [
        // 배치와 모양
        'group/button relative inline-flex rounded-full',
        // 글자
        'text-body',
        // 비활성. 마우스에 반응하지 않아 hover 연출도 멈춘다
        'disabled:pointer-events-none disabled:text-muted',
    ],
    {
        variants: {
            intent: {
                accent: 'font-bold text-accent-foreground hover:text-accent-foreground',
                brand: [
                    'font-semibold text-brand-foreground',
                    'hover:text-accent-foreground focus-visible:text-accent-foreground',
                ],
                // 테두리는 버튼에 그린다. 평소 크기 그대로 있어 오른쪽 끝이 닫혀 있다
                outline: [
                    'border-2 border-strong font-semibold',
                    'hover:text-accent-foreground focus-visible:text-accent-foreground',
                ],
                outlineBrand: [
                    'border-2 border-brand font-semibold',
                    'hover:text-brand-foreground focus-visible:text-brand-foreground',
                ],
            },
            size: {
                md: 'min-h-11 px-5 text-sm',
                lg: 'min-h-12 px-6.5',
            },
            effect: {
                // 누르면 눌리고, 글자색이 면을 따라 바뀐다
                sweep: 'transition-[scale,color] duration-fast ease-move motion-safe:active:scale-95',
                none: '',
            },
        },
        defaultVariants: { intent: 'accent', size: 'lg', effect: 'sweep' },
    },
);

/** 버튼의 면. 버튼보다 오른쪽으로 12px 더 길고, 평소에는 그만큼을 가려 둔다. 자리는 intent 가 정한다 */
const surfaceVariants = cva(
    [
        // 배치와 모양
        'absolute overflow-hidden rounded-full',
        '[clip-path:inset(0_12px_0_0_round_999px)]',
        // 밀려 들어오는 면. 처음에는 왼쪽 밖에 있다
        'before:absolute before:inset-0 before:-translate-x-[101%] before:rounded-full',
        'before:transition-[translate] before:duration-fast before:ease-move',
        // hover · 포커스
        'group-hover/button:before:translate-x-0 group-focus-visible/button:before:translate-x-0',
        'motion-safe:group-hover/button:[clip-path:inset(0_round_999px)]',
        'motion-safe:group-focus-visible/button:[clip-path:inset(0_round_999px)]',
        // 비활성
        'group-disabled/button:bg-chip',
        // 모션
        'transition-[clip-path] duration-fast ease-move',
    ],
    {
        variants: {
            intent: {
                accent: 'inset-y-0 -right-3 left-0 bg-accent before:bg-strong',
                brand: 'inset-y-0 -right-3 left-0 bg-brand before:bg-accent',
                // 테두리 버튼의 면은 바탕이 없고, 채워질 때 버튼의 테두리(2px)까지 덮는다.
                // 채우는 색이 테두리와 같아, 넓어진 뒤에는 안쪽에 남은 테두리가 보이지 않는다
                outline: '-inset-y-0.5 -right-3.5 -left-0.5 before:bg-strong',
                outlineBrand: '-inset-y-0.5 -right-3.5 -left-0.5 before:bg-brand',
            },
        },
        defaultVariants: { intent: 'accent' },
    },
);

/** 움직이지 않는 면. 버튼과 크기가 같고, hover · 포커스 때 덮는 색이 바로 나타난다 */
const staticSurfaceVariants = cva(
    [
        // 배치와 모양
        'absolute overflow-hidden rounded-full',
        // 덮는 면. 평소에는 그리지 않는다
        'before:absolute before:inset-0 before:hidden before:rounded-full',
        // hover · 포커스
        'group-hover/button:before:block group-focus-visible/button:before:block',
        // 비활성
        'group-disabled/button:bg-chip',
    ],
    {
        variants: {
            intent: {
                accent: 'inset-0 bg-accent before:bg-strong',
                brand: 'inset-0 bg-brand before:bg-accent',
                // 채울 때 버튼의 테두리(2px)까지 덮는다
                outline: '-inset-0.5 before:bg-strong',
                outlineBrand: '-inset-0.5 before:bg-brand',
            },
        },
        defaultVariants: { intent: 'accent' },
    },
);

type ButtonVariant = VariantProps<typeof buttonVariants>;

interface LinkAttributes extends AnchorHTMLAttributes<HTMLAnchorElement>, ButtonVariant {
    href: string;
}

interface ActionAttributes extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariant {
    href?: undefined;
}

/** href 가 있으면 링크, 없으면 버튼이다 */
type OwnProps = LinkAttributes | ActionAttributes;

interface ContentAttributes {
    intent: ButtonVariant['intent'];
    effect: ButtonVariant['effect'];
    children: ReactNode;
}

/** 버튼의 면과 그 위의 글자 · 아이콘 */
function ButtonContent({ intent, effect, children }: ContentAttributes) {
    const isStatic = effect === 'none';

    return (
        <>
            <span
                aria-hidden="true"
                className={
                    isStatic ? staticSurfaceVariants({ intent }) : surfaceVariants({ intent })
                }
            />
            {/* 글자와 아이콘. 면보다 뒤에 오는 요소라 z-index 없이 위에 그려진다 */}
            <span
                className={cn(
                    'relative inline-flex items-center gap-2.5',
                    !isStatic && [
                        // 맨 끝의 아이콘이 면이 넓어진 만큼, 조금 늦게 따라 밀린다
                        '[&>svg:last-child]:transition-[translate] [&>svg:last-child]:duration-fast [&>svg:last-child]:ease-move',
                        'motion-safe:group-hover/button:[&>svg:last-child]:translate-x-3',
                        'motion-safe:group-focus-visible/button:[&>svg:last-child]:translate-x-3',
                        'group-hover/button:[&>svg:last-child]:[transition-delay:var(--duration-instant)]',
                    ],
                )}
            >
                {children}
            </span>
        </>
    );
}

/**
 * 버튼. href 를 주면 링크(a)로, 주지 않으면 button 으로 그린다.
 * 링크는 페이지 안 이동과 mailto 에, button 은 폼 제출과 동작에 쓴다.
 */
export default function Button(props: OwnProps) {
    if (props.href !== undefined) {
        const { intent, size, effect, className, children, ...rest } = props;
        return (
            <a className={cn(buttonVariants({ intent, size, effect }), className)} {...rest}>
                <ButtonContent intent={intent} effect={effect}>
                    {children}
                </ButtonContent>
            </a>
        );
    }

    const { intent, size, effect, className, children, type = 'button', ...rest } = props;
    return (
        <button
            type={type}
            className={cn(buttonVariants({ intent, size, effect }), className)}
            {...rest}
        >
            <ButtonContent intent={intent} effect={effect}>
                {children}
            </ButtonContent>
        </button>
    );
}
