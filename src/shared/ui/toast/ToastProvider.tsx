'use client';

import { createContext, type ReactNode, use, useMemo, useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import Toast, { type ToastData, type ToastType } from './Toast';

/** 토스트를 띄워 두는 시간(ms). Kozipsa 의 토스트와 같다 */
const TOAST_DURATION_MS = 4000;

/** 한 번에 보여 주는 토스트의 수. 넘치면 오래된 것부터 지운다 */
const MAX_VISIBLE_TOASTS = 5;

export interface ToastOptions {
    /** 같은 id 로 다시 부르면 새로 쌓지 않고 그 토스트를 바꾼다 */
    id?: string;
    /** 제목 아래의 설명. 문자열의 줄바꿈은 그대로 나온다 */
    description?: ReactNode;
    /** 띄워 두는 시간(ms) */
    duration?: number;
}

/** toast.promise 에 넘기는 문구. error 는 제목만 맡고, 던져진 오류의 내용은 설명으로 간다 */
export interface ToastPromiseMessages<Data> {
    loading: string;
    success: string | ((data: Data) => string);
    error: string | ((error: unknown) => string);
    /** 성공이든 실패든 끝난 뒤 한 번 부른다 */
    finally?: () => void;
}

type ShowToast = (message: string, options?: ToastOptions) => string;

/** 토스트를 띄우는 함수. 호출 방식은 Kozipsa 의 toast 와 같다 */
export interface ToastFunction extends ShowToast {
    success: ShowToast;
    error: ShowToast;
    warning: ShowToast;
    info: ShowToast;
    /** 직접 닫거나 같은 id 로 결과를 띄울 때까지 남는다 */
    loading: ShowToast;
    /** 토스트 1장이 로딩에서 성공 · 실패로 바뀐다 */
    promise: <Data>(
        promise: Promise<Data> | (() => Promise<Data>),
        messages: ToastPromiseMessages<Data>,
        options?: Omit<ToastOptions, 'id'>,
    ) => string;
    /** id 의 토스트를 지운다. id 가 없으면 모두 지운다 */
    dismiss: (id?: string) => void;
}

type SetToasts = (update: (prev: ToastData[]) => ToastData[]) => void;

function createToast(setToasts: SetToasts): ToastFunction {
    let sequence = 0;

    function show(type: ToastType, message: string, options: ToastOptions = {}): string {
        sequence += 1;
        const id = options.id ?? `toast-${sequence}`;
        const revision = sequence;
        const duration = options.duration ?? (type === 'loading' ? Infinity : TOAST_DURATION_MS);
        const next: ToastData = {
            id,
            type,
            message,
            description: options.description,
            duration,
            revision,
        };

        setToasts((prev) =>
            prev.some((toast) => toast.id === id)
                ? prev.map((toast) => (toast.id === id ? next : toast))
                : [...prev, next].slice(-MAX_VISIBLE_TOASTS),
        );
        return id;
    }

    const toast: ToastFunction = Object.assign(
        (message: string, options?: ToastOptions) => show('default', message, options),
        {
            success: (message: string, options?: ToastOptions) => show('success', message, options),
            error: (message: string, options?: ToastOptions) => show('error', message, options),
            warning: (message: string, options?: ToastOptions) => show('warning', message, options),
            info: (message: string, options?: ToastOptions) => show('info', message, options),
            loading: (message: string, options?: ToastOptions) => show('loading', message, options),
            promise<Data>(
                promise: Promise<Data> | (() => Promise<Data>),
                messages: ToastPromiseMessages<Data>,
                options?: Omit<ToastOptions, 'id'>,
            ) {
                const id = show('loading', messages.loading, { description: options?.description });
                // 결과는 같은 id 로 띄워 로딩 토스트를 바꾼다
                const resultOptions = { ...options, id };

                Promise.resolve(typeof promise === 'function' ? promise() : promise)
                    .then(
                        (data) => {
                            const { success } = messages;
                            show(
                                'success',
                                typeof success === 'function' ? success(data) : success,
                                resultOptions,
                            );
                        },
                        (error: unknown) => {
                            const reason = error instanceof Error ? error.message : String(error);
                            show(
                                'error',
                                typeof messages.error === 'function'
                                    ? messages.error(error)
                                    : messages.error,
                                {
                                    ...resultOptions,
                                    description: options?.description ?? reason,
                                },
                            );
                        },
                    )
                    .finally(() => messages.finally?.());
                return id;
            },
            dismiss(id?: string) {
                setToasts((prev) => (id ? prev.filter((toast) => toast.id !== id) : []));
            },
        },
    );

    return toast;
}

const ToastContext = createContext<ToastFunction | null>(null);

interface OwnProps {
    children: ReactNode;
}

/**
 * 토스트를 그리는 곳. 안쪽 어디서든 useToast 로 받은 함수로 띄운다.
 * 레이아웃에 두면 화면을 옮겨도 남아, 저장하고 목록으로 돌아간 뒤에도 문구가 보인다.
 * 화면 오른쪽 아래에 쌓이고, 새 토스트가 아래에 온다.
 *
 * role="status" 요소는 토스트가 없을 때도 남긴다. 나중에 생긴 요소는 스크린 리더가 읽지 않는다.
 */
export function ToastProvider({ children }: OwnProps) {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    // setToasts 는 바뀌지 않는다. 띄우는 함수도 한 번만 만든다
    const toast = useMemo(() => createToast(setToasts), []);

    return (
        <ToastContext value={toast}>
            {children}
            <div
                role="status"
                className="pointer-events-none fixed inset-x-4 bottom-6 z-modal flex flex-col gap-3 sm:right-6 sm:left-auto sm:w-89"
            >
                <AnimatePresence>
                    {toasts.map((item) => (
                        <Toast key={item.id} toast={item} onDismiss={toast.dismiss} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext>
    );
}

export function useToast(): ToastFunction {
    const toast = use(ToastContext);
    if (!toast) {
        throw new Error('useToast 는 ToastProvider 안에서만 쓴다');
    }
    return toast;
}
