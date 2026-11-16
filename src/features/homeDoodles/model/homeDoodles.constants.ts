import type { DoodleShape, DoodleTone } from '@/shared/ui/doodle/doodle.constants';

interface HomeDoodle {
    shape: DoodleShape;
    tone: DoodleTone;
    /** 자리 · 크기 · 기울기 · 보이는 화면 폭 */
    position: string;
    /** 본문보다 뒤처지는 비율. 음수면 본문보다 빠르게 움직인다 */
    lag: number;
}

/**
 * 홈 배경에 놓는 낙서의 자리. 홈의 섹션 배치에 맞춰 네 구역으로 나눈다.
 * - 히어로와 연락: 패널이 없어 본문 사이의 빈 곳에 놓는다. 히어로는 위에서, 연락은 아래에서 잰다.
 *   가로는 max(%, calc(50% ± px)) 로 적는다. 본문 폭보다 좁은 화면에서는 % 로, 넓은 화면에서는
 *   가운데에서 잰 px 로 정해져서 본문 안의 같은 자리에 놓인다.
 * - 본문 옆 여백: 화면이 본문 폭(1240px)보다 넓을 때만 생긴다. 가운데에서 잰다.
 * - 패널 가장자리: 패널 밑에 반쯤 들어가 가장자리로 삐져나온다.
 * - 패널 뒤: 패널이 반투명이라 흐리게 비친다. 흐려지고 어두워지므로 색을 쓰고 크게 그린다.
 * 앞의 세 구역은 좁은 화면에 빈 곳이 없어 md 이상에서만 그린다. 패널 뒤는 모든 폭에서 그린다.
 * 좁은 화면에서는 오른쪽 낙서를 안으로 당기고 줄여, 패널 밖으로 조각만 삐져나오지 않게 한다.
 */
export const HOME_DOODLES = [
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
] as const satisfies readonly HomeDoodle[];
