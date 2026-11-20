import type { DoodleShape } from '@/shared/ui/doodle/doodle.constants';

export interface StatusDoodle {
    shape: DoodleShape;
    /** 선 색 클래스 */
    stroke: string;
    /** 자리 · 크기 · 기울기. 캐릭터 그림의 칸을 기준으로 한 백분율이다 */
    position: string;
}

/**
 * 404 화면의 캐릭터 둘레에 놓는 낙서. 자리는 404 시안(2026-11-20 사용자가 준 그림)을 따랐다.
 * 백분율이라 그림이 커지고 작아져도 함께 따라간다.
 * 별과 번개는 notfound.png 에 그려진 「404」 와 소용돌이를 가리지 않게 옮겼다.
 */
export const NOT_FOUND_DOODLES = [
    { shape: 'star', stroke: 'stroke-doodle-yellow', position: 'top-0 left-[6%] w-[7%] rotate-12' },
    { shape: 'bolt', stroke: 'stroke-doodle-yellow', position: 'top-[2%] left-[78%] w-[8%]' },
    {
        shape: 'code',
        stroke: 'stroke-doodle-violet',
        position: 'top-[16%] left-[91%] w-[9%] -rotate-12',
    },
    {
        shape: 'braces',
        stroke: 'stroke-doodle-indigo',
        position: 'top-[70%] left-0 w-[8%] -rotate-12',
    },
    { shape: 'tag', stroke: 'stroke-doodle-violet', position: 'top-[88%] left-[3%] w-[11%]' },
] as const satisfies readonly StatusDoodle[];

/**
 * 에러 화면의 캐릭터 둘레에 놓는 낙서. 시안이 없어 404 와 같은 모양을 쓴다.
 * error.png 는 아래쪽을 몸이 다 채워, 머리 양옆의 빈 곳에만 둔다. 그림 속 물음표와 경고 표시는 가리지 않는다.
 */
export const ERROR_DOODLES = [
    { shape: 'bolt', stroke: 'stroke-doodle-yellow', position: 'top-[3%] left-[8%] w-[9%]' },
    {
        shape: 'spiral',
        stroke: 'stroke-doodle-indigo',
        position: 'top-[24%] left-0 w-[9%] -rotate-12',
    },
    {
        shape: 'cross',
        stroke: 'stroke-doodle-violet',
        position: 'top-[2%] left-[91%] w-[7%] rotate-12',
    },
    {
        shape: 'braces',
        stroke: 'stroke-doodle-indigo',
        position: 'top-[24%] left-[92%] w-[8%] rotate-12',
    },
] as const satisfies readonly StatusDoodle[];
