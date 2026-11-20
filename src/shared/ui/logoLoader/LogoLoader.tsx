'use client';

import { type CSSProperties, type HTMLAttributes, useRef } from 'react';
import Image from 'next/image';

import { cn } from '@/shared/util/cn';
import { gsap, useGSAP } from '@/shared/util/gsap';
import { DURATION, STAGGER } from '@/style/tokens/motion';

/**
 * 색을 드러내는 가림막이 지나가는 범위. 가림막의 흐린 가장자리가 있는 자리를 심볼 폭의 %로 적는다.
 * 시작은 심볼 왼쪽 밖이라 색이 다 가려지고, 끝은 오른쪽 밖이라 색이 다 드러난다
 */
const REVEAL = { from: -25, to: 155 } as const;

/**
 * 색을 입힌 심볼에 씌우는 가림막. 가장자리의 왼쪽은 다 보이고 오른쪽으로 가며 옅어진다.
 * 살짝 기운 선으로 지나간다. --reveal 을 주지 않으면 끝자리에 있어 색이 다 보인다
 */
const REVEAL_MASK = `linear-gradient(109.5deg, black calc(var(--reveal, ${REVEAL.to}) * 1% - 37%), rgb(0 0 0 / 0.62) calc(var(--reveal, ${REVEAL.to}) * 1% - 20%), transparent calc(var(--reveal, ${REVEAL.to}) * 1%))`;

const COLOR_STYLE: CSSProperties = { maskImage: REVEAL_MASK, WebkitMaskImage: REVEAL_MASK };

/**
 * 색을 뺀 바탕 심볼과 쉬고 있는 점의 흐린 정도. 받은 시안의 값 그대로다.(2026-11-20 사용자 결정)
 * 비활성을 뜻하는 것이 아니라 opacity-disabled 를 쓰지 않는다
 */
const BASE_STYLE: CSSProperties = { filter: 'grayscale(0.8) brightness(0.4)', opacity: 0.72 };
const DOT_OPACITY = { rest: 0.55, low: 0.28, high: 1 } as const;
const DOT_STYLE: CSSProperties = { opacity: DOT_OPACITY.rest };

/** 점이 뛰어오르는 높이(px) */
const DOT_LIFT = -2;

const DOT_KEYS = ['first', 'second', 'third'] as const;

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
    /** 보조 기술이 읽는 문구. 화면에는 보이지 않는다 */
    label?: string;
}

/**
 * 페이지 본문을 기다리는 동안 그 자리에 두는 로더. Suspense 의 fallback 으로 쓴다.
 * 색을 뺀 G 심볼 위로 색이 왼쪽부터 번져 들어왔다가 옅어지기를 되풀이하고, 아래의 점 3개가 차례로 뛴다.
 * 동작 줄이기에서는 움직이지 않고 색이 다 들어온 심볼과 멈춘 점만 보인다.
 */
export default function LogoLoader({ className, label = '불러오는 중', ...rest }: OwnProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const colorRef = useRef<HTMLImageElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                const color = colorRef.current;
                if (!color) return;
                const dots = gsap.utils.toArray<HTMLElement>('[data-dot]');
                const dotFrom = { opacity: DOT_OPACITY.low, y: 0 };
                // 점 하나가 올랐다 내려오고, 다음 점이 간격을 두고 따라 한다
                const dotTo = {
                    opacity: DOT_OPACITY.high,
                    y: DOT_LIFT,
                    duration: DURATION.fast,
                    ease: 'move',
                    stagger: { each: STAGGER.loose, repeat: 1, yoyo: true },
                };

                gsap.timeline({ repeat: -1, repeatDelay: DURATION.fast })
                    .set(color, { opacity: 1 }, 0)
                    // 색이 왼쪽부터 번져 들어온다
                    .fromTo(
                        color,
                        { '--reveal': REVEAL.from },
                        { '--reveal': REVEAL.to, duration: DURATION.slower, ease: 'move' },
                        0,
                    )
                    // 잠깐 머문 뒤 색이 옅어져 바탕 심볼만 남는다
                    .to(
                        color,
                        { opacity: 0, duration: DURATION.base, ease: 'move' },
                        DURATION.slower + DURATION.base,
                    )
                    // 점은 색이 들어오는 동안 한 번, 옅어지기 전에 한 번 뛴다
                    .fromTo(dots, dotFrom, dotTo, DURATION.base)
                    .fromTo(dots, dotFrom, dotTo, DURATION.slower + DURATION.fast);
            });
        },
        { scope: rootRef },
    );

    return (
        <div
            ref={rootRef}
            role="status"
            className={cn(
                'flex min-h-[60dvh] flex-col items-center justify-center gap-5',
                className,
            )}
            {...rest}
        >
            {/* 심볼의 색은 두 테마에서 같다. 그림 한 장을 바탕과 색 2겹으로 겹친다 */}
            <div aria-hidden="true" className="relative w-[clamp(96px,24vw,132px)]">
                <Image
                    src="/images/logo/symbol.svg"
                    alt=""
                    width={426}
                    height={348}
                    unoptimized
                    loading="eager"
                    className="h-auto w-full"
                    style={BASE_STYLE}
                />
                <Image
                    ref={colorRef}
                    src="/images/logo/symbol.svg"
                    alt=""
                    width={426}
                    height={348}
                    unoptimized
                    loading="eager"
                    className="absolute inset-0 h-auto w-full"
                    style={COLOR_STYLE}
                />
            </div>
            <div aria-hidden="true" className="flex items-center gap-2">
                {DOT_KEYS.map((key) => (
                    <span
                        key={key}
                        data-dot
                        className="size-1 rounded-full bg-primary"
                        style={DOT_STYLE}
                    />
                ))}
            </div>
            <span className="sr-only">{label}</span>
        </div>
    );
}
