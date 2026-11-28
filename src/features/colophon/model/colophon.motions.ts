import type { Variants } from 'framer-motion';

import { DURATION, EASE, STAGGER } from '@/style/tokens/motion';

/** 과정 그림. 안쪽 단계를 왼쪽부터 차례로 시작시킨다 */
export const processStepsVariants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: STAGGER.loose } },
};

/** 과정 그림의 단계 하나. 아래에서 올라오며 드러난다 */
export const processStepVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.enter } },
};

/** 구조 그림. 안쪽 화살표를 위에서 아래로 차례로 그린다. 선 하나의 값은 DrawnPath 가 갖는다 */
export const layerDiagramVariants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: STAGGER.loose } },
};
