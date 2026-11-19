import { Suspense } from 'react';

import { Header } from '@/widgets/header';
import { PageTransition } from '@/widgets/pageTransition';

/**
 * 헤더가 있는 공개 화면의 틀. 헤더를 여기서 한 번만 그려, 페이지를 옮겨도 헤더는 남고 그 아래만 바뀐다.
 * 페이지 맨 위(#top)와 배경이 기대는 자리도 이 틀이 갖는다. 페이지는 배경과 본문 · 푸터를 채운다.
 */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
    return (
        <div
            id="top"
            // 페이지 전환이 이 틀을 이전 화면과 새 화면으로 찍어 움직인다. 이름은 전환하는 동안에만 붙는다 (src/style/viewTransition.css)
            data-view-transition="site-page"
            className="relative flex min-h-dvh flex-col overflow-x-clip"
        >
            {/* 헤더가 주소를 읽는다. 미리 그려 두지 않은 작업 상세의 틀을 만들 때 빌드가 막히지 않게 Suspense 안에 둔다 */}
            <Suspense fallback={null}>
                <Header />
            </Suspense>
            {/* 페이지를 옮길 때 화면 전환을 시작하는 표식. 헤더처럼 주소를 읽는다 */}
            <Suspense fallback={null}>
                <PageTransition />
            </Suspense>
            {children}
        </div>
    );
}
