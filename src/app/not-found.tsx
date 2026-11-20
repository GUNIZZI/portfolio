import { Suspense } from 'react';
import type { Metadata } from 'next';

import { Header } from '@/widgets/header';

import SiteNotFound from './(site)/not-found';

export const metadata: Metadata = { title: '찾을 수 없음' };

/**
 * 어느 라우트에도 맞지 않는 주소에서 보이는 화면.
 * 이 파일은 (site) 레이아웃 밖에서 그려져, 헤더와 페이지 맨 위(#top)의 틀을 여기서 다시 갖춘다.(src/app/(site)/layout.tsx)
 * 본문은 (site) 의 not-found 와 같은 것을 쓴다.
 * 없는 주소를 `[...rest]` 라우트로 받아 (site) 안에서 그리는 방법은 쓰지 않는다.
 * 그 방법은 서버가 화면을 그리지 못하고 빈 틀만 보낸다.(2026-11-20 `next build` 결과로 확인)
 */
export default function NotFoundPage() {
    return (
        <div id="top" className="relative flex min-h-dvh flex-col overflow-x-clip">
            {/* 헤더가 주소를 읽는다. (site) 레이아웃과 같이 Suspense 안에 둔다 */}
            <Suspense fallback={null}>
                <Header />
            </Suspense>
            <SiteNotFound />
        </div>
    );
}
