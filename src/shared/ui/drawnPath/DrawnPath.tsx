'use client';

import { motion, type Variants } from 'framer-motion';

import { DURATION, EASE } from '@/style/tokens/motion';

const drawnPathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    shown: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: DURATION.slow, ease: EASE.enter },
            // 길이가 0 인 선도 둥근 끝이 점으로 보인다. 그리기 시작할 때만 드러낸다
            opacity: { duration: DURATION.instant },
        },
    },
};

interface OwnProps {
    d: string;
    /** 선 색 클래스 — stroke-accent 처럼 준다 */
    className?: string;
    strokeWidth: number;
    strokeLinecap?: 'round' | 'butt' | 'square';
    strokeLinejoin?: 'round' | 'miter' | 'bevel';
    /**
     * 그리기 시작하는 계기.
     * inView 는 화면에 처음 들어올 때 한 번, parent 는 부모 motion 요소의 hidden → shown 을 따른다
     */
    trigger?: 'inView' | 'parent';
}

/** 손으로 긋듯 처음부터 끝까지 그려지는 SVG 선. `<svg>` 안에 둔다 */
export default function DrawnPath({ trigger = 'inView', ...rest }: OwnProps) {
    if (trigger === 'parent') {
        return <motion.path fill="none" variants={drawnPathVariants} {...rest} />;
    }

    return (
        <motion.path
            fill="none"
            variants={drawnPathVariants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true }}
            {...rest}
        />
    );
}
