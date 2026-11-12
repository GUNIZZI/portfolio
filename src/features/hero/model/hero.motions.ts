import type { Variants } from 'framer-motion';

import { DURATION, EASE, SPRING } from '@/style/tokens/motion';

/**
 * 히어로 등장 연출. 낙서(DrawnPath) → 이름 → 말풍선 순서로 잇는다.
 * 순서는 delay 로 정한다. 이름은 낙서가 반쯤 그려졌을 때, 말풍선은 이름이 거의 드러났을 때 시작한다.
 */
const nameReveal = { duration: DURATION.slower, ease: EASE.enter, delay: DURATION.base };

/** 이름을 가리는 창. 왼쪽 밖에서 제자리로 들어온다 */
export const heroNameMaskVariants: Variants = {
    hidden: { x: '-100%' },
    shown: { x: '0%', transition: nameReveal },
};

/** 창 안의 글자. 창과 반대로 움직여 글자는 제자리에 있고 왼쪽부터 드러난다 */
export const heroNameTextVariants: Variants = {
    hidden: { x: '100%' },
    shown: { x: '0%', transition: nameReveal },
};

export const heroBubbleVariants: Variants = {
    hidden: { scale: 0 },
    shown: {
        scale: 1,
        transition: { type: 'spring', ...SPRING.follow, delay: DURATION.slow + DURATION.base },
    },
};
