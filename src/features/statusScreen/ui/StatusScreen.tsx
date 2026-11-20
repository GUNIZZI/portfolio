import type { ReactNode } from 'react';

import DrawnPath from '@/shared/ui/drawnPath/DrawnPath';

interface OwnProps {
    /** 크게 적는 숫자. 404 · 500 */
    code: string;
    /** 숫자 아래의 마커 제목 */
    title: string;
    description: string;
    /** 버튼. 여럿이면 옆으로 놓인다 */
    actions: ReactNode;
    /** 오른쪽의 캐릭터. StatusVisual 을 넣는다 */
    visual: ReactNode;
}

/**
 * 404 와 에러 화면이 함께 쓰는 틀. 헤더 아래의 첫 화면을 채운다.
 * 배치는 홈의 히어로와 같다. 왼쪽에 글과 버튼, 오른쪽에 캐릭터를 둔다.(2026-11-20 사용자가 준 404 시안)
 */
export default function StatusScreen({ code, title, description, actions, visual }: OwnProps) {
    return (
        <section className="mx-auto flex min-h-below-header max-w-page flex-wrap items-center gap-6 px-gutter py-10">
            <div className="flex min-w-0 flex-[1_1_440px] flex-col items-start gap-5">
                <svg
                    width="56"
                    height="44"
                    viewBox="0 0 56 44"
                    aria-hidden="true"
                    className="ml-[14%] -rotate-6"
                >
                    <DrawnPath
                        d="M6 38 L4 10 L18 24 L28 4 L38 24 L52 10 L50 38 Z"
                        className="stroke-doodle-yellow"
                        strokeWidth={4}
                        strokeLinejoin="round"
                    />
                </svg>

                <h1 className="font-marker font-normal">
                    <span className="relative inline-block -rotate-6 text-error-code">
                        {code}
                        {/* 숫자 오른쪽 위에서 퍼지는 강조 선. 글자 크기를 따라가게 em 으로 잰다 */}
                        <svg
                            viewBox="0 0 40 40"
                            aria-hidden="true"
                            className="absolute -top-[0.12em] left-[calc(100%-0.08em)] size-[0.36em]"
                        >
                            <DrawnPath
                                d="M5 26 L11 5 M16 32 L33 15 M21 38 L38 36"
                                className="stroke-doodle-yellow"
                                strokeWidth={5}
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                    <svg
                        viewBox="0 0 400 20"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="block h-4.5 w-[min(100%,440px)]"
                    >
                        <DrawnPath
                            d="M4 14 C 120 4, 260 2, 396 8"
                            className="stroke-primary"
                            strokeWidth={9}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="mt-7 block text-contact">{title}</span>
                </h1>

                <p className="text-lead leading-normal text-foreground">{description}</p>

                <div className="mt-3 flex flex-wrap gap-4">{actions}</div>
            </div>

            {visual}
        </section>
    );
}
