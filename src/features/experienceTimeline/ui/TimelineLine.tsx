'use client';

import { useEffect, useRef } from 'react';

import { motion, useMotionValue, useScroll } from 'framer-motion';

/**
 * 타임라인의 세로선. 스크롤한 만큼 위에서 아래로 그려지고, 선의 끝은 화면 가운데에 머문다.
 * 부모가 relative 여야 하고, 부모의 높이만큼 늘어난다.
 * md 이상에서는 왼쪽에 연도를 둘 자리만큼 안으로 들어간다. 점(TimelineMarker)의 가운데와 맞춘다.
 * 동작 줄이기에서는 다 그려진 선으로 둔다.
 */
export default function TimelineLine() {
    const trackRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const scaleY = useMotionValue(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // 선의 위쪽에서 화면 가운데까지의 거리가 그려진 길이다
        function update() {
            const rect = track?.getBoundingClientRect();
            if (!rect || rect.height === 0) return;
            const drawn = window.innerHeight / 2 - rect.top;
            scaleY.set(Math.min(Math.max(drawn / rect.height, 0), 1));
        }

        update();
        const stopScroll = scrollY.on('change', update);
        // 회사를 여닫으면 선의 전체 길이가 바뀐다. 스크롤하지 않아도 바로 다시 잰다.
        // 스크롤할 때만 재면 길이가 바뀐 만큼 선의 끝이 아래로 밀려 있다가 다음 스크롤에 튀어 오른다
        const observer = new ResizeObserver(update);
        observer.observe(track);

        return () => {
            stopScroll();
            observer.disconnect();
        };
    }, [scaleY, scrollY]);

    return (
        <div
            ref={trackRef}
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-1.25 w-0.5 bg-line md:left-25.25"
        >
            <motion.div
                style={{ scaleY }}
                className="size-full origin-top bg-primary motion-reduce:scale-y-100!"
            />
        </div>
    );
}
