'use client';

import { useLayoutEffect, useRef, ViewTransition } from 'react';
import { usePathname } from 'next/navigation';

import { gsap, useGSAP } from '@/shared/util/gsap';
import { findNavHref, NAV_ITEMS } from '@/config/nav';

import {
    BRUSHES,
    PAINT_ANGLE,
    PAINT_TONES,
    PAINT_VIEW_BOX,
    TEMPO,
} from './model/pageTransition.constants';

/** 몸통을 가려 두는 값. 선의 길이를 1 로 보고, 선 하나만큼 그리고 선 하나만큼 비운다 */
const DASH_STYLE = { strokeDasharray: '1 1', strokeDashoffset: 1 } as const;

/** 붓질을 좌우로 뒤집는 변환. 붓질이 놓인 면의 가로가 100 이다 */
const MIRROR = 'translate(100 0) scale(-1 1)';

/** 기울인 면이 화면 모서리까지 덮도록 조금 더 키우는 비율. 모바일은 주소창이 접히며 화면의 높이가 달라져 넉넉히 잡는다 */
const COVER_MARGIN = 1.12;

/**
 * 붓질이 놓인 면을 PAINT_ANGLE 만큼 기울이고, 기울어도 화면을 다 덮도록 가로 · 세로를 따로 늘리는 변환.
 * 늘리는 정도가 화면의 비율에 따라 달라 CSS 로 적지 못하고 여기서 구한다
 */
function getPaintTransform(): string {
    const { innerWidth: width, innerHeight: height } = window;
    const angle = (PAINT_ANGLE * Math.PI) / 180;
    const scaleX = (Math.cos(angle) + (height / width) * Math.sin(angle)) * COVER_MARGIN;
    const scaleY = (Math.cos(angle) + (width / height) * Math.sin(angle)) * COVER_MARGIN;
    return `rotate(${-PAINT_ANGLE}deg) scale(${scaleX}, ${scaleY})`;
}

/** 페이지를 옮기는 동안 html 에 적어 두는 data 속성의 이름. `data-page-transition` 이 된다 */
const MOVING_KEY = 'pageTransition';

/** 이전 화면이 새 화면으로 바뀌는 순간에 끝나는 CSS 애니메이션의 이름 (src/style/viewTransition.css) */
const SWAP_ANIMATION = 'page-hold-old';

/** 화면 전환의 애니메이션이 만들어지기를 기다리는 프레임 수. 넘기면 화면 전환이 끝날 때 지운다 */
const SWAP_WAIT_FRAMES = 5;

/**
 * 이전 화면이 새 화면으로 바뀌는 순간에 onSwap 을 부른다.
 * GSAP 과 브라우저의 시계가 조금 어긋나, 시간을 따로 세지 않고 브라우저의 애니메이션이 끝나는 것을 기다린다.
 * 화면 전환이 준비된 직후에는 애니메이션이 아직 없을 수 있어 몇 프레임 동안 찾는다
 */
function waitForSwap(onSwap: () => void, framesLeft = SWAP_WAIT_FRAMES) {
    const swap = document
        .getAnimations()
        .find(
            (animation) =>
                animation instanceof CSSAnimation && animation.animationName === SWAP_ANIMATION,
        );
    if (swap) {
        void swap.finished.then(onSwap, () => undefined);
        return;
    }
    if (framesLeft > 0) {
        requestAnimationFrame(() => {
            waitForSwap(onSwap, framesLeft - 1);
        });
    }
}

/** 획마다 색을 하나씩 고른다. 모두 같은 색이 나오면 하나를 다른 색으로 바꿔, 늘 두 색이 섞이게 한다 */
function pickTones(count: number): string[] {
    const tones = Array.from(
        { length: count },
        () => PAINT_TONES[Math.floor(Math.random() * PAINT_TONES.length)] ?? PAINT_TONES[0],
    );
    if (new Set(tones).size === 1) {
        const other = PAINT_TONES.find((tone) => tone !== tones[0]) ?? PAINT_TONES[0];
        tones[Math.floor(Math.random() * count)] = other;
    }
    return tones;
}

/** CSS 의 시간 값(`400ms` · `0.4s`)을 초로 읽는다 */
function readSeconds(name: string): number {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const amount = Number.parseFloat(value);
    if (Number.isNaN(amount)) return 0;
    return value.endsWith('ms') ? amount / 1000 : amount;
}

/**
 * 옮겨 가는 페이지가 메뉴에서 왼쪽에 있는가. 같은 메뉴 안에서는 상세에서 목록으로 돌아올 때다.
 * 참이면 붓질을 좌우로 뒤집어, 첫 획을 오른쪽에서 왼쪽으로 긋는다
 */
function isLeftward(from: string, to: string): boolean {
    const fromOrder = NAV_ITEMS.findIndex((item) => item.href === findNavHref(from));
    const toOrder = NAV_ITEMS.findIndex((item) => item.href === findNavHref(to));
    if (fromOrder !== toOrder) return toOrder < fromOrder;
    return to.length < from.length;
}

/**
 * 페이지 전환. 붓으로 슥슥 5번 칠해 화면을 덮고, 덮인 동안 페이지가 바뀌고, 같은 길을 다시 그으며 지운다.
 * 붓질은 비스듬히 기울어 있고, 위에서 아래로 내려오며 좌우로 번갈아 긋는다. 획의 색은 옮길 때마다 새로 고른다.
 * 첫 획의 방향은 메뉴의 방향을 따른다.
 * 오른쪽 메뉴로 가면 왼쪽에서 오른쪽으로, 왼쪽 메뉴로 가면 반대로 시작한다.
 * 주소가 바뀌면 표식의 key 가 바뀌어 React 가 화면 전환을 시작한다. 브라우저는 (site) 레이아웃의 틀을 찍어
 * 다 칠할 때까지 이전 화면을 붙잡아 두고(style/viewTransition.css), 그동안 GSAP 이 붓질을 그린다.
 * 화면 전환을 지원하지 않는 브라우저와 동작 줄이기에서는 붓질 없이 페이지가 바로 바뀐다 (docs/motion.md 원칙 1)
 */
export default function PageTransition() {
    const pathname = usePathname();
    const rootRef = useRef<SVGSVGElement>(null);
    const strokesRef = useRef<SVGGElement>(null);
    const prevPathnameRef = useRef(pathname);
    /** 붓질을 좌우로 뒤집는가. 페이지를 옮길 때마다 다시 정한다 */
    const isReversedRef = useRef(false);
    /** 주소가 바뀌어 시작된 화면 전환을 기다리는 중인가. 새로고침한 뒤 저절로 시작되는 화면 전환과 구분한다 */
    const isMovingRef = useRef(false);

    // 화면 전환이 준비되기 전에 방향과 기울기를 정해 둔다. hndlEnter 는 이 뒤에 불린다.
    // 기울기는 화면의 비율에 맞춰 옮길 때마다 다시 구한다. 그 사이에 창의 크기가 바뀌었을 수 있다
    useLayoutEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            isMovingRef.current = true;
            // 본문의 연출은 이 표시가 있는 동안에만 걸린다 (src/style/viewTransition.css)
            document.documentElement.dataset[MOVING_KEY] = '';
        }
        isReversedRef.current = isLeftward(prevPathnameRef.current, pathname);
        prevPathnameRef.current = pathname;
        if (rootRef.current) rootRef.current.style.transform = getPaintTransform();
    }, [pathname]);
    /** 칠하는 움직임과 지우는 움직임. 동작 줄이기에서는 만들지 않는다 */
    const timelinesRef = useRef<{ cover: gsap.core.Timeline; uncover: gsap.core.Timeline } | null>(
        null,
    );

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                // 덮는 시간은 CSS 가 이전 화면을 붙잡아 두는 시간과 같아야 한다. 한 곳(style/viewTransition.css)에서 읽는다
                const coverDuration = readSeconds('--page-cover-duration');
                const uncoverDuration = readSeconds('--page-uncover-duration');
                const cover = gsap.timeline({ paused: true });
                const uncover = gsap.timeline({ paused: true });
                const coverStroke = coverDuration * TEMPO.stroke;
                const uncoverStroke = uncoverDuration * TEMPO.stroke;

                BRUSHES.forEach((brush, index) => {
                    const body = `[data-body="${brush.key}"]`;
                    const coverAt = coverDuration * TEMPO.step * index;
                    const uncoverAt = uncoverDuration * TEMPO.step * index;

                    // 칠하기. 선의 가려 둔 부분을 시작점부터 드러낸다. 붓털이 먼저 나가고 몸통이 뒤따라, 획의 끝이 붓털 자국으로 남는다
                    cover.fromTo(
                        body,
                        { strokeDashoffset: 1 },
                        { strokeDashoffset: 0, duration: coverStroke, ease: 'move' },
                        coverAt + coverStroke * TEMPO.bodyLag,
                    );
                    // 지우기. 같은 길을 한 번 더 그으며 시작점부터 걷어 낸다. 몸통이 먼저 걷히고 붓털 자국이 조금 더 남는다
                    uncover.fromTo(
                        body,
                        { strokeDashoffset: 0 },
                        {
                            strokeDashoffset: -1,
                            duration: uncoverStroke,
                            ease: 'move',
                            // 멈춰 있는 동안에는 칠하는 쪽이 정한 값을 건드리지 않는다
                            immediateRender: false,
                        },
                        uncoverAt,
                    );

                    brush.bristles.forEach((bristle) => {
                        const target = `[data-bristle="${bristle.key}"]`;
                        cover.fromTo(
                            target,
                            { strokeDashoffset: 1 },
                            { strokeDashoffset: 0, duration: coverStroke, ease: 'move' },
                            coverAt + coverStroke * TEMPO.bristleSpread * bristle.lag,
                        );
                        uncover.fromTo(
                            target,
                            { strokeDashoffset: 0 },
                            {
                                strokeDashoffset: -1,
                                duration: uncoverStroke,
                                ease: 'move',
                                immediateRender: false,
                            },
                            uncoverAt +
                                uncoverStroke * (TEMPO.bodyLag + TEMPO.bristleSpread * bristle.lag),
                        );
                    });
                });
                timelinesRef.current = { cover, uncover };

                return () => {
                    timelinesRef.current = null;
                };
            });
        },
        { scope: rootRef },
    );

    /**
     * 화면 전환이 준비된 순간에 불린다. 브라우저가 이전 화면을 붙잡기 시작하는 때와 같다.
     * @returns 화면 전환이 끝난 순간에 불리는 함수
     */
    function hndlEnter() {
        // 페이지를 옮기지 않았는데 시작된 화면 전환이다. 새로고침한 뒤 늦게 도착한 부분이 그려질 때 생긴다
        if (!isMovingRef.current) return;
        isMovingRef.current = false;

        /** 화면 전환이 끝나면 표시를 지운다 */
        function finish() {
            Reflect.deleteProperty(document.documentElement.dataset, MOVING_KEY);
        }

        const timelines = timelinesRef.current;
        if (!timelines) return finish;

        const { cover, uncover } = timelines;
        if (isReversedRef.current) strokesRef.current?.setAttribute('transform', MIRROR);
        else strokesRef.current?.removeAttribute('transform');
        // 획의 색. 몸통과 붓털은 획의 색을 물려받는다
        const tones = pickTones(BRUSHES.length);
        strokesRef.current?.querySelectorAll('[data-stroke]').forEach((stroke, index) => {
            stroke.classList.remove(...PAINT_TONES);
            stroke.classList.add(tones[index] ?? PAINT_TONES[0]);
        });
        uncover.pause();
        cover.eventCallback('onComplete', null);
        cover.restart();

        let hasErased = false;
        /** 새 화면이 나온 순간부터 지운다. 다 칠하기 전에 나왔으면 다 칠한 뒤에 지운다 */
        function erase() {
            if (hasErased) return;
            hasErased = true;
            if (cover.progress() < 1) cover.eventCallback('onComplete', () => uncover.restart());
            else uncover.restart();
        }
        waitForSwap(erase);

        // 바뀌는 순간을 놓쳤더라도 화면 전환이 끝나면 지운다
        return () => {
            erase();
            finish();
        };
    }

    return (
        <>
            <ViewTransition
                key={pathname}
                enter="page-transition"
                exit="page-transition"
                default="none"
                onEnter={hndlEnter}
            >
                {/* 화면 밖에 있으면 React 가 전환을 건너뛴다. 화면 안에 1px 로 둔다 */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed top-0 left-0 size-px"
                />
            </ViewTransition>
            {/*
              화면 전환이 붓질을 본문과 따로 찍어, 붙잡아 둔 이전 화면 위에서 움직이게 한다 (src/style/viewTransition.css).
              기울이며 키운 svg 는 화면보다 크다. 화면 크기의 틀로 감싸 틀을 찍어, 찍는 그림이 화면 크기를 넘지 않게 한다
            */}
            <div
                aria-hidden="true"
                style={{ viewTransitionName: 'page-paint' }}
                className="pointer-events-none fixed inset-0 z-float overflow-clip"
            >
                <svg
                    ref={rootRef}
                    viewBox={PAINT_VIEW_BOX}
                    preserveAspectRatio="none"
                    className="absolute inset-0 size-full"
                >
                    <g ref={strokesRef} className="fill-none">
                        {BRUSHES.map((brush) => (
                            <g key={brush.key} data-stroke={brush.key} className={PAINT_TONES[0]}>
                                <path
                                    data-body={brush.key}
                                    d={brush.d}
                                    pathLength={1}
                                    strokeWidth={brush.bodyWidth}
                                    style={DASH_STYLE}
                                />
                                {brush.bristles.map((bristle) => (
                                    <path
                                        key={bristle.key}
                                        data-bristle={bristle.key}
                                        d={bristle.d}
                                        pathLength={1}
                                        strokeWidth={bristle.width}
                                        style={{
                                            strokeDasharray: bristle.dash,
                                            strokeDashoffset: 1,
                                        }}
                                    />
                                ))}
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
        </>
    );
}
