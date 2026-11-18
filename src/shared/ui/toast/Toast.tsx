'use client';

import { type ReactNode, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Ban, CircleCheck, Info, TriangleAlert } from 'lucide-react';

import { cn } from '@/shared/util/cn';
import { DURATION, EASE } from '@/style/tokens/motion';

import Loader from '../loader/Loader';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastData {
    id: string;
    type: ToastType;
    message: string;
    description?: ReactNode;
    /** 띄워 두는 시간(ms). Infinity 면 직접 닫을 때까지 남는다 */
    duration: number;
    /** 같은 id 로 다시 띄운 횟수. 바뀌면 시간을 처음부터 다시 잰다 */
    revision: number;
}

const ICON_CLASS = 'size-8';
const ICON_STROKE_WIDTH = 1.2;

/** 종류는 테두리와 제목 · 아이콘의 색으로만 가른다. 바탕은 물들이지 않는다 (Kozipsa toast.md) */
const TYPE_STYLES: Record<ToastType, { border: string; text: string; icon: ReactNode }> = {
    default: { border: 'border-border-card', text: 'text-strong', icon: null },
    success: {
        border: 'border-success/40',
        text: 'text-success',
        icon: <CircleCheck className={ICON_CLASS} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    error: {
        border: 'border-destructive/40',
        text: 'text-destructive',
        icon: <Ban className={ICON_CLASS} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    warning: {
        border: 'border-warning/40',
        text: 'text-warning',
        icon: <TriangleAlert className={ICON_CLASS} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    info: {
        border: 'border-info/40',
        text: 'text-info',
        icon: <Info className={ICON_CLASS} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    // 진행 중은 결과가 아니라 의미색을 주지 않는다
    loading: {
        border: 'border-muted-foreground/40',
        text: 'text-muted-foreground',
        icon: <Loader size="xs" className="m-2.5" />,
    },
};

/** 아래에서 올라오며 나타나고, 내려가며 사라진다 */
const TOAST_VARIANTS = {
    hidden: { opacity: 0, y: 16, transition: { duration: DURATION.fast, ease: EASE.exit } },
    shown: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.enter } },
};

/** 아이콘은 작게 있다가 커진다. 종류가 바뀌면(로딩 → 결과) 다시 커진다 */
const ICON_VARIANTS = {
    hidden: { opacity: 0, scale: 0.5 },
    shown: { opacity: 1, scale: 1, transition: { duration: DURATION.fast, ease: EASE.enter } },
};

interface OwnProps {
    toast: ToastData;
    /** 띄워 둔 시간이 지났을 때 */
    onDismiss: (id: string) => void;
}

/**
 * 토스트 1장. 왼쪽에 종류의 아이콘, 오른쪽에 제목과 설명을 둔다. 모양은 Kozipsa 의 토스트와 같다.
 * 띄우는 것은 ToastProvider 가 한다. 이 컴포넌트는 그리고, 시간이 지나면 알린다.
 */
export default function Toast({ toast, onDismiss }: OwnProps) {
    const { id, type, message, description, duration, revision } = toast;
    const style = TYPE_STYLES[type];

    useEffect(() => {
        if (!Number.isFinite(duration)) return;
        const timer = setTimeout(() => {
            onDismiss(id);
        }, duration);
        return () => {
            clearTimeout(timer);
        };
        // revision 이 바뀌면 같은 시간이어도 처음부터 다시 잰다
    }, [id, duration, revision, onDismiss]);

    return (
        <motion.div
            layout
            data-slot="toast"
            data-type={type}
            className={cn(
                'pointer-events-auto flex items-center gap-3 rounded-card border bg-card p-4',
                style.border,
            )}
            variants={TOAST_VARIANTS}
            initial="hidden"
            animate="shown"
            exit="hidden"
            transition={{ layout: { duration: DURATION.fast, ease: EASE.move } }}
        >
            {style.icon ? (
                <motion.span
                    key={type}
                    className={cn('shrink-0', style.text)}
                    variants={ICON_VARIANTS}
                    initial="hidden"
                    animate="shown"
                    aria-hidden="true"
                >
                    {style.icon}
                </motion.span>
            ) : null}
            <div className="min-w-0 flex-1">
                <p className={cn('text-body font-medium break-keep', style.text)}>{message}</p>
                {description ? (
                    <div className="mt-1 text-caption break-keep whitespace-pre-line text-muted-foreground">
                        {description}
                    </div>
                ) : null}
            </div>
        </motion.div>
    );
}
