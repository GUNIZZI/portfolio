'use client';

import { type ComponentProps, createContext, use, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';

import { cn } from '@/shared/util/cn';
import { DURATION, EASE } from '@/style/tokens/motion';

import { Button } from '../button/button';

/*
 * 확인 창의 조각. 되돌릴 수 없는 동작을 하기 전에 한 번 더 묻는다. shadcn 의 AlertDialog 를 바탕으로 했다.
 * 구조와 이름은 shadcn 그대로다. 화면에서는 이 조각을 바로 쓰지 않고 useConfirmDialog 의 addConfirmDialog 를 부른다.
 * 아래 4가지만 이 사이트에 맞췄다.
 * - 나타나고 사라지는 연출은 Kozipsa 와 같다. 딤은 옅어지고, 창은 옅어지며 95% 크기에서 커진다.
 *   CSS 애니메이션이 아니라 framer-motion 으로 그린다.(docs/motion.md 원칙 1)
 * - 층은 z-modal, 딤은 배경색을 옅게 깔고 뒤를 흐린 것이다.(docs/theme.md 3절)
 * - 버튼은 연출 없는(effect 기본값) 작은 버튼이다. 관리 화면의 버튼과 같다
 * - 쓰지 않는 size 변형과 AlertDialogMedia 를 뺐다
 */

/** 딤. 옅어지며 나타나고 사라진다 */
const OVERLAY_VARIANTS = {
    closed: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.exit } },
    open: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE.enter } },
};

/** 창. 옅어지며 95% 크기에서 커지고, 닫힐 때는 거꾸로다. 값은 Kozipsa 의 zoom-in-95 · 200ms 다 */
const CONTENT_VARIANTS = {
    closed: { opacity: 0, scale: 0.95, transition: { duration: DURATION.fast, ease: EASE.exit } },
    open: { opacity: 1, scale: 1, transition: { duration: DURATION.fast, ease: EASE.enter } },
};

/** 창이 열려 있는가. 닫힌 뒤에도 사라지는 연출이 끝날 때까지 창을 남겨 두려고 조각끼리 나눠 읽는다 */
const AlertDialogOpenContext = createContext(false);

function AlertDialog({
    open,
    defaultOpen = false,
    onOpenChange,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Root>) {
    const [isOpenInner, setIsOpenInner] = useState(defaultOpen);
    const isOpen = open ?? isOpenInner;

    function hndlOpenChange(isNextOpen: boolean) {
        setIsOpenInner(isNextOpen);
        onOpenChange?.(isNextOpen);
    }

    return (
        <AlertDialogOpenContext value={isOpen}>
            <AlertDialogPrimitive.Root
                data-slot="alert-dialog"
                open={isOpen}
                onOpenChange={hndlOpenChange}
                {...props}
            />
        </AlertDialogOpenContext>
    );
}

function AlertDialogTrigger({ ...props }: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
    return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: ComponentProps<typeof AlertDialogPrimitive.Portal>) {
    return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({
    className,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
    return (
        <AlertDialogPrimitive.Overlay asChild forceMount {...props}>
            <motion.div
                data-slot="alert-dialog-overlay"
                className={cn('fixed inset-0 z-modal bg-background/80 backdrop-blur-sm', className)}
                variants={OVERLAY_VARIANTS}
                initial="closed"
                animate="open"
                exit="closed"
            />
        </AlertDialogPrimitive.Overlay>
    );
}

interface ContentAttributes {
    /** 사라지는 연출이 끝나 창을 걷어 낸 뒤에 부른다 */
    onExitComplete?: () => void;
}

function AlertDialogContent({
    className,
    children,
    onExitComplete,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content> & ContentAttributes) {
    const isOpen = use(AlertDialogOpenContext);

    return (
        // 닫혀도 바로 걷어 내지 않는다. 사라지는 연출이 끝나면 AnimatePresence 가 걷어 낸다
        <AnimatePresence onExitComplete={onExitComplete}>
            {isOpen ? (
                <AlertDialogPortal forceMount>
                    <AlertDialogOverlay />
                    <AlertDialogPrimitive.Content asChild forceMount {...props}>
                        <motion.div
                            data-slot="alert-dialog-content"
                            className={cn(
                                // 배치. 화면 가운데에 띄우고, 좁은 화면에서는 양옆을 16px 씩 남긴다.
                                // 가운데로 옮기는 것은 translate 속성이라 연출의 scale(transform)과 겹치지 않는다
                                'fixed top-1/2 left-1/2 z-modal grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-6 sm:max-w-md',
                                // 모양
                                'rounded-card border border-border-card bg-card p-6',
                                className,
                            )}
                            variants={CONTENT_VARIANTS}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            {children}
                        </motion.div>
                    </AlertDialogPrimitive.Content>
                </AlertDialogPortal>
            ) : null}
        </AnimatePresence>
    );
}

function AlertDialogHeader({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-dialog-header"
            className={cn('flex flex-col gap-2', className)}
            {...props}
        />
    );
}

function AlertDialogFooter({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-dialog-footer"
            className={cn('flex justify-end gap-2', className)}
            {...props}
        />
    );
}

function AlertDialogTitle({
    className,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className={cn('text-lead font-bold text-strong', className)}
            {...props}
        />
    );
}

function AlertDialogDescription({
    className,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className={cn('text-body text-muted-foreground', className)}
            {...props}
        />
    );
}

type DialogButtonAttributes = Pick<ComponentProps<typeof Button>, 'variant' | 'size'>;

function AlertDialogAction({
    className,
    variant = 'default',
    size = 'sm',
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Action> & DialogButtonAttributes) {
    return (
        <Button variant={variant} size={size} asChild>
            <AlertDialogPrimitive.Action
                data-slot="alert-dialog-action"
                className={cn('items-center', className)}
                {...props}
            />
        </Button>
    );
}

function AlertDialogCancel({
    className,
    variant = 'secondary',
    size = 'sm',
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Cancel> & DialogButtonAttributes) {
    return (
        <Button variant={variant} size={size} asChild>
            <AlertDialogPrimitive.Cancel
                data-slot="alert-dialog-cancel"
                className={cn('items-center', className)}
                {...props}
            />
        </Button>
    );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger,
};
