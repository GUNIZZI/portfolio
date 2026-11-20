import {
    cloneElement,
    type ComponentProps,
    isValidElement,
    type MouseEvent,
    type ReactNode,
} from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/util/cn';

import Loader from '../loader/Loader';
import { CONTROL_SIZES } from '../size/size.constants';

/**
 * shadcn 의 Button 을 바탕으로 했다. variant · asChild · data-slot 은 shadcn 과 같다.
 * 모양은 이 사이트의 것이다. 색을 버튼에 바로 칠하지 않고, 뒤에 깐 면(span)에 칠한다.
 *
 * hover · 포커스 때의 움직임은 effect 가 정한다.
 * - default: 면과 글자의 색만 짧게 바뀐다. 관리 화면을 비롯한 대부분의 버튼이 쓴다
 * - sweep: 다른 색의 면이 밀려 들어와 버튼을 덮는다. 홈의 Contact 처럼 눈에 띄어야 하는 버튼에만 준다
 * (2026-11-18 사용자 결정)
 *
 * 아이콘은 두 가지로 나눈다.(2026-11-20 사용자 결정)
 * - arrow: 방향을 가리키는 화살표. 버튼이 그린다. end 는 글자 뒤의 →, start 는 글자 앞의 ← 다.
 *   sweep 에서는 가리키는 쪽으로 조금 밀리고, 면도 그 방향으로 밀려 들어온다
 * - icon: 뜻을 나타내는 아이콘. 글자 앞에 놓이고 움직이지 않는다
 * 자식으로 넣은 아이콘도 움직이지 않는다. 움직일 아이콘을 자리로 짐작하지 않는다.
 * 버튼의 면은 넓어지지 않는다. 화살표는 버튼의 좌우 여백 안에서만 움직인다.
 * 동작 줄이기에서는 색만 바로 바뀌고 화살표는 밀리지 않는다. default 도 색이 바로 바뀐다.
 *
 * isLoading 은 Kozipsa 의 Button 에서 가져왔다. 실행 중인 버튼 위에 로더를 덮는다.(2026-11-18 사용자 결정)
 */
const buttonVariants = cva(
    [
        // 배치와 모양
        // Tailwind 4 는 button 의 커서를 기본 화살표로 둔다. 누를 수 있음을 손가락으로 알린다
        'group/button relative inline-flex cursor-pointer rounded-full',
        // 아이콘
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        // 비활성. 면과 테두리까지 함께 흐려진다. 마우스에 반응하지 않아 hover 연출도 멈춘다
        'disabled:pointer-events-none disabled:opacity-disabled',
        // 실행 중. 마우스에 반응하지 않는다. 키보드로 누르는 것은 Button 이 막는다
        'aria-busy:pointer-events-none',
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
            // 높이와 글자 크기는 입력과 함께 쓰는 눈금에서 읽고, 좌우 여백만 여기서 더한다.
            // lucide 아이콘의 크기도 단계를 따른다. 아이콘에 size-* 를 직접 적으면 그쪽을 쓴다.
            // shared/ui 의 Icon 은 size prop 으로 크기를 정하므로 건드리지 않는다
            size: {
                '2xs': [
                    CONTROL_SIZES['2xs'].height,
                    CONTROL_SIZES['2xs'].text,
                    "px-2.5 [&_svg.lucide:not([class*='size-'])]:size-3.5",
                ],
                xs: [
                    CONTROL_SIZES.xs.height,
                    CONTROL_SIZES.xs.text,
                    "px-3 [&_svg.lucide:not([class*='size-'])]:size-4",
                ],
                sm: [
                    CONTROL_SIZES.sm.height,
                    CONTROL_SIZES.sm.text,
                    "px-4 [&_svg.lucide:not([class*='size-'])]:size-4.5",
                ],
                md: [
                    CONTROL_SIZES.md.height,
                    CONTROL_SIZES.md.text,
                    "px-5 [&_svg.lucide:not([class*='size-'])]:size-5",
                ],
                lg: [
                    CONTROL_SIZES.lg.height,
                    CONTROL_SIZES.lg.text,
                    "px-6.5 [&_svg.lucide:not([class*='size-'])]:size-5",
                ],
                xl: [
                    CONTROL_SIZES.xl.height,
                    CONTROL_SIZES.xl.text,
                    "px-8 [&_svg.lucide:not([class*='size-'])]:size-6",
                ],
                '2xl': [
                    CONTROL_SIZES['2xl'].height,
                    CONTROL_SIZES['2xl'].text,
                    "px-10 [&_svg.lucide:not([class*='size-'])]:size-7",
                ],
            },
            effect: {
                // 글자색이 면과 함께 짧게 바뀐다
                default: 'transition-colors duration-fast ease-move',
                // 누르면 눌리고, 글자색이 면을 따라 바뀐다
                sweep: 'transition-[scale,color] duration-fast ease-move motion-safe:active:scale-95',
            },
        },
        defaultVariants: { variant: 'default', size: 'lg', effect: 'default' },
    },
);

/**
 * sweep 의 면. 버튼과 크기가 같고, 다른 색의 면(::before)이 밖에서 밀려 들어와 덮는다.
 * 자리는 variant 가, 들어오는 방향은 from 이 정한다.
 */
const surfaceVariants = cva(
    [
        // 배치와 모양
        'absolute overflow-hidden rounded-full',
        // 밀려 들어오는 면
        'before:absolute before:inset-0 before:rounded-full',
        'before:transition-[translate] before:duration-fast before:ease-move',
        // hover · 포커스
        'group-hover/button:before:translate-x-0 group-focus-visible/button:before:translate-x-0',
    ],
    {
        variants: {
            variant: {
                default: 'inset-0 bg-primary before:bg-strong',
                secondary: 'inset-0 bg-secondary before:bg-strong',
                // 얇은 테두리(1px)까지 덮는다
                destructive: '-inset-px before:bg-destructive',
                // 테두리 버튼의 면은 바탕이 없고, 채워질 때 버튼의 테두리(2px)까지 덮는다
                outline: '-inset-0.5 before:bg-strong',
                outlineSlim: '-inset-px before:bg-strong',
                ghost: 'inset-0 before:bg-accent',
                link: 'hidden',
                brand: 'inset-0 bg-brand before:bg-primary',
                outlineBrand: '-inset-0.5 before:bg-brand',
            },
            // 처음에 면이 숨어 있는 쪽. 화살표가 가리키는 방향의 반대쪽이다
            from: {
                left: 'before:-translate-x-[101%]',
                right: 'before:translate-x-[101%]',
            },
        },
        defaultVariants: { variant: 'default', from: 'left' },
    },
);

/** 움직이지 않는 면. 버튼과 크기가 같고, hover · 포커스 때 면의 색이 덮는 색으로 짧게 바뀐다 */
const staticSurfaceVariants = cva(
    'absolute rounded-full transition-colors duration-fast ease-move',
    {
        variants: {
            variant: {
                default: [
                    'inset-0 bg-primary',
                    'group-hover/button:bg-strong group-focus-visible/button:bg-strong',
                ],
                secondary: [
                    'inset-0 bg-secondary',
                    'group-hover/button:bg-strong group-focus-visible/button:bg-strong',
                ],
                // 얇은 테두리(1px)까지 덮는다
                destructive: [
                    '-inset-px',
                    'group-hover/button:bg-destructive group-focus-visible/button:bg-destructive',
                ],
                // 채울 때 버튼의 테두리(2px)까지 덮는다
                outline: [
                    '-inset-0.5',
                    'group-hover/button:bg-strong group-focus-visible/button:bg-strong',
                ],
                outlineSlim: [
                    '-inset-px',
                    'group-hover/button:bg-strong group-focus-visible/button:bg-strong',
                ],
                ghost: 'inset-0 group-hover/button:bg-accent group-focus-visible/button:bg-accent',
                link: 'hidden',
                brand: [
                    'inset-0 bg-brand',
                    'group-hover/button:bg-primary group-focus-visible/button:bg-primary',
                ],
                outlineBrand: [
                    '-inset-0.5',
                    'group-hover/button:bg-brand group-focus-visible/button:bg-brand',
                ],
            },
        },
        defaultVariants: { variant: 'default' },
    },
);

/**
 * sweep 에서 화살표가 가리키는 쪽으로 밀리는 거리(4px). 버튼의 좌우 여백 안에 머문다.
 * 가장 작은 버튼(2xs)의 여백이 10px 이다
 */
const ARROW_NUDGE_CLASS = {
    end: [
        'transition-[translate] duration-fast ease-move',
        'motion-safe:group-hover/button:translate-x-1',
        'motion-safe:group-focus-visible/button:translate-x-1',
    ],
    start: [
        'transition-[translate] duration-fast ease-move',
        'motion-safe:group-hover/button:-translate-x-1',
        'motion-safe:group-focus-visible/button:-translate-x-1',
    ],
} as const;

type ButtonVariant = VariantProps<typeof buttonVariants>;

/** 화살표의 자리. end 는 글자 뒤의 →, start 는 글자 앞의 ← */
type ButtonArrow = 'start' | 'end';

interface ContentAttributes {
    variant: ButtonVariant['variant'];
    effect: ButtonVariant['effect'];
    arrow: ButtonArrow | undefined;
    icon: ReactNode;
    children: ReactNode;
}

/** 버튼의 면과 그 위의 글자 · 아이콘 */
function ButtonContent({ variant, effect, arrow, icon, children }: ContentAttributes) {
    const isSweep = effect === 'sweep';

    return (
        <>
            <span
                aria-hidden="true"
                className={
                    isSweep
                        ? surfaceVariants({ variant, from: arrow === 'start' ? 'right' : 'left' })
                        : staticSurfaceVariants({ variant })
                }
            />
            {/* 글자와 아이콘. 면보다 뒤에 오는 요소라 z-index 없이 위에 그려진다 */}
            <span className="relative inline-flex items-center gap-2.5">
                {arrow === 'start' ? (
                    <ArrowLeft
                        aria-hidden="true"
                        className={cn(isSweep && ARROW_NUDGE_CLASS.start)}
                    />
                ) : null}
                {icon}
                {children}
                {arrow === 'end' ? (
                    <ArrowRight
                        aria-hidden="true"
                        className={cn(isSweep && ARROW_NUDGE_CLASS.end)}
                    />
                ) : null}
            </span>
        </>
    );
}

type ButtonProps = ComponentProps<'button'> &
    ButtonVariant & {
        /** 버튼 대신 자식 요소(`<a>` 등)를 버튼 모양으로 그린다 */
        asChild?: boolean;
        /** 방향을 가리키는 화살표. end 는 글자 뒤의 →, start 는 글자 앞의 ←. sweep 에서는 가리키는 쪽으로 조금 밀린다 */
        arrow?: ButtonArrow;
        /** 뜻을 나타내는 아이콘. 글자 앞에 놓이고 움직이지 않는다 */
        icon?: ReactNode;
        /** 실행 중인가. 버튼 위에 로더를 덮고 다시 누르지 못하게 막는다. asChild 와 함께 쓰지 않는다 */
        isLoading?: boolean;
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
    arrow,
    icon,
    asChild = false,
    isLoading = false,
    type = 'button',
    children,
    onClick,
    ...props
}: ButtonProps) {
    const classes = cn(buttonVariants({ variant, size, effect }), className);

    /**
     * 실행 중에는 누른 것을 버린다. 기본 동작도 막아 폼이 다시 제출되지 않는다.
     * disabled 로 막지 않는 것은 포커스를 잃지 않게 하고, 비활성과 실행 중을 다르게 보이게 하기 위해서다
     */
    function hndlClick(event: MouseEvent<HTMLButtonElement>) {
        if (isLoading) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        onClick?.(event);
    }

    if (asChild) {
        if (!isValidElement<{ children?: ReactNode }>(children)) {
            return null;
        }
        // 자식의 내용을 면과 글자 묶음으로 바꿔 넣는다. 버튼의 속성은 Slot 이 자식에 합친다
        return (
            <Slot.Root
                data-slot="button"
                data-variant={variant}
                className={classes}
                onClick={onClick}
                {...props}
            >
                {cloneElement(
                    children,
                    undefined,
                    <ButtonContent variant={variant} effect={effect} arrow={arrow} icon={icon}>
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
            aria-busy={isLoading || undefined}
            onClick={hndlClick}
            {...props}
        >
            <ButtonContent variant={variant} effect={effect} arrow={arrow} icon={icon}>
                {children}
            </ButtonContent>
            {/* 버튼을 덮는다. 테두리가 있는 버튼은 테두리 안쪽만 덮는다 */}
            {isLoading ? (
                <Loader size="xs" className="absolute inset-0 rounded-full bg-card/90" />
            ) : null}
        </button>
    );
}

export { Button, buttonVariants };
