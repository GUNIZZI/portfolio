'use client';

import { type ReactNode, useEffect, useMemo } from 'react';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

import { SPRING } from '@/style/tokens/motion';

import { HeroPointerContext } from '../model/hero.contexts';
import { useHeroIntro } from '../model/useHeroIntro';

interface OwnProps {
    children: ReactNode;
    className?: string;
}

/**
 * 히어로의 바깥 틀.
 * 등장 연출의 hidden → shown 을 안쪽 motion 요소에 내려 주고, 포인터 위치를 낙서에 알려 준다.
 * 포인터는 히어로 위가 아니라 브라우저 창 전체에서 따라간다.
 */
export default function HeroIntro({ children, className }: OwnProps) {
    const initial = useHeroIntro();
    const isReduced = useReducedMotion();

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING.follow);
    const y = useSpring(rawY, SPRING.follow);
    const pointer = useMemo(() => ({ x, y }), [x, y]);

    useEffect(() => {
        // 동작 줄이기에서는 움직이지 않는다
        if (isReduced) return;

        function hndlPointerMove(event: PointerEvent) {
            // 터치에는 따라갈 포인터가 없다
            if (event.pointerType !== 'mouse') return;
            rawX.set((event.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((event.clientY / window.innerHeight - 0.5) * 2);
        }
        /** 포인터가 창 밖으로 나가면 제자리로 돌린다 */
        function hndlPointerLeave() {
            rawX.set(0);
            rawY.set(0);
        }

        const root = document.documentElement;
        window.addEventListener('pointermove', hndlPointerMove);
        root.addEventListener('pointerleave', hndlPointerLeave);

        return () => {
            window.removeEventListener('pointermove', hndlPointerMove);
            root.removeEventListener('pointerleave', hndlPointerLeave);
        };
    }, [isReduced, rawX, rawY]);

    return (
        <motion.section initial={initial} animate="shown" className={className}>
            <HeroPointerContext value={pointer}>{children}</HeroPointerContext>
        </motion.section>
    );
}
