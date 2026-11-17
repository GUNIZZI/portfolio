import type { DoodleShape, DoodleTone } from '@/shared/ui/doodle/doodle.constants';

interface WorkDoodle {
    shape: DoodleShape;
    tone: DoodleTone;
    /** 자리 · 크기 · 기울기 · 보이는 화면 폭 */
    position: string;
    /** 본문보다 뒤처지는 비율. 음수면 본문보다 빠르게 움직인다 */
    lag: number;
}

/**
 * 작업 목록과 상세의 배경에 놓는 낙서의 자리. 두 페이지가 함께 쓴다.
 * 카드와 본문이 화면을 채우는 페이지라 본문 옆 여백과 패널 뒤에만 둔다.
 * 작업의 수나 본문 길이에 따라 높이가 달라져, 세로는 페이지 높이의 % 로 잰다.
 */
export const WORK_DOODLES = [
    // 본문 옆 여백
    {
        shape: 'code',
        tone: 'quiet',
        position: 'top-[30%] left-[calc(50%-770px)] w-20 rotate-12 max-2xl:hidden',
        lag: 0.22,
    },
    {
        shape: 'bolt',
        tone: 'yellow',
        position: 'top-[62%] left-[calc(50%-745px)] w-10 -rotate-12 max-2xl:hidden',
        lag: -0.1,
    },
    {
        shape: 'braces',
        tone: 'quiet',
        position: 'top-[38%] right-[calc(50%-785px)] w-20 rotate-6 max-2xl:hidden',
        lag: 0.18,
    },
    {
        shape: 'splatter',
        tone: 'violet',
        position: 'top-[70%] right-[calc(50%-760px)] w-16 max-2xl:hidden',
        lag: 0.12,
    },

    // 패널 뒤 — 상세의 본문 패널 너머로 흐리게 비친다
    {
        shape: 'tag',
        tone: 'sky',
        position: 'top-[48%] left-[max(10%,calc(50%-496px))] w-28 -rotate-3',
        lag: 0.1,
    },
    {
        shape: 'drip',
        tone: 'violet',
        position: 'top-[76%] left-[min(60%,calc(50%+124px))] w-20 rotate-6',
        lag: 0.14,
    },
] as const satisfies readonly WorkDoodle[];
