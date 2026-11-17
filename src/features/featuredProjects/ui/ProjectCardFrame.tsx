'use client';

import { type FocusEvent, type PointerEvent, type ReactNode, useRef } from 'react';

import { cn } from '@/shared/util/cn';

import {
    type CardEdge,
    EDGE_MASK,
    toCardEdge,
    toEdgeMaskImage,
} from '../model/featuredProjects.utils';

/** 키보드로 초점이 들어올 때는 들어온 쪽이 없다. 왼쪽 위에서 그린다 */
const DEFAULT_EDGE: CardEdge = 'topLeft';

interface OwnProps {
    children: ReactNode;
}

/**
 * 작업 카드의 바깥 틀. hover · 포커스 때 테두리 선을 그린다.
 *
 * 선은 마우스가 들어온 쪽에서 시작해 맞은편으로 그려지고, 나갈 때는 나간 쪽으로 지워진다.
 * 선을 움직이는 것이 아니라 완성된 테두리를 마스크로 가렸다가 드러낸다. 카드의 자리는 움직이지 않는다.
 * 선에서는 바깥으로 빛이 번진다. 빛도 선과 함께 가려졌다가 드러난다.
 * 마스크는 카드의 2배 크기다. 자리를 끝에서 끝으로 옮기는 동안 경계선이 카드를 꼭 한 번 지나간다.
 *
 * 스크립트가 붙기 전과 터치 화면에서는 아래 클래스의 기본값(왼쪽 위 → 오른쪽 아래)이 쓰인다.
 * 동작 줄이기에서는 지속시간이 0 이라 선이 바로 나타난다.
 */
export default function ProjectCardFrame({ children }: OwnProps) {
    const outlineRef = useRef<HTMLSpanElement>(null);

    /** 마스크를 한 변의 설정으로 바꾸고, 가려진 상태와 보이는 상태 사이를 오간다 */
    function draw(edge: CardEdge, isShown: boolean) {
        const outline = outlineRef.current;
        if (!outline) return;

        const mask = EDGE_MASK[edge];
        // 먼저 전환 없이 이 변의 출발 자리에 둔다. 출발 자리는 지금 보이는 모습과 같아 화면은 바뀌지 않는다
        outline.style.transition = 'none';
        outline.style.maskImage = toEdgeMaskImage(edge);
        outline.style.maskPosition = isShown ? mask.hidden : mask.shown;
        // 위 값을 브라우저가 먼저 적용하게 한다. 그러지 않으면 출발 자리를 건너뛰고 도착 자리만 본다
        outline.getBoundingClientRect();
        outline.style.transition = '';
        outline.style.maskPosition = isShown ? mask.shown : mask.hidden;
    }

    function toEdge(event: PointerEvent<HTMLElement>): CardEdge {
        const rect = event.currentTarget.getBoundingClientRect();
        return toCardEdge(
            (event.clientX - rect.left) / rect.width,
            (event.clientY - rect.top) / rect.height,
        );
    }

    function hndlPointerEnter(event: PointerEvent<HTMLElement>) {
        // 터치에는 들어오는 방향이 없다
        if (event.pointerType === 'touch') return;
        draw(toEdge(event), true);
    }

    function hndlPointerLeave(event: PointerEvent<HTMLElement>) {
        if (event.pointerType === 'touch') return;
        // 안의 링크에 초점이 남아 있으면 선을 지우지 않는다
        if (event.currentTarget.contains(document.activeElement)) return;
        draw(toEdge(event), false);
    }

    function hndlFocus() {
        draw(DEFAULT_EDGE, true);
    }

    function hndlBlur(event: FocusEvent<HTMLElement>) {
        // 마우스가 아직 올라가 있으면 선을 지우지 않는다
        if (event.currentTarget.matches(':hover')) return;
        draw(DEFAULT_EDGE, false);
    }

    return (
        <article
            onPointerEnter={hndlPointerEnter}
            onPointerLeave={hndlPointerLeave}
            onFocus={hndlFocus}
            onBlur={hndlBlur}
            className={cn(
                // 배치와 모양. 자리는 움직이지 않는다. hover 는 아래의 테두리 선이 맡는다
                'group relative flex w-full rounded-card border border-border-card bg-card',
                // 빛이 옆 카드 밑으로 들어가지 않게 위로 올린다
                'focus-within:z-raised hover:z-raised',
                // 다른 카드에 마우스나 초점이 가 있으면 이 카드는 흐려지고 어두워진다. 보고 있는 카드만 또렷하게 남는다.
                // 카드를 담은 격자에 group/cards 가 있어야 동작한다
                'group-has-[article:hover]/cards:not-hover:blur-[1px] group-has-[article:hover]/cards:not-hover:brightness-75',
                'group-has-[article:focus-within]/cards:not-focus-within:blur-[1px] group-has-[article:focus-within]/cards:not-focus-within:brightness-75',
                // 모션
                'transition-[filter] duration-base ease-move',
            )}
        >
            {/* 커지는 썸네일은 이 안에서 자른다. 카드 전체를 자르면 바깥으로 번지는 빛도 함께 잘린다 */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-card">
                {children}
            </div>
            {/*
              마스크는 이 바깥 칸에 건다. 카드보다 사방으로 16px 넓어서 빛이 번지는 자리까지 덮는다.
              선에 바로 걸면 선의 칸 밖에 있는 빛이 마스크에 잘린다
            */}
            <span
                ref={outlineRef}
                aria-hidden="true"
                className={cn(
                    // 배치와 모양
                    'pointer-events-none absolute -inset-4',
                    // 가리는 마스크. 평소에는 투명한 쪽이 카드를 덮는다
                    '[mask-image:linear-gradient(135deg,black_50%,transparent_50%)] [mask-size:200%_200%]',
                    '[mask-position:100%_100%]',
                    // hover · 포커스. 스크립트가 붙으면 위의 draw 가 이 값을 대신 정한다
                    'group-focus-within:[mask-position:0%_0%] group-hover:[mask-position:0%_0%]',
                    // 모션
                    'transition-[mask-position] duration-base ease-move',
                )}
            >
                {/* 테두리 선과 바깥으로 번지는 빛 */}
                <span className="absolute inset-4 rounded-card border border-brand shadow-glow" />
            </span>
        </article>
    );
}
