'use client';

import { Suspense } from 'react';

import { Header } from '@/widgets/header';

import SiteError from './(site)/error';

interface OwnProps {
    error: unknown;
    retry: () => void;
}

/**
 * (site) 밖의 페이지(관리 화면)를 그리다 에러가 났을 때 보이는 화면.
 * 그 페이지의 레이아웃까지 대신 그려, 헤더와 페이지 맨 위(#top)의 틀을 여기서 다시 갖춘다. `app/not-found.tsx` 와 같다.
 * 본문은 (site) 의 에러 화면과 같은 것을 쓴다. 프로젝트 전체가 한 가지 에러 화면을 쓴다.(2026-11-20 사용자 결정)
 */
export default function RootError({ error, retry }: OwnProps) {
    return (
        <div id="top" className="relative flex min-h-dvh flex-col overflow-x-clip">
            {/* 헤더가 주소를 읽는다. (site) 레이아웃과 같이 Suspense 안에 둔다 */}
            <Suspense fallback={null}>
                <Header />
            </Suspense>
            <SiteError error={error} retry={retry} />
        </div>
    );
}
