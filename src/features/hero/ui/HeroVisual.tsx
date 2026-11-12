import Image from 'next/image';

import { cn } from '@/shared/util/cn';

/**
 * 캐릭터 일러스트와 그 둘레의 낙서.
 * 낙서의 위치는 원본 디자인(sample/)의 백분율 값 그대로다. 그림이 커지고 작아져도 함께 따라간다.
 */
export default function HeroVisual() {
    return (
        <div className="flex min-w-0 flex-[1_1_380px] justify-center">
            <div className="relative aspect-[1108/982] w-full max-w-145">
                <svg
                    viewBox="0 0 100 89"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="absolute inset-0 z-base size-full overflow-visible"
                >
                    <path
                        d="M92 30 C 98 40, 104 52, 99 66 C 96 74, 101 82, 106 89 L 84 89 C 88 78, 86 66, 90 54 C 93 44, 90 36, 92 30 Z"
                        className="fill-brush-sky"
                    />
                    <path
                        d="M96 4 C 101 8, 104 14, 103 20 L 94 26 C 96 18, 94 10, 96 4 Z"
                        className="fill-doodle-violet"
                    />
                    <path
                        d="M6 70 C 2 76, 4 84, 0 89 L 10 89 C 9 82, 11 76, 6 70 Z"
                        className="fill-brush-sky"
                    />
                    <path
                        d="M14 56 l3 -6 m-1 8 l5 -3"
                        className="stroke-doodle-sky"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>

                <Image
                    src="/images/characters/hero.png"
                    alt="노트북 앞에 앉아 턱을 괸 안경 쓴 개발자 캐릭터 일러스트"
                    fill
                    sizes="(max-width: 860px) 100vw, 580px"
                    loading="eager"
                    fetchPriority="high"
                    className="z-raised object-contain"
                />

                <div
                    className={cn(
                        // 배치와 모양
                        'absolute top-[4%] left-0 z-float flex aspect-[1.1/1] w-1/4 -rotate-12 items-center justify-center rounded-blob bg-doodle-sky',
                        // 글자
                        'text-center font-hand text-bubble font-bold whitespace-pre-line text-accent-foreground',
                    )}
                >
                    {'Build\nBetter\nTogether!'}
                </div>

                <svg
                    viewBox="0 0 40 34"
                    aria-hidden="true"
                    className="absolute top-[1%] left-[66%] z-float w-[7%] rotate-12"
                >
                    <path
                        d="M4 30 L3 8 L13 18 L20 3 L27 18 L37 8 L36 30 Z"
                        fill="none"
                        className="stroke-doodle-yellow"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                </svg>
                <svg
                    viewBox="0 0 40 40"
                    aria-hidden="true"
                    className="absolute top-[15%] left-[61%] z-float w-[8%]"
                >
                    <path
                        d="M30 4 L14 22 L24 22 L10 38"
                        fill="none"
                        className="stroke-doodle-yellow"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <p
                    aria-hidden="true"
                    className="absolute top-[11%] left-[78%] z-float -rotate-8 font-hand text-note font-bold whitespace-pre-line"
                >
                    {'Ideas\nDesign\nDevelop\nDeploy ✓'}
                </p>
            </div>
        </div>
    );
}
