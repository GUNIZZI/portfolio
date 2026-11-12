'use client';

import { useRef } from 'react';

import { cn } from '@/shared/util/cn';
import { gsap, ScrollTrigger, useGSAP } from '@/shared/util/gsap';

import { BRUSHES, DOODLE_SHAPES, DOODLE_TONE_CLASS, DOODLES } from './model/backdrop.constants';

const BRUSH_FILTER_ID = 'backdrop-brush';

interface DoodleParts {
    d: string;
    drips?: string;
    dots?: readonly (readonly [number, number, number])[];
}

/**
 * 페이지 뒤에 깔리는 점 무늬, 가장자리 붓 자국, 흩어진 낙서.
 * 붓 자국과 낙서는 본문과 다른 속도로, 서로 다른 속도로 움직인다. 동작 줄이기에서는 제자리에 둔다.
 */
export default function Backdrop() {
    const rootRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                // 바깥 칸은 제자리에서 위치를 재는 기준이 되고, 안쪽 svg 만 움직인다
                const slots = gsap.utils.toArray<HTMLElement>('[data-drift]');
                /** 장식이 원래 자리에 오는 스크롤 위치. 화면 가운데에 올 때다 */
                let homes: number[] = [];

                function place(scroll: number) {
                    slots.forEach((slot, index) => {
                        const lag = Number(slot.dataset['lag']);
                        const home = homes[index] ?? 0;
                        gsap.set(slot.firstElementChild, { y: (scroll - home) * lag });
                    });
                }

                ScrollTrigger.create({
                    start: 0,
                    end: 'max',
                    onRefresh: (self) => {
                        homes = slots.map((slot) => {
                            const rect = slot.getBoundingClientRect();
                            const center = rect.top + self.scroll() + rect.height / 2;
                            // 처음 화면과 페이지 끝에서는 가운데까지 올 수 없다. 닿을 수 있는 위치로 맞춘다
                            return gsap.utils.clamp(0, self.end, center - window.innerHeight / 2);
                        });
                        // 스크롤하기 전에도 제 위치에 둔다. 첫 스크롤에 한꺼번에 옮겨지지 않게 한다
                        place(self.scroll());
                    },
                    onUpdate: (self) => {
                        place(self.scroll());
                    },
                });
            });
        },
        { scope: rootRef },
    );

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-base overflow-clip"
        >
            <div className="absolute inset-0 bg-[radial-gradient(var(--dot)_1px,transparent_1px)] bg-size-[18px_18px]" />
            {BRUSHES.map((brush) => (
                <div
                    key={brush.position}
                    data-drift
                    data-lag={brush.lag}
                    className={`absolute ${brush.position}`}
                >
                    <svg viewBox={brush.viewBox} preserveAspectRatio="none" className="size-full">
                        <path d={brush.d} className={brush.fill} />
                    </svg>
                </div>
            ))}
            {/* 붓 질감. 가장자리를 거칠게 흩고(displace), 군데군데 물감이 덜 묻은 줄을 낸다(bristle) */}
            <svg className="absolute size-0">
                <defs>
                    <filter
                        id={BRUSH_FILTER_ID}
                        x="-25%"
                        y="-25%"
                        width="150%"
                        height="150%"
                        primitiveUnits="userSpaceOnUse"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.55"
                            numOctaves="2"
                            seed="7"
                            result="grain"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="grain"
                            scale="2.4"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="rough"
                        />
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.05 0.32"
                            numOctaves="1"
                            seed="11"
                            result="streak"
                        />
                        <feColorMatrix
                            in="streak"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -14 4.6"
                            result="gaps"
                        />
                        <feComposite in="rough" in2="gaps" operator="out" />
                    </filter>
                </defs>
            </svg>
            {DOODLES.map((doodle) => {
                const shape: DoodleParts = DOODLE_SHAPES[doodle.shape];
                const tone = DOODLE_TONE_CLASS[doodle.tone];
                return (
                    <div
                        key={doodle.position}
                        data-drift
                        data-lag={doodle.lag}
                        className={cn('absolute', doodle.position)}
                    >
                        <svg viewBox="0 0 48 48" className="block w-full overflow-visible">
                            <g
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter={`url(#${BRUSH_FILTER_ID})`}
                                className={tone.stroke}
                            >
                                <path d={shape.d} strokeWidth="5.5" />
                                {shape.drips ? <path d={shape.drips} strokeWidth="2.6" /> : null}
                                {shape.dots?.map(([cx, cy, r]) => (
                                    <circle
                                        key={`${cx}-${cy}`}
                                        cx={cx}
                                        cy={cy}
                                        r={r}
                                        stroke="none"
                                        className={tone.fill}
                                    />
                                ))}
                            </g>
                        </svg>
                    </div>
                );
            })}
        </div>
    );
}
