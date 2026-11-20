'use client';

import '@/style/global.css';

import { MotionConfig, useReducedMotion } from 'framer-motion';

import { FONT_CLASS } from '@/_app/fonts';
import { Backdrop } from '@/widgets/backdrop';
import { ServerError } from '@/features/statusScreen';

interface OwnProps {
    error: unknown;
    retry: () => void;
}

/**
 * 루트 레이아웃이나 전역 Provider 에서 에러가 났을 때 보이는 화면. 루트 레이아웃을 대신 그린다.
 * 그래서 html · body 와 전역 스타일 · 서체를 여기서 다시 갖춘다.
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md 「Global Error」)
 *
 * 전역 Provider(`_app/Providers`)와 헤더 · 연락 섹션 · 푸터는 쓰지 않는다. 그것들이 에러의 원인일 수 있고,
 * 여기서 또 에러가 나면 Next 의 기본 화면으로 넘어간다.
 * 그래서 테마는 고르지 못하고 처음 방문과 같은 다크로 그린다. 동작 줄이기만 따로 맞춘다 (docs/motion.md 3절).
 * metadata 를 내보낼 수 없어 제목은 `<title>` 로 적는다
 */
export default function GlobalError({ retry }: OwnProps) {
    const isReduced = useReducedMotion() ?? false;

    return (
        <html lang="ko" className={FONT_CLASS}>
            <body className="min-h-dvh min-w-page-min">
                <title>문제가 생겼어요</title>
                <MotionConfig reducedMotion="user" skipAnimations={isReduced}>
                    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
                        <Backdrop />
                        <main className="relative z-raised flex-1">
                            <ServerError onRetry={retry} />
                        </main>
                    </div>
                </MotionConfig>
            </body>
        </html>
    );
}
