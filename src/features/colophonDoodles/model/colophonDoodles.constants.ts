import type { DoodleShape, DoodleTone } from '@/shared/ui/doodle/doodle.constants';

interface ColophonDoodle {
    shape: DoodleShape;
    tone: DoodleTone;
    /** 자리 · 크기 · 기울기 · 보이는 화면 폭 */
    position: string;
    /** 본문보다 뒤처지는 비율. 음수면 본문보다 빠르게 움직인다 */
    lag: number;
}

/**
 * 「제작 과정」 배경에 놓는 낙서의 자리.
 * 머리의 빈 곳은 위에서 px 로, 본문 옆 여백은 가운데에서 잰다.
 * 섹션 사이는 화면 폭마다 높이가 달라 페이지 높이의 % 로 잰다.
 * 소개 페이지처럼 적게 둔다. 글과 표가 많은 페이지라 배경이 조용해야 한다.
 */
export const COLOPHON_DOODLES = [
    // 머리 — 제목 오른쪽의 빈 곳
    {
        shape: 'crown',
        tone: 'yellow',
        position: 'top-28 left-[min(78%,calc(50%+380px))] w-14 rotate-12 max-md:hidden',
        lag: 0.2,
    },
    {
        shape: 'code',
        tone: 'quiet',
        position: 'top-56 left-[min(66%,calc(50%+230px))] w-12 -rotate-6 max-lg:hidden',
        lag: 0.1,
    },

    // 본문 옆 여백
    {
        shape: 'arrow',
        tone: 'sky',
        position: 'top-[18%] left-[calc(50%-770px)] w-18 rotate-6 max-2xl:hidden',
        lag: 0.2,
    },
    {
        shape: 'braces',
        tone: 'quiet',
        position: 'top-[44%] left-[calc(50%-765px)] w-20 -rotate-12 max-2xl:hidden',
        lag: -0.1,
    },
    {
        shape: 'drip',
        tone: 'violet',
        position: 'top-[72%] left-[calc(50%-760px)] w-18 rotate-3 max-2xl:hidden',
        lag: 0.14,
    },
    {
        shape: 'bolt',
        tone: 'yellow',
        position: 'top-[30%] right-[calc(50%-770px)] w-16 -rotate-12 max-2xl:hidden',
        lag: 0.16,
    },
    {
        shape: 'splatter',
        tone: 'sky',
        position: 'top-[56%] right-[calc(50%-765px)] w-16 max-2xl:hidden',
        lag: 0.12,
    },
    {
        shape: 'star',
        tone: 'violet',
        position: 'top-[82%] right-[calc(50%-770px)] w-18 rotate-12 max-2xl:hidden',
        lag: -0.08,
    },

    // 패널 뒤 — 반투명 패널 너머로 흐리게 비친다
    {
        shape: 'tag',
        tone: 'sky',
        position: 'top-[69%] left-[min(82%,calc(50%+470px))] w-24 -rotate-3',
        lag: 0.1,
    },
    {
        shape: 'ring',
        tone: 'violet',
        position: 'top-[79%] left-[min(64%,calc(50%+180px))] w-20 rotate-6',
        lag: 0.14,
    },
] as const satisfies readonly ColophonDoodle[];
