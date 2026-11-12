import type { Variants } from 'framer-motion';

import { DURATION, EASE, STAGGER } from '@/style/tokens/motion';

/** 카드 묶음. 안쪽 카드를 차례로 시작시킨다 */
export const projectGridVariants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: STAGGER.base } },
};

/** 카드 하나. 아래에서 올라오며 드러난다 */
export const projectGridItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    shown: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.enter } },
};
