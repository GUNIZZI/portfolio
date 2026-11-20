'use client';

import { catchError, type ErrorInfo } from 'next/error';

import { RotateCw, TriangleAlert } from 'lucide-react';

import { cn } from '@/shared/util/cn';

import { Button } from '../button/button';

interface OwnProps {
    /** 에러가 났을 때 보이는 문구 */
    message?: string;
    /** 대신 그리는 칸을 놓는 자리의 폭 · 여백. 감싼 섹션의 바깥 여백과 같게 준다 */
    className?: string;
}

/** 감싼 내용 대신 그리는 칸. 문구와 다시 시도 버튼을 둔다 */
function ErrorFallback(
    { message = '이 부분을 불러오지 못했어요.', className }: OwnProps,
    { retry }: ErrorInfo,
) {
    return (
        // 바깥 칸은 자리만 잡는다. 섹션마다 바깥 여백이 달라 className 으로 받는다
        <div className={className}>
            <div
                role="alert"
                className={cn(
                    // 배치와 모양. 감싼 내용이 빠진 자리가 꺼지지 않게 높이를 잡아 둔다
                    'flex min-h-60 flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-card p-6',
                    // 글자
                    'text-center text-body text-muted-foreground',
                )}
            >
                <TriangleAlert aria-hidden="true" className="size-6" />
                <p>{message}</p>
                <Button
                    variant="outlineSlim"
                    size="sm"
                    icon={<RotateCw aria-hidden="true" />}
                    onClick={retry}
                >
                    다시 시도
                </Button>
            </div>
        </div>
    );
}

/**
 * 감싼 부분에서 에러가 나면 그 자리에만 대신 칸을 그린다. 페이지의 나머지는 그대로 남는다.
 * 감싸지 않은 곳의 에러는 페이지 전체가 에러 화면으로 바뀐다 (src/app/(site)/error.tsx).
 * Next 의 `catchError` 로 만든다. `notFound()` · `redirect()` 는 잡지 않고 그대로 지나가고,
 * 다른 페이지로 옮기면 에러 상태가 지워진다.
 * (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/catchError.md)
 */
const ErrorBoundary = catchError(ErrorFallback);

export default ErrorBoundary;
