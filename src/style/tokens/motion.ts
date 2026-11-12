/**
 * 모션 토큰 — JS 쪽 (framer-motion · GSAP).
 * CSS 쪽은 같은 폴더의 motion.css 다. 값은 __test__/motion.test.ts 가 맞춰 본다.
 * 규칙 전문은 docs/motion.md 가 갖는다.
 */

/** 지속시간(초). framer-motion 과 GSAP 모두 초 단위를 쓴다. */
export const DURATION = {
    instant: 0.1,
    fast: 0.2,
    base: 0.4,
    slow: 0.8,
    slower: 1.2,
} as const;

/** 가속도. cubic-bezier 네 값이다. */
export const EASE = {
    enter: [0.22, 1, 0.36, 1],
    exit: [0.64, 0, 0.78, 0],
    move: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/** 여러 요소를 차례로 움직일 때의 간격(초). */
export const STAGGER = {
    tight: 0.03,
    base: 0.06,
    loose: 0.12,
} as const;

/**
 * 포인터를 따라가는 값의 스프링. 끝나는 시간이 정해지지 않은 움직임에 쓴다.
 * framer-motion 의 useSpring 설정 그대로다.
 */
export const SPRING = {
    follow: { stiffness: 180, damping: 24, mass: 0.6 },
} as const;

export type DurationToken = keyof typeof DURATION;
export type EaseToken = keyof typeof EASE;
export type StaggerToken = keyof typeof STAGGER;

/** GSAP CustomEase 에 넘길 SVG path. 이름은 EASE 의 키와 같다. */
export function toGsapEasePath(token: EaseToken): string {
    const [x1, y1, x2, y2] = EASE[token];
    return `M0,0 C${x1},${y1} ${x2},${y2} 1,1`;
}
