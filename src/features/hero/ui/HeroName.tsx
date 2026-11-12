'use client';

import { motion } from 'framer-motion';

import { heroNameMaskVariants, heroNameTextVariants } from '../model/hero.motions';

interface OwnProps {
    children: string;
}

/** 마커로 칠하듯 왼쪽부터 드러나는 이름. `<h1>` 안에 둔다 */
export default function HeroName({ children }: OwnProps) {
    return (
        <motion.span
            variants={heroNameMaskVariants}
            className="inline-block overflow-hidden align-top"
        >
            <motion.span variants={heroNameTextVariants} className="inline-block">
                {children}
            </motion.span>
        </motion.span>
    );
}
