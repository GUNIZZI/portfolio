'use client';

import { ViewTransition } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 페이지를 옮길 때 화면 전환을 시작하는 표식.
 * 아무것도 그리지 않는다. 주소가 바뀌면 key 가 바뀌어 React 가 화면 전환을 시작하고,
 * 브라우저가 (site) 레이아웃의 틀을 이전 화면과 새 화면으로 찍어 움직인다. 연출은 style/viewTransition.css 에 있다.
 * 화면 전환을 지원하지 않는 브라우저에서는 연출 없이 페이지가 바로 바뀐다 (docs/motion.md 원칙 1)
 */
export default function PageTransition() {
    const pathname = usePathname();

    return (
        <ViewTransition
            key={pathname}
            enter="page-transition"
            exit="page-transition"
            default="none"
        >
            {/* 화면 밖에 있으면 React 가 전환을 건너뛴다. 화면 안에 1px 로 둔다 */}
            <div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 size-px" />
        </ViewTransition>
    );
}
