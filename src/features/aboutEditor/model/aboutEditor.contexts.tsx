'use client';

import {
    createContext,
    type ReactNode,
    use,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import Toast from '@/shared/ui/toast/Toast';

import { TOAST_DURATION_MS } from './aboutEditor.constants';

/** 토스트를 띄우는 함수. 섹션 폼이 저장한 결과를 알릴 때 부른다 */
type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

interface OwnProps {
    children: ReactNode;
}

/** 소개 수정 화면의 토스트. 화면에 하나만 두고 섹션 폼 4개가 함께 쓴다 */
export function ToastProvider({ children }: OwnProps) {
    const [message, setMessage] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback<ShowToast>((nextMessage) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setMessage(nextMessage);
        timerRef.current = setTimeout(() => {
            setMessage(null);
        }, TOAST_DURATION_MS);
    }, []);

    useEffect(
        () => () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        },
        [],
    );

    return (
        <ToastContext value={showToast}>
            {children}
            <Toast message={message} />
        </ToastContext>
    );
}

export function useToast(): ShowToast {
    const showToast = use(ToastContext);
    if (!showToast) {
        throw new Error('useToast 는 ToastProvider 안에서만 쓴다');
    }
    return showToast;
}
