'use client';

import type { ReactNode } from 'react';

import { MotionConfig } from 'framer-motion';

interface OwnProps {
    children: ReactNode;
}

/**
 * 앱 전역 Provider.
 * reducedMotion="user" — OS 의 동작 줄이기 설정을 framer-motion 전체에 적용한다 (docs/motion.md).
 */
export default function Providers({ children }: OwnProps) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
