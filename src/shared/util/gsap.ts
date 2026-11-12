'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { EASE, type EaseToken, toGsapEasePath } from '@/style/tokens/motion';

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

// 모션 토큰의 가속도를 GSAP 이름으로 등록한다. 쓰는 쪽은 ease: 'enter' 처럼 토큰 이름을 적는다.
for (const token of Object.keys(EASE) as EaseToken[]) {
    CustomEase.create(token, toGsapEasePath(token));
}

export { gsap, ScrollTrigger, useGSAP };
