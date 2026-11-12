import type { Variants } from 'framer-motion';

import { DURATION, EASE } from '@/style/tokens/motion';

/** 모바일 메뉴 패널. 위에서 내려오며 드러나고, 닫힐 때는 올라가며 사라진다 */
export const menuPanelVariants: Variants = {
    closed: { opacity: 0, y: -12, transition: { duration: DURATION.fast, ease: EASE.exit } },
    open: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.enter } },
};
