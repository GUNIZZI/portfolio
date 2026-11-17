import { type InputHTMLAttributes, useId } from 'react';

import { cn } from '@/shared/util/cn';

interface OwnProps extends InputHTMLAttributes<HTMLInputElement> {
    /** 입력 위에 적는 이름. label 로 입력에 잇는다 */
    label: string;
    /** 오류 문구. 있으면 입력 아래에 적고 aria-describedby 로 입력에 잇는다 */
    error?: string;
}

/** 이름이 붙은 한 줄 입력 */
export default function Input({ label, error, id, className, ...rest }: OwnProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label htmlFor={inputId} className="text-caption font-medium text-muted">
                {label}
            </label>
            <input
                id={inputId}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={cn(
                    // 배치와 모양
                    'min-h-12 w-full rounded-card border border-border-card bg-card px-4',
                    // 글자
                    'text-body text-strong placeholder:text-decorative',
                    // 상태
                    'aria-invalid:border-accent',
                    // 포커스. 입력끼리 붙어 있어 전역 값(4px)보다 좁게 띄운다
                    'focus-visible:outline-offset-2',
                    // 비활성
                    'disabled:text-muted',
                )}
                {...rest}
            />
            {error ? (
                <p id={errorId} className="text-caption text-accent">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
