'use client';

import { useEffect, useState } from 'react';

import { useScroll } from 'framer-motion';

export interface SectionRect {
    id: string;
    /** 화면 좌표에서 섹션의 위와 아래 */
    top: number;
    bottom: number;
    /** 메뉴로 이동했을 때 섹션의 위가 멈추는 자리(화면 좌표 y). 섹션의 scroll-margin-top 이다 */
    anchor: number;
}

export interface Viewport {
    height: number;
    /** 스크롤이 페이지 맨 아래에 닿았는가 */
    isAtEnd: boolean;
}

export interface SectionSpy {
    /** 지금 보고 있는 섹션의 id. 없으면 null */
    currentId: string | null;
    /** 첫 섹션에 도달했는가 */
    isPastFirst: boolean;
}

/** 스크롤이 멈춘 자리가 소수점으로 어긋나는 만큼의 여유(px) */
const TOLERANCE_PX = 1;

/**
 * 보고 있는 섹션을 고른다. rects 는 문서에 놓인 순서다.
 *
 * 섹션의 위가 anchor 까지 올라오면 그 섹션에 도달한 것이다. 도달한 섹션 가운데 가장 뒤의 것을 고른다.
 * 메뉴로 이동하면 섹션의 위가 anchor 에 멈추므로, 누른 메뉴의 섹션이 항상 골라진다.
 * 화면 가운데를 기준으로 하면 화면 절반보다 짧은 섹션에서 다음 섹션이 골라진다.
 */
export function resolveSection(rects: readonly SectionRect[], viewport: Viewport): SectionSpy {
    let currentIndex = rects.findLastIndex((rect) => rect.top <= rect.anchor + TOLERANCE_PX);
    const isPastFirst = currentIndex !== -1;

    // 페이지 끝에 막혀 anchor 까지 올라오지 못한 섹션은, 화면에 보이면 도달한 것으로 본다
    if (viewport.isAtEnd) {
        const visibleIndex = rects.findLastIndex(
            (rect) => rect.top < viewport.height && rect.bottom > rect.anchor,
        );
        currentIndex = Math.max(currentIndex, visibleIndex);
    }

    // 마지막 섹션이 anchor 위로 다 지나가면 목록에 없는 곳을 보고 있는 것이다
    const current = rects[currentIndex];
    const isLast = currentIndex === rects.length - 1;
    if (!current || (isLast && current.bottom <= current.anchor)) {
        return { currentId: null, isPastFirst };
    }

    return { currentId: current.id, isPastFirst };
}

/**
 * 보고 있는 섹션을 스크롤에 맞춰 알려 준다.
 * ids 는 문서에 놓인 순서이고, 렌더마다 같은 배열이어야 한다. 모듈 상수로 둔다.
 */
export function useSectionSpy(ids: readonly string[]): SectionSpy {
    const { scrollY } = useScroll();
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [isPastFirst, setIsPastFirst] = useState(false);

    useEffect(() => {
        function update() {
            const rects = ids.flatMap((id) => {
                const element = document.getElementById(id);
                if (!element) return [];
                const rect = element.getBoundingClientRect();
                const anchor = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
                return [{ id, top: rect.top, bottom: rect.bottom, anchor }];
            });
            const root = document.documentElement;
            const spy = resolveSection(rects, {
                height: window.innerHeight,
                isAtEnd: window.scrollY + window.innerHeight >= root.scrollHeight - TOLERANCE_PX,
            });
            setCurrentId(spy.currentId);
            setIsPastFirst(spy.isPastFirst);
        }

        const stopScroll = scrollY.on('change', update);
        // 화면 크기가 바뀌거나 이미지가 늦게 들어와 섹션 위치가 달라질 때도 다시 잰다
        const observer = new ResizeObserver(update);
        observer.observe(document.body);

        return () => {
            stopScroll();
            observer.disconnect();
        };
    }, [ids, scrollY]);

    return { currentId, isPastFirst };
}
