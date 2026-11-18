'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import { cn } from '@/shared/util/cn';
import { DURATION, EASE } from '@/style/tokens/motion';

/** 메뉴 줄(nav)에 붙인다. 밑줄이 이 줄을 기준으로 자리를 잡고, 링크가 밑줄이 준비됐는지 알 수 있다 */
export const NAV_INDICATOR_ROOT_CLASS = 'group/nav relative';

/**
 * 지금 메뉴의 링크에 붙인다. 스크립트가 준비되기 전에 보이는 고정 밑줄이다.
 * 움직이는 밑줄이 자리를 잡으면 숨는다
 */
export const NAV_INDICATOR_FALLBACK_CLASS = cn(
    'relative after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary',
    'group-has-[[data-nav-indicator]]/nav:after:hidden',
);

interface BoxData {
    x: number;
    y: number;
    width: number;
}

interface OwnProps {
    /** 지금 메뉴를 가리는 값. 바뀌면 자리를 다시 잰다 */
    activeKey: string | null;
    className?: string;
}

/**
 * 메뉴 줄에서 지금 있는 메뉴를 가리키는 밑줄. 메뉴 줄에 하나만 둔다.
 * 메뉴가 바뀌면 새 자리로 미끄러져 가고, 폭도 그 링크에 맞춰진다.
 * 지금 메뉴는 메뉴 줄 안의 aria-current="page" 로 찾는다.
 *
 * 폭이 1px 인 선을 x · y 로 옮기고 scaleX 로 늘린다. left 와 width 는 움직이지 않는다 (docs/motion.md 원칙 4).
 * framer-motion 의 layoutId 는 쓰지 않는다. 화면에 붙은 헤더에서는 페이지를 옮기며 스크롤이 맨 위로 돌아간 만큼
 * 밑줄이 아래에서 날아온다
 */
export default function NavIndicator({ activeKey, className }: OwnProps) {
    const anchorRef = useRef<HTMLSpanElement>(null);
    const [box, setBox] = useState<BoxData | null>(null);

    useLayoutEffect(() => {
        const root = anchorRef.current?.parentElement;
        if (!root) return;

        function measure() {
            const active = root?.querySelector<HTMLElement>('[aria-current="page"]');
            // 메뉴 줄이 숨어 있으면(좁은 화면의 공개 헤더) 폭이 0 이다
            if (!active || active.offsetWidth === 0) {
                setBox(null);
                return;
            }
            setBox({
                x: active.offsetLeft,
                y: active.offsetTop + active.offsetHeight,
                width: active.offsetWidth,
            });
        }

        measure();
        // 서체가 늦게 실리거나 화면 폭이 바뀌면 링크의 자리와 폭이 달라진다
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        Array.from(root.children).forEach((child) => {
            observer.observe(child);
        });

        return () => {
            observer.disconnect();
        };
    }, [activeKey]);

    return (
        <>
            {/* 메뉴 줄을 찾는 자리 표시. 밑줄은 자리를 잰 뒤에야 그린다 */}
            <span ref={anchorRef} hidden />
            {box ? (
                <motion.span
                    data-nav-indicator=""
                    aria-hidden="true"
                    // 처음에는 잰 자리에 바로 그린다. 왼쪽 끝에서 미끄러져 오지 않는다
                    initial={false}
                    animate={{ x: box.x, y: box.y, scaleX: box.width }}
                    transition={{ duration: DURATION.base, ease: EASE.move }}
                    className={cn(
                        'pointer-events-none absolute top-0 left-0 -mt-0.5 h-0.5 w-px origin-left bg-primary',
                        className,
                    )}
                />
            ) : null}
        </>
    );
}
