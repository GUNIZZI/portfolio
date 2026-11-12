'use client';

import { Children, type ReactNode } from 'react';

import { motion } from 'framer-motion';

import { projectGridItemVariants, projectGridVariants } from '../model/featuredProjects.motions';

interface OwnProps {
    children: ReactNode;
    className?: string;
}

/** 화면에 처음 들어올 때 카드를 아래에서 차례로 올리는 격자. 한 번만 실행한다 */
export default function ProjectGrid({ children, className }: OwnProps) {
    return (
        <motion.div
            variants={projectGridVariants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
            className={className}
        >
            {Children.map(children, (child) => (
                <motion.div variants={projectGridItemVariants} className="flex">
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}
