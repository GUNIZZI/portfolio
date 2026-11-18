'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 브라우저 주소창 색(meta theme-color)을 지금 테마의 바탕색에 맞춘다.
 * meta 태그는 CSS 변수를 읽지 못한다. 테마가 바뀔 때마다 토큰 --background 의 값을 읽어 고쳐 적는다.
 * 페이지를 옮기면 Next 가 meta 를 app/layout.tsx 의 값(다크)으로 되돌리므로 그때도 다시 적는다.
 *
 * useTheme 의 값이 아니라 html 의 data-theme 이 바뀌는 것을 지켜본다.
 * next-themes 는 속성을 effect 에서 적는데, 자식의 effect 가 먼저 돌아 바뀌기 전의 색을 읽게 된다
 */
export default function ThemeColorSync() {
    const pathname = usePathname();

    useEffect(() => {
        const root = document.documentElement;

        function syncThemeColor() {
            const background = getComputedStyle(root).getPropertyValue('--background').trim();
            if (!background) return;

            document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
                meta.setAttribute('content', background);
            });
        }

        syncThemeColor();
        const observer = new MutationObserver(syncThemeColor);
        observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

        return () => {
            observer.disconnect();
        };
    }, [pathname]);

    return null;
}
