import { cloneElement, type ComponentProps, isValidElement, type ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/util/cn';

import { CONTROL_SIZES } from '../size/size.constants';

/**
 * shadcn 의 Button 을 바탕으로 했다. variant · asChild · data-slot 은 shadcn 과 같다.
 * 모양은 이 사이트의 것이다. 색을 버튼에 바로 칠하지 않고, 뒤에 깐 면(span)에 칠한다.
 *
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
        // Tailwind 4 는 button 의 커서를 기본 화살표로 둔다. 누를 수 있음을 손가락으로 알린다
        'group/button relative inline-flex cursor-pointer rounded-full',
        // 아이콘
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        // 비활성. 마우스에 반응하지 않아 hover 연출도 멈춘다
        'disabled:pointer-events-none disabled:text-muted-foreground',
    ],
    {
        variants: {
            variant: {
                // 주 버튼. 연두 바탕
                default: 'font-bold text-primary-foreground hover:text-primary-foreground',
                // 눈에 덜 띄는 면에 밝은 글자를 쓴다
                secondary: [
                    'font-semibold text-secondary-foreground',
                    'hover:text-primary-foreground focus-visible:text-primary-foreground',
                ],
                // 지우기처럼 되돌릴 수 없는 동작. 테두리는 outlineSlim 과 같이 얇다
                destructive: [
                    'border border-destructive font-medium text-destructive',
                    'hover:text-primary-foreground focus-visible:text-primary-foreground',
                ],
                // 테두리는 버튼에 그린다. 평소 크기 그대로 있어 오른쪽 끝이 닫혀 있다
                outline: [
                    'border-2 border-strong font-semibold',
                    'hover:text-primary-foreground focus-visible:text-primary-foreground',
                ],
                // outline 보다 테두리가 얇다(1px). 작은 버튼이 여럿 놓이는 자리에 쓴다
                outlineSlim: [
                    'border border-strong font-medium',
                    'hover:text-primary-foreground focus-visible:text-primary-foreground',
                ],
                // 평소에는 면이 없고, hover · 포커스 때만 옅은 면이 깔린다
                ghost: 'font-medium text-strong hover:text-accent-foreground',
                // 글자만 있는 링크 모양. 면을 그리지 않는다
                link: 'font-medium text-primary underline-offset-4 hover:underline',
                brand: [
                    'font-semibold text-brand-foreground',
                    'hover:text-primary-foreground focus-visible:text-primary-foreground',
                ],
                outlineBrand: [
                    'border-2 border-brand font-semibold',
                    'hover:text-brand-foreground focus-visible:text-brand-foreground',
                ],
            },
            // 높이와 글자 크기는 입력과 함께 쓰는 눈금에서 읽고, 좌우 여백만 여기서 더한다
            size: {
                '2xs': [CONTROL_SIZES['2xs'].height, CONTROL_SIZES['2xs'].text, 'px-2.5'],
                xs: [CONTROL_SIZES.xs.height, CONTROL_SIZES.xs.text, 'px-3'],
                sm: [CONTROL_SIZES.sm.height, CONTROL_SIZES.sm.text, 'px-4'],
                md: [CONTROL_SIZES.md.height, CONTROL_SIZES.md.text, 'px-5'],
                lg: [CONTROL_SIZES.lg.height, CONTROL_SIZES.lg.text, 'px-6.5'],
                xl: [CONTROL_SIZES.xl.height, CONTROL_SIZES.xl.text, 'px-8'],
                '2xl': [CONTROL_SIZES['2xl'].height, CONTROL_SIZES['2xl'].text, 'px-10'],
            },
            effect: {
                // 누르면 눌리고, 글자색이 면을 따라 바뀐다
                sweep: 'transition-[scale,color] duration-fast ease-move motion-safe:active:scale-95',
                none: '',
            },
        },
        defaultVariants: { variant: 'default', size: 'lg', effect: 'sweep' },
    },
);

/**
 * 버튼의 면. 버튼보다 오른쪽으로 12px 더 길고, 평소에는 그만큼을 가려 둔다. 자리는 variant 가 정한다.
 * 비활성일 때는 chip 으로 칠한다. 면이 없는 ghost · link 는 칠하지 않는다
 */
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
        // 모션
        'transition-[clip-path] duration-fast ease-move',
    ],
    {
        variants: {
            variant: {
                default:
                    'inset-y-0 -right-3 left-0 bg-primary group-disabled/button:bg-chip before:bg-strong',
                secondary:
                    'inset-y-0 -right-3 left-0 bg-secondary group-disabled/button:bg-chip before:bg-strong',
                // 얇은 테두리(1px)까지 덮는다
                destructive:
                    '-inset-y-px -right-3.25 -left-px group-disabled/button:bg-chip before:bg-destructive',
                // 테두리 버튼의 면은 바탕이 없고, 채워질 때 버튼의 테두리(2px)까지 덮는다.
                // 채우는 색이 테두리와 같아, 넓어진 뒤에는 안쪽에 남은 테두리가 보이지 않는다
                outline:
                    '-inset-y-0.5 -right-3.5 -left-0.5 group-disabled/button:bg-chip before:bg-strong',
                outlineSlim:
                    '-inset-y-px -right-3.25 -left-px group-disabled/button:bg-chip before:bg-strong',
                ghost: 'inset-y-0 -right-3 left-0 before:bg-accent',
                link: 'hidden',
                brand: 'inset-y-0 -right-3 left-0 bg-brand group-disabled/button:bg-chip before:bg-primary',
                outlineBrand:
                    '-inset-y-0.5 -right-3.5 -left-0.5 group-disabled/button:bg-chip before:bg-brand',
            },
        },
        defaultVariants: { variant: 'default' },
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
    ],
    {
        variants: {
            variant: {
                default: 'inset-0 bg-primary group-disabled/button:bg-chip before:bg-strong',
                secondary: 'inset-0 bg-secondary group-disabled/button:bg-chip before:bg-strong',
                // 얇은 테두리(1px)까지 덮는다
                destructive: '-inset-px group-disabled/button:bg-chip before:bg-destructive',
                // 채울 때 버튼의 테두리(2px)까지 덮는다
                outline: '-inset-0.5 group-disabled/button:bg-chip before:bg-strong',
                outlineSlim: '-inset-px group-disabled/button:bg-chip before:bg-strong',
                ghost: 'inset-0 before:bg-accent',
                link: 'hidden',
                brand: 'inset-0 bg-brand group-disabled/button:bg-chip before:bg-primary',
                outlineBrand: '-inset-0.5 group-disabled/button:bg-chip before:bg-brand',
            },
        },
        defaultVariants: { variant: 'default' },
    },
);

type ButtonVariant = VariantProps<typeof buttonVariants>;

interface ContentAttributes {
    variant: ButtonVariant['variant'];
    effect: ButtonVariant['effect'];
    children: ReactNode;
}

/** 버튼의 면과 그 위의 글자 · 아이콘 */
function ButtonContent({ variant, effect, children }: ContentAttributes) {
    const isStatic = effect === 'none';

    return (
        <>
            <span
                aria-hidden="true"
                className={
                    isStatic ? staticSurfaceVariants({ variant }) : surfaceVariants({ variant })
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

type ButtonProps = ComponentProps<'button'> &
    ButtonVariant & {
        /** 버튼 대신 자식 요소(`<a>` 등)를 버튼 모양으로 그린다 */
        asChild?: boolean;
    };

/**
 * 버튼. 링크로 그릴 때는 asChild 를 주고 `<a>` 를 자식으로 넣는다.
 * 링크는 페이지 안 이동과 mailto 에, button 은 폼 제출과 동작에 쓴다.
 */
function Button({
    className,
    variant,
    size,
    effect,
    asChild = false,
    type = 'button',
    children,
    ...props
}: ButtonProps) {
    const classes = cn(buttonVariants({ variant, size, effect }), className);

    if (asChild) {
        if (!isValidElement<{ children?: ReactNode }>(children)) {
            return null;
        }
        // 자식의 내용을 면과 글자 묶음으로 바꿔 넣는다. 버튼의 속성은 Slot 이 자식에 합친다
        return (
            <Slot.Root data-slot="button" data-variant={variant} className={classes} {...props}>
                {cloneElement(
                    children,
                    undefined,
                    <ButtonContent variant={variant} effect={effect}>
                        {children.props.children}
                    </ButtonContent>,
                )}
            </Slot.Root>
        );
    }

    return (
        <button
            type={type}
            data-slot="button"
            data-variant={variant}
            className={classes}
            {...props}
        >
            <ButtonContent variant={variant} effect={effect}>
                {children}
            </ButtonContent>
        </button>
    );
}

export { Button, buttonVariants };
