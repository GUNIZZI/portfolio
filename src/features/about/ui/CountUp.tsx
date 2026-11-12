'use client';

import { useEffect, useRef } from 'react';

import { animate, useInView, useReducedMotion } from 'framer-motion';

import { DURATION, EASE } from '@/style/tokens/motion';

interface OwnProps {
    value: number;
    /** 숫자 뒤에 붙는 글자 — '+' 처럼 준다 */
    suffix?: string;
}

/**
 * 화면에 처음 들어올 때 0 부터 세어 올라가는 숫자.
 * 서버에서는 최종 숫자를 그린다. 동작 줄이기에서는 세지 않고 최종 숫자를 그대로 둔다.
 */
export default function CountUp({ value, suffix = '' }: OwnProps) {
    const numberRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(numberRef, { once: true });
    const isReduced = useReducedMotion();

    useEffect(() => {
        const element = numberRef.current;
        if (!element || !isInView || isReduced) return;

        // 숫자가 바뀔 때마다 다시 렌더하지 않도록 글자를 직접 고친다
        const controls = animate(0, value, {
            duration: DURATION.slower,
            ease: EASE.enter,
            onUpdate: (latest) => {
                element.textContent = `${Math.round(latest)}${suffix}`;
            },
        });
        return () => {
            controls.stop();
        };
    }, [isInView, isReduced, suffix, value]);

    return (
        <>
            {/* 세는 중의 숫자를 읽어 주지 않도록 스크린 리더에는 최종 숫자만 준다 */}
            <span className="sr-only">
                {value}
                {suffix}
            </span>
            <span ref={numberRef} aria-hidden="true" className="tabular-nums">
                {value}
                {suffix}
            </span>
        </>
    );
}
