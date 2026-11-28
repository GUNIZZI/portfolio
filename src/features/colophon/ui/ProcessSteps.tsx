'use client';

import { motion } from 'framer-motion';

import type { ColophonProcessStepData } from '@/entities/colophon/model/colophon.types';
import { cn } from '@/shared/util/cn';

import { processStepsVariants, processStepVariants } from '../model/colophon.motions';
import RoleBadge from './RoleBadge';

const STEP_CLASS = 'flex flex-1 flex-col gap-3 rounded-card border border-border-card bg-card p-5';

interface OwnProps {
    /** 과정의 단계. 페이지가 entity colophon 에서 읽어 넘긴다. 개수는 관리 화면에서 바꿀 수 있다 */
    steps: ColophonProcessStepData[];
    /**
     * 단계를 누르면 그 내용이 있는 섹션으로 스크롤하는가.
     * 그 섹션이 같은 페이지에 있을 때만 켠다. 홈의 제작 과정 섹션에서는 끈다
     */
    isLinked?: boolean;
}

/** 만든 과정의 단계. 화면에 처음 들어올 때 왼쪽부터 하나씩 나타난다. 한 번만 실행한다 */
export default function ProcessSteps({ steps, isLinked = false }: OwnProps) {
    return (
        <motion.ol
            variants={processStepsVariants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
            {steps.map((step, index) => (
                // 자리를 key 로 쓴다. 단계에 고유한 값이 없고, 이름은 관리 화면에서 고칠 수 있어 겹칠 수 있다
                <motion.li key={index} variants={processStepVariants} className="flex">
                    {isLinked ? (
                        <a
                            href={`#${step.sectionId}`}
                            className={cn(
                                // 배치와 모양
                                STEP_CLASS,
                                // hover
                                'hover:border-primary',
                                // 포커스. 테두리 밖의 표시는 global.css 의 :focus-visible 이 그린다
                                'focus-visible:border-primary',
                                // 모션
                                'transition-colors duration-fast ease-enter',
                            )}
                        >
                            <ProcessStepBody index={index} step={step} />
                        </a>
                    ) : (
                        <div className={STEP_CLASS}>
                            <ProcessStepBody index={index} step={step} />
                        </div>
                    )}
                </motion.li>
            ))}
        </motion.ol>
    );
}

/** 단계 하나의 내용. 번호 · 이름 · 역할 */
function ProcessStepBody({ index, step }: { index: number; step: ColophonProcessStepData }) {
    return (
        <>
            <span aria-hidden="true" className="font-marker text-stat text-primary">
                {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-lead font-bold text-strong">{step.title}</span>
            <RoleBadge role={step.role} />
        </>
    );
}
