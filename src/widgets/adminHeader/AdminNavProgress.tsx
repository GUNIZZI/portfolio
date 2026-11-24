'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/shared/util/cn';
import { subscribeRouteStart } from '@/shared/util/routeStart';

/** 옮기는 동안 선에 붙이는 속성. `data-pending:` 유틸리티가 읽는다 */
const PENDING_ATTRIBUTE = 'data-pending';

/**
 * 관리 화면을 옮기는 동안 머리 아래에 지나가는 진행 선.(2026-11-24 사용자 결정)
 * 메뉴 · 목록의 행 · 등록 버튼 · 저장한 뒤의 이동처럼 주소가 바뀌는 이동을 누른 순간부터 새 화면이 올 때까지 보인다.
 * 선 위로 빛이 왼쪽에서 오른쪽으로 지나가기를 되풀이한다. 기다리는 틀과 같은 움직임이다 (src/style/tokens/motion.css 의 --animate-skeleton).
 * 동작 줄이기에서는 멈춘 선만 보인다.
 * 지금 주소를 읽으므로 Suspense 안에 둔다
 */
export default function AdminNavProgress() {
    const pathname = usePathname();
    const search = useSearchParams().toString();
    const rootRef = useRef<HTMLDivElement>(null);

    // 누른 순간에 선을 드러낸다. Next 는 이 순간을 화면을 옮기는 transition 안에서 알린다.
    // 거기서 state 를 바꾸면 React 가 새 화면과 함께 그려, 기다리는 동안에는 선이 보이지 않는다. 그래서 속성을 직접 적는다
    useEffect(
        () =>
            subscribeRouteStart(({ pathname: toPathname, search: toSearch, type }) => {
                // 뒤로 · 앞으로 가기는 화면이 바로 바뀐다
                if (type === 'traverse') return;
                // 지금 주소로 다시 가면 주소가 바뀌지 않아 선을 거둘 때가 오지 않는다
                if (toPathname + toSearch === window.location.pathname + window.location.search) {
                    return;
                }
                rootRef.current?.setAttribute(PENDING_ATTRIBUTE, '');
            }),
        [],
    );

    // 주소가 바뀌었으면 새 화면이 온 것이다. 선을 거둔다
    useEffect(() => {
        rootRef.current?.removeAttribute(PENDING_ATTRIBUTE);
    }, [pathname, search]);

    return (
        <div
            ref={rootRef}
            role="status"
            // 머리의 아래 테두리 선 위에 겹쳐 놓는다. 옮기는 동안에만 보인다
            className={cn(
                'absolute inset-x-0 -bottom-px hidden h-0.5 overflow-hidden data-pending:block',
                'bg-primary motion-safe:bg-transparent',
            )}
        >
            <span className="sr-only">불러오는 중</span>
            <div
                aria-hidden="true"
                className={cn(
                    'hidden size-full motion-safe:block',
                    'bg-linear-to-r from-transparent via-primary to-transparent',
                    'motion-safe:animate-skeleton',
                )}
            />
        </div>
    );
}
