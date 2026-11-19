import type { Variants } from 'framer-motion';

import { DURATION, EASE } from '@/style/tokens/motion';

/**
 * 반투명 바탕. 헤더 막대와 모바일 메뉴 패널이 같은 값으로 드러나고 사라진다.
 * 둘의 값이 다르면 한 면으로 보이지 않고 따로 움직인다
 */
export const glassVariants: Variants = {
    hidden: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.exit } },
    shown: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE.enter } },
};

/** 모바일 메뉴 패널의 내용. 바탕이 드러나는 동안 위에서 내려오고, 닫힐 때는 올라간다 */
export const menuContentVariants: Variants = {
    hidden: { y: -12, transition: { duration: DURATION.fast, ease: EASE.exit } },
    shown: { y: 0, transition: { duration: DURATION.fast, ease: EASE.enter } },
};
