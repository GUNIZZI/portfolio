'use client';

import { createContext } from 'react';

import { type MotionValue, motionValue } from 'framer-motion';

export interface HeroPointer {
    /** 히어로 가운데에서 본 포인터 위치. 왼쪽 끝 -1, 오른쪽 끝 1 */
    x: MotionValue<number>;
    /** 위쪽 끝 -1, 아래쪽 끝 1 */
    y: MotionValue<number>;
}

/** 히어로 위의 포인터 위치. HeroIntro 가 넣고 HeroDoodle 이 읽는다 */
export const HeroPointerContext = createContext<HeroPointer>({
    x: motionValue(0),
    y: motionValue(0),
});
