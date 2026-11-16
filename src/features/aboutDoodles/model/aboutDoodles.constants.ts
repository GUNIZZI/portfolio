import type { DoodleShape, DoodleTone } from '@/shared/ui/doodle/doodle.constants';

interface AboutDoodle {
    shape: DoodleShape;
    tone: DoodleTone;
    /** 자리 · 크기 · 기울기 · 보이는 화면 폭 */
    position: string;
    /** 본문보다 뒤처지는 비율. 음수면 본문보다 빠르게 움직인다 */
    lag: number;
}

/**
 * 소개 배경에 놓는 낙서의 자리.
 * 인트로의 빈 곳은 위에서 px 로, 본문 옆 여백은 가운데에서 잰다.
 * 패널 뒤와 섹션 사이는 화면 폭마다 높이가 달라 페이지 높이의 % 로 잰다.
 * 홈보다 적게 둔다. 글이 많은 페이지라 배경이 조용해야 한다.
 */
export const ABOUT_DOODLES = [
    // 인트로 — 글과 캐릭터 사이
    {
        shape: 'star',
        tone: 'yellow',
        position: 'top-30 left-[max(47%,calc(50%-37px))] w-8 rotate-12 max-md:hidden',
        lag: 0.2,
    },
    {
        shape: 'braces',
        tone: 'quiet',
        position: 'top-96 left-[max(48%,calc(50%-25px))] w-14 -rotate-6 max-md:hidden',
        lag: 0.1,
    },

    // 본문 옆 여백
    {
        shape: 'code',
        tone: 'quiet',
        position: 'top-[28%] left-[calc(50%-770px)] w-20 rotate-12 max-2xl:hidden',
        lag: 0.22,
    },
    {
        shape: 'drip',
        tone: 'violet',
        position: 'top-[52%] left-[calc(50%-760px)] w-18 -rotate-6 max-2xl:hidden',
        lag: -0.1,
    },
    {
        shape: 'crown',
        tone: 'quiet',
        position: 'top-[36%] right-[calc(50%-775px)] w-20 -rotate-12 max-2xl:hidden',
        lag: 0.18,
    },
    {
        shape: 'splatter',
        tone: 'sky',
        position: 'top-[66%] right-[calc(50%-760px)] w-16 max-2xl:hidden',
        lag: 0.12,
    },

    // 패널 뒤 — 반투명 패널 너머로 흐리게 비친다
    {
        shape: 'tag',
        tone: 'sky',
        position: 'top-[22%] left-[min(62%,calc(50%+149px))] w-28 -rotate-3',
        lag: 0.1,
    },
    {
        shape: 'star',
        tone: 'violet',
        position: 'top-[40%] left-[max(4%,calc(50%-570px))] w-20 rotate-12',
        lag: 0.14,
    },
    {
        shape: 'bolt',
        tone: 'yellow',
        position: 'top-[72%] left-[min(70%,calc(50%+248px))] w-16 rotate-6',
        lag: 0.16,
    },
    {
        shape: 'ring',
        tone: 'violet',
        position: 'top-[78%] left-[max(8%,calc(50%-521px))] w-24',
        lag: 0.08,
    },
] as const satisfies readonly AboutDoodle[];
