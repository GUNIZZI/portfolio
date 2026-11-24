'use client';

import { useEffect, useLayoutEffect, useRef, ViewTransition } from 'react';
import { usePathname } from 'next/navigation';

import { gsap, useGSAP } from '@/shared/util/gsap';
import { subscribeRouteStart } from '@/shared/util/routeStart';
import { DURATION } from '@/style/tokens/motion';

import {
    BRUSHES,
    PAINT_ANGLE,
    PAINT_TONES,
    PAINT_VIEW_BOX,
    TEMPO,
} from './model/pageTransition.constants';
import {
    isLeftward,
    type PageTransitionMode,
    shouldCoverEarly,
    toTransitionMode,
} from './model/pageTransition.utils';

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

/** 페이지를 옮기는 동안 html 에 적어 두는 data 속성의 이름. `data-page-transition` 이 되고, 값은 연출의 이름이다 */
const MOVING_KEY = 'pageTransition';

/**
 * 이전 화면을 붙잡아 두는 시간을 적는 CSS 변수 (src/style/viewTransition.css).
 * 링크를 누른 순간부터 칠했으면, 새 페이지가 왔을 때 다 칠하기까지 남은 시간만 붙잡는다
 */
const HOLD_VAR = '--page-hold-duration';

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

interface TimelineData {
    cover: gsap.core.Timeline;
    uncover: gsap.core.Timeline;
}

/** 붓질의 방향과 기울기, 획의 색을 정하고 칠하기 시작한다 */
function playCover(
    { cover, uncover }: TimelineData,
    root: SVGSVGElement | null,
    strokes: SVGGElement | null,
    isReversed: boolean,
) {
    // 기울기는 화면의 비율에 맞춰 칠할 때마다 다시 구한다. 그 사이에 창의 크기가 바뀌었을 수 있다
    if (root) root.style.transform = getPaintTransform();
    if (isReversed) strokes?.setAttribute('transform', MIRROR);
    else strokes?.removeAttribute('transform');
    // 획의 색. 몸통과 붓털은 획의 색을 물려받는다
    const tones = pickTones(BRUSHES.length);
    strokes?.querySelectorAll('[data-stroke]').forEach((stroke, index) => {
        stroke.classList.remove(...PAINT_TONES);
        stroke.classList.add(tones[index] ?? PAINT_TONES[0]);
    });
    uncover.pause();
    cover.eventCallback('onComplete', null);
    cover.restart();
}

/** 지우기 시작한다. 다 칠하기 전이면 다 칠한 뒤에 지운다 */
function playUncover({ cover, uncover }: TimelineData) {
    if (cover.progress() < 1) cover.eventCallback('onComplete', () => uncover.restart());
    else uncover.restart();
}

/** CSS 의 시간 값(`400ms` · `0.4s`)을 초로 읽는다 */
function readSeconds(name: string): number {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const amount = Number.parseFloat(value);
    if (Number.isNaN(amount)) return 0;
    return value.endsWith('ms') ? amount / 1000 : amount;
}

/**
 * 페이지 전환. 붓으로 슥슥 5번 칠해 화면을 덮고, 덮인 동안 페이지가 바뀌고, 같은 길을 다시 그으며 지운다.
 * 붓질은 비스듬히 기울어 있고, 위에서 아래로 내려오며 좌우로 번갈아 긋는다. 획의 색은 옮길 때마다 새로 고른다.
 * 첫 획의 방향은 메뉴의 방향을 따른다.
 * 오른쪽 메뉴로 가면 왼쪽에서 오른쪽으로, 왼쪽 메뉴로 가면 반대로 시작한다.
 * 같은 메뉴 안에서 옮길 때(작업 목록 ↔ 상세)는 붓질을 그리지 않고, 화면이 번지며 바뀌는 디졸브만 한다.(2026-11-20 사용자 결정)
 * 붓질은 링크를 누른 순간에 시작한다. 새 페이지가 늦으면 다 덮은 채로 기다린다.(2026-11-24 사용자 결정)
 * 새 페이지가 와 주소가 바뀌면 표식의 key 가 바뀌어 React 가 화면 전환을 시작한다. 브라우저는 (site) 레이아웃의 틀을 찍어
 * 다 칠할 때까지 남은 시간만큼 이전 화면을 붙잡아 두고(style/viewTransition.css), 다 칠한 순간부터 지운다.
 * 누른 순간을 알 수 없는 이동(메뉴 밖의 주소)은 새 페이지가 온 뒤에 칠하기 시작한다.
 * 화면 전환을 지원하지 않는 브라우저와 동작 줄이기에서는 붓질 없이 페이지가 바로 바뀐다 (docs/motion.md 원칙 1)
 */
export default function PageTransition() {
    const pathname = usePathname();
    const rootRef = useRef<SVGSVGElement>(null);
    const strokesRef = useRef<SVGGElement>(null);
    const prevPathnameRef = useRef(pathname);
    /** 주소가 바뀌어 시작된 화면 전환을 기다리는 중인가. 새로고침한 뒤 저절로 시작되는 화면 전환과 구분한다 */
    const isMovingRef = useRef(false);
    /** 이번에 옮길 때의 연출. 페이지를 옮길 때마다 다시 정한다 */
    const modeRef = useRef<PageTransitionMode>('paint');
    /** 이번에 옮길 때 붓질을 좌우로 뒤집는가 */
    const isReversedRef = useRef(false);
    /** 브라우저의 뒤로 · 앞으로 가기로 옮기는 중인가 */
    const isTraversingRef = useRef(false);
    /** 붓질을 칠하기 시작했고 아직 지우지 않았는가 */
    const isCoveredRef = useRef(false);
    /** 링크를 누른 순간에 칠하기 시작한 시각(ms). 새 페이지가 오면 비운다 */
    const earlyCoverAtRef = useRef<number | null>(null);
    /** 화면 전환이 시작되지 않을 때를 대비해 걸어 둔 타이머 */
    const fallbackTimerRef = useRef<number | null>(null);
    /** 칠하는 움직임과 지우는 움직임. 동작 줄이기에서는 만들지 않는다 */
    const timelinesRef = useRef<TimelineData | null>(null);

    /** 지운다. 이미 지웠으면 아무것도 하지 않는다 */
    function erase() {
        if (!isCoveredRef.current) return;
        isCoveredRef.current = false;
        if (timelinesRef.current) playUncover(timelinesRef.current);
    }

    /** 페이지를 옮기는 동안 html 에 적어 둔 표시를 지운다 */
    function finish() {
        Reflect.deleteProperty(document.documentElement.dataset, MOVING_KEY);
        document.documentElement.style.removeProperty(HOLD_VAR);
    }

    // 링크를 누른 순간부터 칠한다. 새 페이지를 기다리는 동안 화면이 멈춘 것처럼 보이지 않는다
    useEffect(() => {
        const unsubscribe = subscribeRouteStart(({ pathname: to, type }) => {
            const from = prevPathnameRef.current;
            if (earlyCoverAtRef.current !== null) {
                // 덮은 채로 기다리다가 뒤로 가기로 제자리에 돌아왔다. 새 페이지는 오지 않으므로 지운다
                if (type === 'traverse' && to === from) {
                    earlyCoverAtRef.current = null;
                    erase();
                }
                return;
            }
            // 뒤로 · 앞으로 가기는 React 가 화면을 바로 바꾼다. 붓질을 그리지 않는다
            if (type === 'traverse' || isCoveredRef.current) return;
            if (!shouldCoverEarly(from, to)) return;
            // 화면 전환을 지원하지 않는 브라우저에서는 붓질 없이 페이지가 바로 바뀐다
            if (!('startViewTransition' in document)) return;
            const timelines = timelinesRef.current;
            if (!timelines) return;

            playCover(timelines, rootRef.current, strokesRef.current, isLeftward(from, to));
            isCoveredRef.current = true;
            earlyCoverAtRef.current = performance.now();
        });
        return () => {
            unsubscribe();
            if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
        };
    }, []);

    // 뒤로 · 앞으로 가기에서는 React 가 화면을 바로 바꾸고 화면 전환을 시작하지 않는다.
    // 그때 표시를 켜 두면 지울 때가 오지 않아 계속 남고, 그 뒤에 늦게 도착한 부분이 그려질 때 붓질이 돈다
    useEffect(() => {
        function hndlPopState() {
            if (window.location.pathname === prevPathnameRef.current) {
                // 라우터가 이미 페이지를 바꿨다. 아래의 useLayoutEffect 가 방금 켠 표시를 지운다.
                // 주소의 # 나 ? 만 바뀐 이동도 여기로 온다. 그때는 지울 표시가 없다
                isMovingRef.current = false;
                finish();
                return;
            }
            // 페이지가 조금 뒤에 바뀐다. 그때 표시를 켜지 않게 적어 둔다
            isTraversingRef.current = true;
        }
        window.addEventListener('popstate', hndlPopState);
        return () => {
            window.removeEventListener('popstate', hndlPopState);
        };
    }, []);

    // 새 페이지가 왔다. 화면 전환이 준비되기 전에 연출과 붙잡아 둘 시간을 정해 둔다. hndlEnter 는 이 뒤에 불린다
    useLayoutEffect(() => {
        const from = prevPathnameRef.current;
        const isTraversing = isTraversingRef.current;
        const earlyCoverAt = earlyCoverAtRef.current;
        isTraversingRef.current = false;
        earlyCoverAtRef.current = null;
        prevPathnameRef.current = pathname;
        if (from === pathname) return;

        if (isTraversing) {
            // 덮은 채로 기다리다가 뒤로 · 앞으로 가기로 다른 페이지에 왔다. 화면 전환이 없으므로 여기서 지운다
            erase();
            return;
        }

        isMovingRef.current = true;
        isReversedRef.current = isLeftward(from, pathname);
        // 이미 칠하고 있으면 같은 메뉴 안의 이동이어도 붓질로 마친다
        modeRef.current = earlyCoverAt === null ? toTransitionMode(from, pathname) : 'paint';
        const root = document.documentElement;
        // 본문의 연출은 이 표시가 있는 동안에만 걸리고, 적힌 값에 따라 달라진다 (src/style/viewTransition.css)
        root.dataset[MOVING_KEY] = modeRef.current;
        if (earlyCoverAt === null) return;

        // 누른 순간부터 칠했다. 다 칠하기까지 남은 시간만 이전 화면을 붙잡는다. 이미 다 칠했으면 바로 바꾼다
        const coverMs = readSeconds('--page-cover-duration') * 1000;
        const holdMs = Math.max(0, coverMs - (performance.now() - earlyCoverAt));
        root.style.setProperty(HOLD_VAR, `${holdMs}ms`);
        // 탭이 가려져 있으면 브라우저가 화면 전환을 시작하지 않아 hndlEnter 가 불리지 않는다. 그때는 여기서 지운다
        if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = window.setTimeout(
            () => {
                fallbackTimerRef.current = null;
                if (!isMovingRef.current) return;
                isMovingRef.current = false;
                erase();
                finish();
            },
            holdMs + DURATION.base * 1000,
        );
    }, [pathname]);

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
        if (fallbackTimerRef.current !== null) {
            window.clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }

        // 디졸브는 CSS 만으로 바뀐다. 붓질을 그리지 않는다
        if (modeRef.current === 'dissolve') return finish;

        const timelines = timelinesRef.current;
        if (!timelines) return finish;

        // 누른 순간에 칠하기 시작하지 못한 이동이다. 지금부터 칠한다
        if (!isCoveredRef.current) {
            playCover(timelines, rootRef.current, strokesRef.current, isReversedRef.current);
            isCoveredRef.current = true;
        }
        // 새 화면이 나온 순간부터 지운다
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
