/**
 * 배경 장식의 모양과 자리.
 * lag 는 본문보다 뒤처지는 비율이다. 0.5 면 본문의 절반 속도로, 음수면 본문보다 빠르게 움직인다.
 * 장식마다 달라서 서로 다른 깊이에 있는 것처럼 보인다.
 */

/** 가장자리 붓 자국. 위치와 모양은 원본 디자인(sample/)의 값 그대로다 */
export const BRUSHES = [
    {
        position: 'top-10 left-0 h-130 w-[clamp(24px,4vw,56px)]',
        viewBox: '0 0 60 400',
        d: 'M0 0 C 30 40, 50 90, 26 150 C 10 190, 40 240, 30 300 C 24 340, 12 370, 0 400 Z',
        fill: 'fill-brush-sky',
        lag: 0.75,
    },
    {
        position: 'top-0 right-0 h-90 w-[clamp(24px,4vw,56px)]',
        viewBox: '0 0 60 400',
        d: 'M60 0 C 30 30, 20 80, 40 130 C 54 170, 22 220, 34 280 C 40 320, 50 360, 60 400 Z',
        fill: 'fill-brush-violet',
        lag: 0.8,
    },
    {
        position: 'top-452.5 left-0 h-75 w-[clamp(20px,3vw,44px)]',
        viewBox: '0 0 60 300',
        d: 'M0 0 C 28 50, 36 120, 18 180 C 8 220, 20 260, 0 300 Z',
        fill: 'fill-brush-sky',
        lag: 0.85,
    },
    {
        position: 'right-0 bottom-50 h-65 w-[clamp(20px,3vw,44px)]',
        viewBox: '0 0 60 300',
        d: 'M60 0 C 34 60, 28 120, 44 180 C 52 220, 40 260, 60 300 Z',
        fill: 'fill-brush-violet',
        lag: 0.7,
    },
] as const;

/**
 * 붓과 스프레이로 그린 거리 낙서의 모양. 48×48 칸에 그린다.
 * d 는 굵은 붓 획이고, drips 는 물감이 흘러내린 자국, dots 는 튄 방울([cx, cy, r])이다.
 * 붓의 거친 가장자리와 마른 붓 자국은 Backdrop 의 SVG 필터가 입힌다.
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

interface Doodle {
    shape: DoodleShape;
    tone: DoodleTone;
    /** 자리 · 크기 · 기울기 · 보이는 화면 폭 */
    position: string;
    lag: number;
}

/**
 * 낙서의 자리. 네 구역으로 나눈다.
 * - 히어로와 연락: 패널이 없어 본문 사이의 빈 곳에 놓는다. 히어로는 위에서, 연락은 아래에서 잰다.
 *   가로는 max(%, calc(50% ± px)) 로 적는다. 본문 폭보다 좁은 화면에서는 % 로, 넓은 화면에서는
 *   가운데에서 잰 px 로 정해져서 본문 안의 같은 자리에 놓인다.
 * - 본문 옆 여백: 화면이 본문 폭(1240px)보다 넓을 때만 생긴다. 가운데에서 잰다.
 * - 패널 가장자리: 패널 밑에 반쯤 들어가 가장자리로 삐져나온다.
 * - 패널 뒤: 패널이 반투명이라 흐리게 비친다. 흐려지고 어두워지므로 색을 쓰고 크게 그린다.
 * 앞의 세 구역은 좁은 화면에 빈 곳이 없어 md 이상에서만 그린다. 패널 뒤는 모든 폭에서 그린다.
 * 좁은 화면에서는 오른쪽 낙서를 안으로 당기고 줄여, 패널 밖으로 조각만 삐져나오지 않게 한다.
 */
export const DOODLES = [
    // 히어로 — 글과 캐릭터 사이, 캐릭터 위
    {
        shape: 'star',
        tone: 'yellow',
        position: 'top-28 left-[max(45%,calc(50%-62px))] w-9 rotate-12 max-md:hidden',
        lag: 0.22,
    },
    {
        shape: 'braces',
        tone: 'quiet',
        position: 'top-76 left-[max(46%,calc(50%-50px))] w-16 -rotate-6 max-md:hidden',
        lag: 0.12,
    },
    {
        shape: 'ring',
        tone: 'quiet',
        position: 'top-22 left-[min(86%,calc(50%+446px))] w-20 max-md:hidden',
        lag: 0.16,
    },
    {
        shape: 'cross',
        tone: 'sky',
        position: 'top-136 left-[max(44%,calc(50%-74px))] w-7 rotate-12 max-md:hidden',
        lag: 0.3,
    },
    {
        shape: 'arrow',
        tone: 'quiet',
        position: 'top-148 left-[max(15%,calc(50%-434px))] w-12 max-md:hidden',
        lag: 0.1,
    },
    {
        shape: 'tag',
        tone: 'violet',
        position: 'top-158 left-[max(33%,calc(50%-211px))] w-18 -rotate-3 max-md:hidden',
        lag: -0.12,
    },

    // 본문 왼쪽 여백
    {
        shape: 'code',
        tone: 'quiet',
        position: 'top-105 left-[calc(50%-770px)] w-20 rotate-12 max-2xl:hidden',
        lag: 0.25,
    },
    {
        shape: 'drip',
        tone: 'violet',
        position: 'top-220 left-[calc(50%-760px)] w-20 -rotate-6 max-2xl:hidden',
        lag: -0.1,
    },
    {
        shape: 'spiral',
        tone: 'quiet',
        position: 'top-340 left-[calc(50%-790px)] w-24 max-2xl:hidden',
        lag: 0.18,
    },
    {
        shape: 'bang',
        tone: 'yellow',
        position: 'top-455 left-[calc(50%-740px)] w-12 rotate-12 max-2xl:hidden',
        lag: 0.32,
    },

    // 본문 오른쪽 여백
    {
        shape: 'crown',
        tone: 'quiet',
        position: 'top-125 right-[calc(50%-775px)] w-20 -rotate-12 max-2xl:hidden',
        lag: 0.2,
    },
    {
        shape: 'star',
        tone: 'sky',
        position: 'top-255 right-[calc(50%-745px)] w-14 rotate-6 max-2xl:hidden',
        lag: -0.14,
    },
    {
        shape: 'braces',
        tone: 'quiet',
        position: 'top-370 right-[calc(50%-785px)] w-20 rotate-6 max-2xl:hidden',
        lag: 0.28,
    },
    {
        shape: 'splatter',
        tone: 'violet',
        position: 'top-475 right-[calc(50%-760px)] w-16 max-2xl:hidden',
        lag: 0.15,
    },

    // 패널 가장자리 — 소개 패널 아래로 삐져나온다
    {
        shape: 'cross',
        tone: 'quiet',
        position: 'bottom-108 left-[max(8%,calc(50%-521px))] w-12 rotate-12 max-md:hidden',
        lag: 0.1,
    },

    // 패널 뒤 — 반투명 패널 너머로 흐리게 비친다. 화면 폭마다 패널 높이가 달라 세로는 페이지 높이의 % 로 잰다
    {
        shape: 'crown',
        tone: 'sky',
        position: 'top-[29%] left-[min(58%,calc(50%+99px))] w-24 -rotate-6',
        lag: 0.1,
    },
    {
        shape: 'drip',
        tone: 'yellow',
        position: 'top-[36%] left-[max(3%,calc(50%-583px))] w-20 rotate-6',
        lag: 0.16,
    },
    {
        shape: 'splatter',
        tone: 'violet',
        position:
            'max-md:left-[58%] md:left-[min(88%,calc(50%+471px))] top-[41%] max-md:w-16 md:w-24',
        lag: 0.08,
    },
    {
        shape: 'tag',
        tone: 'sky',
        position: 'top-[47%] left-[max(38%,calc(50%-149px))] w-28 -rotate-3',
        lag: 0.14,
    },
    {
        shape: 'bolt',
        tone: 'yellow',
        position: 'top-[51%] left-[min(70%,calc(50%+248px))] w-16 rotate-12',
        lag: 0.2,
    },
    {
        shape: 'ring',
        tone: 'violet',
        position:
            'max-md:left-[58%] md:left-[min(82%,calc(50%+397px))] top-[57%] max-md:w-16 md:w-24',
        lag: 0.06,
    },
    {
        shape: 'star',
        tone: 'yellow',
        position: 'top-[59%] left-[min(56%,calc(50%+74px))] w-16 -rotate-12',
        lag: 0.18,
    },
    {
        shape: 'drip',
        tone: 'violet',
        position:
            'max-md:left-[58%] md:left-[min(90%,calc(50%+496px))] top-[67%] max-md:w-16 md:w-20 -rotate-6',
        lag: 0.12,
    },
    {
        shape: 'cross',
        tone: 'sky',
        position: 'top-[77%] left-[min(60%,calc(50%+124px))] w-14 rotate-12',
        lag: 0.1,
    },

    // 연락 — 제목과 글 사이, 글과 손글씨 사이
    {
        shape: 'bolt',
        tone: 'yellow',
        position: 'bottom-94 left-[max(27%,calc(50%-285px))] w-8 -rotate-12 max-md:hidden',
        lag: 0.26,
    },
    {
        shape: 'ring',
        tone: 'quiet',
        position: 'bottom-60 left-[min(60%,calc(50%+124px))] w-22 max-md:hidden',
        lag: 0.14,
    },
    {
        shape: 'splatter',
        tone: 'violet',
        position: 'bottom-48 left-[min(72%,calc(50%+273px))] w-9 max-md:hidden',
        lag: -0.1,
    },
    {
        shape: 'drip',
        tone: 'sky',
        position: 'bottom-38 left-[max(38%,calc(50%-149px))] w-16 rotate-3 max-md:hidden',
        lag: 0.2,
    },
] as const satisfies readonly Doodle[];
