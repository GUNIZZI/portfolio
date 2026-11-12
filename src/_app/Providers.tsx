'use client';

import type { ReactNode } from 'react';

import { MotionConfig, useReducedMotion } from 'framer-motion';

interface OwnProps {
    children: ReactNode;
}

/**
 * 앱 전역 Provider.
 * OS 의 동작 줄이기 설정을 framer-motion 전체에 적용한다 (docs/motion.md 3절).
 * reducedMotion="user" 는 transform 만 멈춘다. 선 그리기(pathLength)와 opacity 는 계속 움직이므로
 * skipAnimations 로 모든 값을 최종 상태로 바로 그린다.
 */
export default function Providers({ children }: OwnProps) {
    const isReduced = useReducedMotion() ?? false;

    return (
        <MotionConfig reducedMotion="user" skipAnimations={isReduced}>
            {children}
        </MotionConfig>
    );
}
