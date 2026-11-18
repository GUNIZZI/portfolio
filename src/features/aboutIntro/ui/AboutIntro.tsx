import Image from 'next/image';

import type { AboutIntroData } from '@/entities/about/model/about.types';
import DrawnPath from '@/shared/ui/drawnPath/DrawnPath';
import Icon from '@/shared/ui/icon/Icon';
import { cn } from '@/shared/util/cn';

/** 소개 페이지의 첫 화면. 페이지 제목, 소개 문단, 성장 경로, 캐릭터 */
interface OwnProps {
    /** 소개 문단 · 성장 경로 · 그 아래 한 줄. 페이지가 저장소에서 읽어 넘긴다 */
    intro: AboutIntroData;
}

export default function AboutIntro({ intro }: OwnProps) {
    return (
        <section className="mx-auto flex max-w-page flex-wrap items-center gap-x-10 gap-y-8 px-gutter pt-6 pb-4">
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
                <span
                    aria-hidden="true"
                    className="inline-block -rotate-6 self-start font-hand text-greeting font-bold"
                >
                    Nice to meet you!
                </span>
                <div>
                    <h1 className="font-marker text-hero-sub font-normal">ABOUT ME</h1>
                    <svg
                        viewBox="0 0 400 20"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="mt-1 h-4 w-[min(100%,340px)]"
                    >
                        <DrawnPath
                            d="M4 14 C 120 4, 260 2, 396 8"
                            className="stroke-brand"
                            strokeWidth={9}
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <div className="flex flex-col gap-3 text-lead leading-relaxed text-foreground lg:max-w-140">
                    {intro.lines.map((line) => (
                        <p key={line}>{line}</p>
                    ))}
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-caption font-semibold text-muted-foreground">지나온 길</h2>
                    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-caption">
                        {intro.growthPath.map((step, index) => {
                            const isLast = index === intro.growthPath.length - 1;
                            return (
                                <li key={step} className="flex items-center gap-1.5">
                                    <span
                                        className={cn(
                                            'rounded-lg px-3 py-1.5 font-medium',
                                            // 지금 하는 일만 강조색으로 둔다
                                            isLast
                                                ? 'bg-primary font-bold text-primary-foreground'
                                                : 'bg-chip',
                                        )}
                                    >
                                        {step}
                                    </span>
                                    {isLast ? null : (
                                        <Icon
                                            name="arrowRight"
                                            size={14}
                                            strokeWidth={2}
                                            className="text-decorative"
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                    {intro.growthPathNote ? (
                        <p className="text-caption text-muted-foreground">{intro.growthPathNote}</p>
                    ) : null}
                </div>
            </div>

            <div className="flex min-w-0 flex-[1_1_320px] justify-center">
                <div className="relative aspect-[640/470] w-full max-w-110">
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-[8%] top-[10%] bottom-0 z-base -rotate-3 rounded-blob bg-brand"
                    />
                    <Image
                        src="/images/characters/about.png"
                        alt="윙크하며 엄지를 든 개발자 캐릭터 일러스트"
                        fill
                        sizes="(max-width: 920px) 100vw, 440px"
                        loading="eager"
                        className="z-raised object-contain"
                    />
                    <p
                        aria-hidden="true"
                        className="absolute top-0 right-0 z-float rotate-6 font-hand text-note font-bold whitespace-pre-line"
                    >
                        {'Since\n2004'}
                    </p>
                </div>
            </div>
        </section>
    );
}
