'use client';

import { useRef } from 'react';

import { gsap, ScrollTrigger, useGSAP } from '@/shared/util/gsap';

/**
 * 붓 자국의 위치와 모양. 원본 디자인(sample/)의 값 그대로다.
 * lag 는 본문보다 뒤처지는 비율이다. 0.5 면 본문의 절반 속도로 움직인다.
 * 붓 자국마다 달라서 좌우가 서로 다른 깊이에 있는 것처럼 보인다.
 */
const BRUSHES = [
    {
        position: 'top-10 left-0 h-130 w-[clamp(24px,4vw,56px)]',
        viewBox: '0 0 60 400',
        d: 'M0 0 C 30 40, 50 90, 26 150 C 10 190, 40 240, 30 300 C 24 340, 12 370, 0 400 Z',
        fill: 'fill-brush-sky',
        lag: 0.85,
    },
    {
        position: 'top-0 right-0 h-90 w-[clamp(24px,4vw,56px)]',
        viewBox: '0 0 60 400',
        d: 'M60 0 C 30 30, 20 80, 40 130 C 54 170, 22 220, 34 280 C 40 320, 50 360, 60 400 Z',
        fill: 'fill-brush-violet',
        lag: 0.75,
    },
    {
        position: 'top-262.5 left-0 h-75 w-[clamp(20px,3vw,44px)]',
        viewBox: '0 0 60 300',
        d: 'M0 0 C 28 50, 36 120, 18 180 C 8 220, 20 260, 0 300 Z',
        fill: 'fill-brush-sky',
        lag: 0.65,
    },
    {
        position: 'right-0 bottom-50 h-65 w-[clamp(20px,3vw,44px)]',
        viewBox: '0 0 60 300',
        d: 'M60 0 C 34 60, 28 120, 44 180 C 52 220, 40 260, 60 300 Z',
        fill: 'fill-brush-violet',
        lag: 0.5,
    },
] as const;

/**
 * 페이지 뒤에 깔리는 점 무늬와 가장자리 붓 자국.
 * 붓 자국은 본문보다 느리게, 서로 다른 속도로 움직인다. 동작 줄이기에서는 제자리에 둔다.
 */
export default function Backdrop() {
    const rootRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                // 바깥 칸은 제자리에서 위치를 재는 기준이 되고, 안쪽 svg 만 움직인다
                const slots = gsap.utils.toArray<HTMLElement>('[data-brush]');
                /** 붓 자국이 원래 자리에 오는 스크롤 위치. 화면 가운데에 올 때다 */
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
                    data-brush
                    data-lag={brush.lag}
                    className={`absolute ${brush.position}`}
                >
                    <svg viewBox={brush.viewBox} preserveAspectRatio="none" className="size-full">
                        <path d={brush.d} className={brush.fill} />
                    </svg>
                </div>
            ))}
        </div>
    );
}
