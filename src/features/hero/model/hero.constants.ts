/** 히어로의 기술 태그. tone 은 앞에 붙는 + 기호의 색이다 */
export const HERO_TAGS = [
    { label: 'Next.js', tone: 'accent' },
    { label: 'React', tone: 'brand' },
    { label: 'TypeScript', tone: 'info' },
    { label: 'Zustand', tone: 'neutral' },
] as const;

export type HeroTagTone = (typeof HERO_TAGS)[number]['tone'];

export const HERO_TAG_TONE_CLASS = {
    accent: 'text-accent',
    brand: 'text-brand-soft',
    info: 'text-info',
    neutral: 'text-foreground',
} as const satisfies Record<HeroTagTone, string>;

/** 포인터가 히어로 끝에 닿았을 때 깊이 1 인 낙서가 밀리는 거리(px) */
export const HERO_PARALLAX_PX = 14;
