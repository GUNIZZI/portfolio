'use client';

import { type ReactNode, useRef } from 'react';

import { cn } from '@/shared/util/cn';

import { useCardSpotlight } from '../model/useCardSpotlight';

interface OwnProps {
    children: ReactNode;
}

/**
 * 작업 카드의 바깥 틀. 포인터 둘레에 켜진 둥근 불빛이 닿는 만큼만 테두리 선을 보여 준다.
 *
 * 완성된 테두리를 둥근 마스크로 가려 두고, 마스크의 가운데를 포인터에 맞춘다. 가운데가 가장 밝고 바깥으로 갈수록 옅어진다.
 * 포인터가 카드 밖에 있어도 불빛이 닿으면 보이므로, 카드 사이를 지날 때는 양쪽 카드의 선이 함께 보인다.
 * 선에서는 바깥으로 빛이 번진다. 빛도 선과 함께 가려진다. 카드의 자리는 움직이지 않는다.
 * 선과 빛의 색은 보라색과 하늘색 사이를 오간다. 카드마다 같은 때에 바뀐다.
 *
 * 키보드로 초점이 들어오면 포인터가 없으므로 테두리를 다 보여 준다.
 * 동작 줄이기에서는 불빛이 따라가지 않고, hover 한 카드의 테두리를 다 보여 준다.
 * 터치 화면에는 포인터가 없어 선이 보이지 않는다.
 */
export default function ProjectCardFrame({ children }: OwnProps) {
    const outlineRef = useRef<HTMLSpanElement>(null);
    useCardSpotlight(outlineRef);

    return (
        <article
            className={cn(
                // 배치와 모양. 자리는 움직이지 않는다. hover 는 아래의 테두리 선이 맡는다
                'group relative flex w-full rounded-card border border-border-card bg-card',
                // 빛이 옆 카드 밑으로 들어가지 않게 위로 올린다
                'focus-within:z-raised hover:z-raised',
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
                    // 둥근 불빛. 가운데는 useCardSpotlight 가 적는 포인터의 자리다. 값이 없으면 화면 밖에 두어 불을 꺼 둔다
                    '[mask-image:radial-gradient(circle_12rem_at_var(--spot-x,-100vmax)_var(--spot-y,-100vmax),black_25%,transparent)]',
                    // 키보드 초점과 동작 줄이기의 hover 는 가리지 않고 다 보여 준다
                    'group-has-[:focus-visible]:[mask-image:none] motion-reduce:group-hover:[mask-image:none]',
                )}
            >
                {/*
                  테두리 선과 바깥으로 번지는 빛. 색은 보라색과 하늘색 사이를 서서히 오간다.
                  동작 줄이기에서는 보라색에 머문다
                */}
                <span className="absolute inset-4 rounded-card border border-brand shadow-glow motion-safe:animate-card-outline" />
            </span>
        </article>
    );
}
