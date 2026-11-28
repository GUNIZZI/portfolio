'use client';

import { Fragment } from 'react';

import { motion } from 'framer-motion';

import DrawnPath from '@/shared/ui/drawnPath/DrawnPath';
import { cn } from '@/shared/util/cn';

import { COLOPHON_LAYERS } from '../model/colophon.constants';
import { layerDiagramVariants } from '../model/colophon.motions';

/** 손으로 그은 아래쪽 화살표. 줄기와 촉을 한 선으로 잇는다. 짝수 · 홀수 번째가 반대로 휜다 */
const ARROW_PATHS = [
    'M24 3 C19 14 28 22 23 37 M14 28 L23 38 L33 29',
    'M24 3 C29 14 20 22 25 37 M15 29 L25 38 L34 28',
] as const;

/**
 * 계층과 의존 방향. 위 계층이 아래 계층을 가져온다.
 * 화면에 처음 들어올 때 화살표가 위에서 아래로 차례로 그려진다. 한 번만 실행한다.
 * 계층 이름과 설명은 글자라 그림 없이도 읽힌다. 화살표는 장식으로 두고 방향은 목록의 이름이 알린다.
 */
export default function LayerDiagram() {
    return (
        <motion.ol
            variants={layerDiagramVariants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            aria-label="계층과 의존 방향. 위 계층이 아래 계층을 가져온다"
            className="flex flex-col items-stretch"
        >
            {COLOPHON_LAYERS.map((layer, index) => (
                <Fragment key={layer.name}>
                    <li
                        className={cn(
                            // 배치와 모양
                            'flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-border-card bg-card px-5 py-4',
                            // 손으로 붙인 종이처럼 번갈아 조금씩 기울인다
                            index % 2 === 0 ? '-rotate-1' : 'rotate-1',
                        )}
                    >
                        <span className="font-marker text-stat text-strong">{layer.name}</span>
                        <span className="flex-1 text-sm text-muted-foreground">
                            {layer.description}
                        </span>
                        <span className="flex flex-wrap gap-1">
                            {layer.examples.map((example) => (
                                <span
                                    key={example}
                                    className="rounded-md bg-chip px-2 py-0.5 text-2xs text-muted-foreground"
                                >
                                    {example}
                                </span>
                            ))}
                        </span>
                    </li>
                    {layer.arrowClass ? (
                        <li aria-hidden="true" className="flex justify-center py-1">
                            <svg viewBox="0 0 48 42" className="h-10 w-12 overflow-visible">
                                <DrawnPath
                                    d={ARROW_PATHS[index % 2] ?? ARROW_PATHS[0]}
                                    className={layer.arrowClass}
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    trigger="parent"
                                />
                            </svg>
                        </li>
                    ) : null}
                </Fragment>
            ))}
        </motion.ol>
    );
}
