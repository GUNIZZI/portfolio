'use client';

import { type ReactNode, Suspense } from 'react';

import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ThemeProvider } from 'next-themes';

import ThemeColorSync from './ThemeColorSync';

interface OwnProps {
    children: ReactNode;
}

/**
 * 앱 전역 Provider.
 * OS 의 동작 줄이기 설정을 framer-motion 전체에 적용한다 (docs/motion.md 3절).
 * reducedMotion="user" 는 transform 만 멈춘다. 선 그리기(pathLength)와 opacity 는 계속 움직이므로
 * skipAnimations 로 모든 값을 최종 상태로 바로 그린다.
 *
 * 테마는 next-themes 가 html 의 data-theme 에 적는다. 값은 tokens/color.css 가 읽는다 (docs/theme.md 1.2절).
 * 처음 방문은 다크다. OS 설정을 따르지 않고, 방문자가 헤더의 버튼으로 바꾼 것만 저장한다.(2026-11-18 사용자 결정)
 */
export default function Providers({ children }: OwnProps) {
    const isReduced = useReducedMotion() ?? false;

    return (
        <ThemeProvider
            attribute="data-theme"
            themes={['dark', 'light']}
            defaultTheme="dark"
            enableSystem={false}
            // color-scheme 은 tokens/color.css 가 정한다
            enableColorScheme={false}
            // 테마를 바꾸는 순간에는 색 전환 애니메이션을 끈다. 요소마다 전환 시간이 달라 얼룩져 보인다
            disableTransitionOnChange
        >
            {/* 주소를 읽는다. 값을 모르는 동적 경로를 미리 그릴 때 빌드가 막히지 않게 Suspense 안에 둔다 */}
            <Suspense fallback={null}>
                <ThemeColorSync />
            </Suspense>
            <MotionConfig reducedMotion="user" skipAnimations={isReduced}>
                {children}
            </MotionConfig>
        </ThemeProvider>
    );
}
