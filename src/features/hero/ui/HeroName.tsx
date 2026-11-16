'use client';

import { motion } from 'framer-motion';

import { heroNameMaskVariants, heroNameTextVariants } from '../model/hero.motions';

interface OwnProps {
    children: string;
}

/**
 * 마커로 칠하듯 왼쪽부터 드러나는 이름. `<h1>` 안에 둔다.
 *
 * 마커 글꼴은 획이 글자 칸 밖으로 삐져나온다. 가리는 창(overflow-hidden)을 글자 칸에 딱 맞추면
 * 위쪽과 오른쪽 끝이 잘린다. 안쪽에 여백을 주어 창을 넓히고, 바깥쪽 음수 여백으로 자리를 되돌린다.
 * 여백은 글자 크기에 맞춰 em 으로 준다. 창과 글자의 폭이 같아야 서로 반대로 움직여도 글자가 제자리에 있다
 */
export default function HeroName({ children }: OwnProps) {
    return (
        <motion.span
            variants={heroNameMaskVariants}
            className="-mx-[0.2em] -mt-[0.12em] -mb-[0.08em] inline-block overflow-hidden align-top"
        >
            <motion.span
                variants={heroNameTextVariants}
                className="inline-block px-[0.2em] pt-[0.12em] pb-[0.08em]"
            >
                {children}
            </motion.span>
        </motion.span>
    );
}
