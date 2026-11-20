'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/shared/util/cn';
import { DURATION, EASE } from '@/style/tokens/motion';

import type { ProjectFilterItem } from '../model/projectExplorer.types';

interface OwnProps {
    items: ProjectFilterItem[];
    categories: string[];
    /** 고른 분류. null 이면 전체다 */
    selected: string | null;
    /** 없으면 버튼을 눌러도 바뀌지 않는다. 주소를 읽기 전에 보여 주는 화면이 그렇게 쓴다 */
    onSelect?: (category: string | null) => void;
}

/**
 * 분류 버튼과 작업 격자의 모양.
 * 분류를 바꾸면 남는 카드는 자리를 옮기고 빠지는 카드는 사라진다. 동작 줄이기에서는 바로 바뀐다.
 */
export default function ProjectFilterGridView({ items, categories, selected, onSelect }: OwnProps) {
    const visible = selected ? items.filter((item) => item.category === selected) : items;
    const options: { label: string; value: string | null }[] = [
        { label: '전체', value: null },
        ...categories.map((category) => ({ label: category, value: category })),
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* 좁은 화면에서는 버튼 줄을 가로로 민다 */}
            <div
                role="group"
                aria-label="분류로 거르기"
                className="flex gap-2 overflow-x-auto py-1"
            >
                {options.map((option) => {
                    const isSelected = option.value === selected;
                    return (
                        <button
                            key={option.label}
                            type="button"
                            aria-pressed={isSelected}
                            // 주소를 읽기 전의 화면에서는 눌러도 바뀌지 않는다. 눌리는 것처럼 보이지 않게 막아 둔다
                            disabled={!onSelect}
                            onClick={() => onSelect?.(option.value)}
                            className={cn(
                                // 배치와 모양
                                'min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold',
                                // 상태
                                isSelected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border-card bg-card text-strong hover:border-brand',
                                // 모션
                                'transition-colors duration-fast ease-move',
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: DURATION.base, ease: EASE.move }}
                            className="flex"
                        >
                            {item.card}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
