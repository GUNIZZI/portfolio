/** 낙서에 붓 질감을 입히는 SVG 필터의 id. DoodleFilter 가 정의하고 Doodle 이 가리킨다 */
export const DOODLE_FILTER_ID = 'doodle-brush';

/**
 * 붓과 스프레이로 그린 거리 낙서의 모양. 48×48 칸에 그린다.
 * d 는 굵은 붓 획이고, drips 는 물감이 흘러내린 자국, dots 는 튄 방울([cx, cy, r])이다.
 * 붓의 거친 가장자리와 마른 붓 자국은 DoodleFilter 의 SVG 필터가 입힌다.
 */
export const DOODLE_SHAPES = {
    /** 스프레이로 그린 왕관. 아래로 물감이 흐른다 */
    crown: {
        d: 'M7 34 L5 13 L15 25 L24 7 L33 25 L43 13 L41 34 Z',
        drips: 'M13 34 V43 M29 34 V47 M37 34 V40',
    },
    star: { d: 'M24 5 L29 19 L44 20 L32 29 L37 44 L24 35 L11 44 L16 29 L4 20 L19 19 Z' },
    bolt: { d: 'M30 4 L12 26 L25 26 L17 45' },
    cross: { d: 'M9 9 L39 39 M39 9 L9 39' },
    arrow: { d: 'M8 8 C6 24 14 36 34 38 M25 29 L35 38 L24 45' },
    /** 붓을 한 번 그은 자국. 물감이 세 줄기 흐른다 */
    drip: {
        d: 'M4 13 C16 8 32 8 44 13',
        drips: 'M13 12 V29 M25 10 V41 M36 12 V23',
        dots: [[25, 45, 1.6]],
    },
    /** 스프레이가 튄 자국 */
    splatter: {
        d: 'M20 24 C19 19 27 17 29 22 C31 27 23 30 20 24 Z',
        dots: [
            [9, 12, 2.4],
            [38, 9, 1.8],
            [42, 27, 2.8],
            [33, 40, 2],
            [12, 37, 3],
            [5, 25, 1.4],
            [24, 6, 1.4],
            [22, 43, 1.2],
        ],
    },
    /** 이름을 휘갈겨 쓴 태그 */
    tag: { d: 'M3 30 C8 8 14 44 20 24 S30 6 36 28 S44 40 46 18' },
    spiral: {
        d: 'M26 24 C26 21 22 20 21 24 C20 29 27 31 30 26 C33 19 24 13 17 18 C9 24 14 38 26 37 C36 36 42 26 38 16',
    },
    /** 스프레이로 돌려 그린 원. 끝이 겹친다 */
    ring: {
        d: 'M24 6 C36 5 43 14 42 25 C41 37 31 43 21 41 C10 39 4 29 7 18 C10 9 19 5 28 7',
        drips: 'M22 41 V47',
    },
    bang: {
        d: 'M17 6 L18 29 M31 5 L30 28',
        dots: [
            [18, 40, 3],
            [30, 39, 3],
        ],
    },
    code: { d: 'M16 12 L4 24 L16 36 M32 12 L44 24 L32 36 M28 8 L20 40' },
    braces: {
        d: 'M18 6 C12 6 12 10 12 14 V20 C12 23 10 24 7 24 C10 24 12 25 12 28 V34 C12 38 12 42 18 42 M30 6 C36 6 36 10 36 14 V20 C36 23 38 24 41 24 C38 24 36 25 36 28 V34 C36 38 36 42 30 42',
    },
} as const satisfies Record<
    string,
    { d: string; drips?: string; dots?: readonly (readonly [number, number, number])[] }
>;

export type DoodleShape = keyof typeof DOODLE_SHAPES;

/**
 * 낙서의 색. 획은 stroke, 방울은 fill 로 칠한다.
 * quiet 는 벽에 오래 남아 바랜 낙서처럼 바탕에 묻힌다. 글 가까이와 넓은 면적에 쓴다.
 * 나머지는 방금 뿌린 물감이다. 본문과 떨어진 자리에 쓴다.
 */
export const DOODLE_TONE_CLASS = {
    quiet: { stroke: 'stroke-divider', fill: 'fill-divider' },
    sky: { stroke: 'stroke-doodle-sky', fill: 'fill-doodle-sky' },
    violet: { stroke: 'stroke-doodle-violet', fill: 'fill-doodle-violet' },
    yellow: { stroke: 'stroke-doodle-yellow', fill: 'fill-doodle-yellow' },
} as const;

export type DoodleTone = keyof typeof DOODLE_TONE_CLASS;
