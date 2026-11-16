'use client';

import { type ReactNode, useRef } from 'react';

import DoodleFilter from '@/shared/ui/doodle/DoodleFilter';
import { gsap, ScrollTrigger, useGSAP } from '@/shared/util/gsap';

import { BRUSHES } from './model/backdrop.constants';

interface OwnProps {
    /** 이 페이지의 낙서. `shared/ui/doodle` 의 Doodle 을 넣는다 */
    children?: ReactNode;
}

/**
 * 페이지 뒤에 깔리는 배경. 점 무늬와 가장자리 붓 자국은 모든 페이지가 같고,
 * 낙서는 페이지마다 달라 children 으로 받는다.
 * data-drift 가 붙은 장식은 data-lag 만큼 본문과 다른 속도로 움직인다. 동작 줄이기에서는 제자리에 둔다.
 */
export default function Backdrop({ children }: OwnProps) {
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
            <DoodleFilter />
            {children}
        </div>
    );
}
