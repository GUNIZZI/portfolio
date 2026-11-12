'use client';

import { type ReactNode, use } from 'react';

import { motion, useTransform } from 'framer-motion';

import { HERO_PARALLAX_PX } from '../model/hero.constants';
import { HeroPointerContext } from '../model/hero.contexts';
import { heroBubbleVariants } from '../model/hero.motions';

interface OwnProps {
    children: ReactNode;
    /** 포인터에 밀리는 정도. 클수록 앞에 있는 것처럼 많이 움직인다 */
    depth: number;
    /** 등장 연출에서 튀어나오는가. 말풍선에만 쓴다 */
    isPop?: boolean;
    className?: string;
}

/** 포인터 반대쪽으로 살짝 밀리는 낙서. 위치는 className 으로 준다 */
export default function HeroDoodle({ children, depth, isPop = false, className }: OwnProps) {
    const pointer = use(HeroPointerContext);
    const x = useTransform(pointer.x, (value) => -value * depth * HERO_PARALLAX_PX);
    const y = useTransform(pointer.y, (value) => -value * depth * HERO_PARALLAX_PX);

    return (
        <motion.div
            aria-hidden="true"
            variants={isPop ? heroBubbleVariants : undefined}
            style={{ x, y }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
