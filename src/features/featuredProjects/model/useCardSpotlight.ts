import { type RefObject, useEffect } from 'react';

import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';

/** 불빛의 자리를 받는 요소들. 카드마다 하나씩 들어온다 */
const targets = new Set<HTMLElement>();
/** 마지막으로 본 포인터의 자리. 창 안에 포인터가 없으면 null 이다 */
let pointer: { x: number; y: number } | null = null;
let frame = 0;

/** 포인터의 자리를 요소마다 자기 왼쪽 위에서 잰 값으로 바꿔 적는다 */
function paint() {
    frame = 0;
    if (!pointer) return;
    const { x, y } = pointer;
    // 자리를 모두 읽은 뒤에 쓴다. 번갈아 하면 요소마다 레이아웃을 다시 계산한다
    const rects = [...targets].map((target) => [target, target.getBoundingClientRect()] as const);
    for (const [target, rect] of rects) {
        target.style.setProperty('--spot-x', `${x - rect.left}px`);
        target.style.setProperty('--spot-y', `${y - rect.top}px`);
    }
}

/** 한 프레임에 한 번만 그린다 */
function schedule() {
    if (frame || !pointer) return;
    frame = requestAnimationFrame(paint);
}

function hndlPointerMove(event: PointerEvent) {
    // 터치에는 따라갈 포인터가 없다
    if (event.pointerType !== 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY };
    schedule();
}

function clear(target: HTMLElement) {
    target.style.removeProperty('--spot-x');
    target.style.removeProperty('--spot-y');
}

/** 포인터가 창 밖으로 나가면 불을 끈다 */
function hndlPointerLeave() {
    pointer = null;
    cancelAnimationFrame(frame);
    frame = 0;
    targets.forEach(clear);
}

function subscribe(target: HTMLElement) {
    // 창의 리스너는 카드가 몇 개든 하나만 둔다
    if (targets.size === 0) {
        window.addEventListener('pointermove', hndlPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', hndlPointerLeave);
    }
    targets.add(target);
    schedule();

    return () => {
        targets.delete(target);
        clear(target);
        if (targets.size > 0) return;
        window.removeEventListener('pointermove', hndlPointerMove);
        document.documentElement.removeEventListener('pointerleave', hndlPointerLeave);
        hndlPointerLeave();
    };
}

/**
 * 포인터의 자리를 요소의 CSS 변수(`--spot-x` · `--spot-y`)로 적어 준다.
 * 값은 요소의 왼쪽 위에서 잰 px 이다. 포인터가 요소 밖에 있어도 적으므로, 가까이 지나가기만 해도 불빛이 닿는다.
 * 포인터가 창 안에 없거나 동작 줄이기를 켰으면 변수를 두지 않는다. 쓰는 쪽이 기본값으로 불을 꺼 둔다.
 */
export function useCardSpotlight(ref: RefObject<HTMLElement | null>) {
    const isReduced = useReducedMotion();
    const { scrollY } = useScroll();

    useEffect(() => {
        const target = ref.current;
        // 동작 줄이기에서는 따라가지 않는다
        if (!target || isReduced) return;
        return subscribe(target);
    }, [ref, isReduced]);

    // 포인터는 가만히 있고 화면만 밀려도 카드의 자리가 바뀐다
    useMotionValueEvent(scrollY, 'change', schedule);
}
