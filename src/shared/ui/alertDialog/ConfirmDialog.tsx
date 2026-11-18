'use client';

import type { ComponentProps, ReactNode } from 'react';

import { Ban, CircleCheck, HelpCircle, Info, Trash2, TriangleAlert } from 'lucide-react';

import type { Button } from '../button/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './alertDialog';

export type ConfirmVariant = 'success' | 'error' | 'warning' | 'info' | 'delete' | 'question';

interface VariantData {
    icon: ReactNode;
    /** title 을 주지 않았을 때의 제목 */
    title: string;
    buttonVariant: ComponentProps<typeof Button>['variant'];
}

const ICON_CLASS = 'size-16 shrink-0';
const ICON_STROKE_WIDTH = 1.2;

/**
 * 종류마다의 아이콘 · 기본 제목 · 실행 버튼. 아이콘과 문구는 Kozipsa 의 ConfirmDialog 그대로다.
 * 실행 버튼은 이 사이트의 Button 에 있는 변형으로 옮겼다. success · warning 버튼이 없어 주 버튼을 쓴다
 */
const CONFIRM_VARIANTS: Record<ConfirmVariant, VariantData> = {
    success: {
        icon: (
            <CircleCheck
                className={`${ICON_CLASS} text-success`}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden="true"
            />
        ),
        title: '성공',
        buttonVariant: 'default',
    },
    error: {
        icon: (
            <Ban
                className={`${ICON_CLASS} text-destructive`}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden="true"
            />
        ),
        title: '오류',
        buttonVariant: 'destructive',
    },
    warning: {
        icon: (
            <TriangleAlert
                className={`${ICON_CLASS} text-warning`}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden="true"
            />
        ),
        title: '경고',
        buttonVariant: 'default',
    },
    info: {
        icon: (
            <Info
                className={`${ICON_CLASS} text-info`}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden="true"
            />
        ),
        title: '안내',
        buttonVariant: 'secondary',
    },
    delete: {
        icon: (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full border-3 border-destructive text-destructive">
                <Trash2 className="size-8" strokeWidth={1.7} aria-hidden="true" />
            </span>
        ),
        title: '삭제 하시겠습니까?',
        buttonVariant: 'destructive',
    },
    question: {
        icon: (
            <HelpCircle
                className={`${ICON_CLASS} text-warning`}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden="true"
            />
        ),
        title: '질문',
        buttonVariant: 'default',
    },
};

interface OwnProps {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    /** 묻는 내용의 종류. 아이콘 · 기본 제목 · 실행 버튼의 모양을 정한다 */
    variant?: ConfirmVariant;
    /** 없으면 종류의 기본 제목을 쓴다 */
    title?: string;
    description?: ReactNode;
    confirmText?: string;
    /** 없으면 취소 버튼을 그리지 않는다 */
    cancelText?: string;
    onConfirm?: () => void;
    /** 취소 버튼을 누르거나 Esc 로 닫았을 때 */
    onCancel?: () => void;
    /** 설명과 버튼 사이에 더 그릴 내용 */
    children?: ReactNode;
    /** 사라지는 연출이 끝나 창을 걷어 낸 뒤 */
    onExitComplete?: () => void;
    /** 닫힌 뒤 포커스를 어디로 돌려줄지 정할 때 */
    onCloseAutoFocus?: ComponentProps<typeof AlertDialogContent>['onCloseAutoFocus'];
}

/**
 * 확인 창의 완성품. 왼쪽에 종류를 알리는 아이콘, 오른쪽에 제목과 설명, 아래에 취소 · 실행 버튼을 둔다.
 * 구성은 Kozipsa 의 ConfirmDialog 와 같다.
 * 화면에 직접 그리지 않는다. useConfirmDialog 의 addConfirmDialog 를 부르면 ConfirmDialogProvider 가 그린다.
 */
export default function ConfirmDialog({
    open,
    onOpenChange,
    variant = 'info',
    title,
    description,
    confirmText = '확인',
    cancelText,
    onConfirm,
    onCancel,
    children,
    onExitComplete,
    onCloseAutoFocus,
}: OwnProps) {
    const config = CONFIRM_VARIANTS[variant];

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                className="gap-4 px-10 py-8"
                onEscapeKeyDown={onCancel}
                onExitComplete={onExitComplete}
                onCloseAutoFocus={onCloseAutoFocus}
            >
                <AlertDialogHeader className="flex-row items-center gap-5">
                    {config.icon}
                    <div className="flex-1">
                        <AlertDialogTitle className="break-keep">
                            {title ?? config.title}
                        </AlertDialogTitle>
                        {description ? (
                            <AlertDialogDescription className="mt-2 break-keep">
                                {description}
                            </AlertDialogDescription>
                        ) : null}
                    </div>
                </AlertDialogHeader>

                {children ? <div className="py-4">{children}</div> : null}

                <AlertDialogFooter className="pt-6">
                    {cancelText ? (
                        <AlertDialogCancel variant="ghost" className="px-2" onClick={onCancel}>
                            {cancelText}
                        </AlertDialogCancel>
                    ) : null}
                    <AlertDialogAction variant={config.buttonVariant} onClick={onConfirm}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
