import { cn } from '@/shared/util/cn';

interface OwnProps {
    /** 알릴 문구. 없으면 아무것도 그리지 않는다 */
    message: string | null;
    className?: string;
}

/**
 * 화면 아래 가운데에 잠깐 띄우는 알림.
 * 문구가 없을 때도 role="status" 요소는 남긴다. 나중에 생긴 요소는 스크린 리더가 읽지 않는다.
 * 띄우고 지우는 때는 쓰는 쪽이 정한다. 이 컴포넌트는 그리기만 한다.
 */
export default function Toast({ message, className }: OwnProps) {
    return (
        <div
            role="status"
            className={cn(
                'pointer-events-none fixed inset-x-0 bottom-6 z-modal flex justify-center px-gutter',
                className,
            )}
        >
            {message ? (
                <p className="rounded-card border border-border-card bg-card px-5 py-3 text-body font-medium text-strong shadow-glow">
                    {message}
                </p>
            ) : null}
        </div>
    );
}
