'use client';

import {
    type ChangeEvent,
    type DragEvent,
    type KeyboardEvent,
    useId,
    useRef,
    useState,
} from 'react';

import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button/button';
import { Input } from '@/shared/ui/input/input';
import { cn } from '@/shared/util/cn';

import { moveItem, moveItemTo, removeItem } from '../model/aboutEditor.utils';

interface OwnProps {
    /** 목록의 이름 */
    label?: string;
    items: string[];
    onChange: (items: string[]) => void;
    /** 남겨야 하는 최소 개수. 이만큼만 남으면 뺄 수 없다 */
    min: number;
    /** 새 항목을 적는 입력의 안내 문구 */
    addLabel: string;
    /** 카드 안에 넣어 쓰는지. 바탕을 카드보다 한 단계 밝은 면으로 바꿔 카드와 구분한다 */
    isNested?: boolean;
}

/**
 * 짧은 이름의 목록. 항목을 옆으로 늘어놓고, 자리가 모자라면 다음 줄로 넘긴다.
 * 항목을 끌어 순서를 바꾼다. 키보드로는 항목에 초점을 두고 ← → 로 옮긴다.
 * 놓을 자리는 항목 사이의 틈에 선을 세워 보여 주고, 놓았을 때 한 번만 옮긴다.
 * 끄는 동안 바로 옮기면 폭이 다른 항목끼리 자리가 계속 뒤바뀐다.
 */
export default function ChipListField({
    label,
    items,
    onChange,
    min,
    addLabel,
    isNested = false,
}: OwnProps) {
    const hintId = useId();
    const listRef = useRef<HTMLUListElement>(null);
    const [draft, setDraft] = useState('');
    /** 끌고 있는 항목의 자리 */
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    /** 놓을 자리. 이 자리의 항목 앞에 끼운다. 맨 끝은 items.length 다 */
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    const isRemovable = items.length > min;

    function hndlDraftChange(event: ChangeEvent<HTMLInputElement>) {
        setDraft(event.target.value);
    }

    function hndlAdd() {
        const text = draft.trim();
        if (text === '') return;
        onChange([...items, text]);
        setDraft('');
    }

    function hndlDraftKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        // 한글 조합 중의 Enter 는 글자를 확정하는 것이라 넘긴다
        if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
        // 폼이 제출되지 않게 막는다
        event.preventDefault();
        hndlAdd();
    }

    function hndlDragEnd() {
        setDragIndex(null);
        setDropIndex(null);
    }

    function hndlDrop(event: DragEvent<HTMLUListElement>) {
        event.preventDefault();
        if (dragIndex !== null && dropIndex !== null) {
            onChange(moveItemTo(items, dragIndex, dropIndex));
        }
        hndlDragEnd();
    }

    return (
        <fieldset className="flex flex-col gap-2">
            {label && <legend className="mb-3 text-lg font-semibold">{label}</legend>}
            <div
                className={cn(
                    'flex flex-col gap-2 rounded-xl p-4',
                    isNested ? 'bg-chip/50' : 'bg-card',
                )}
            >
                <ul
                    ref={listRef}
                    className="flex flex-wrap gap-2"
                    onDragOver={(event) => {
                        // 놓을 수 있는 곳임을 알린다. 막지 않으면 drop 이 오지 않는다
                        if (dragIndex !== null) event.preventDefault();
                    }}
                    onDrop={hndlDrop}
                >
                    {items.map((item, index) => {
                        const hndlDragStart = (event: DragEvent<HTMLLIElement>) => {
                            event.dataTransfer.effectAllowed = 'move';
                            // Firefox 는 데이터를 넣어야 끌기를 시작한다
                            event.dataTransfer.setData('text/plain', item);
                            setDragIndex(index);
                        };
                        const hndlDragOver = (event: DragEvent<HTMLLIElement>) => {
                            if (dragIndex === null) return;
                            const rect = event.currentTarget.getBoundingClientRect();
                            const isAfter = event.clientX > rect.left + rect.width / 2;
                            setDropIndex(isAfter ? index + 1 : index);
                        };
                        const hndlKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
                            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                            event.preventDefault();
                            const offset = event.key === 'ArrowLeft' ? -1 : 1;
                            const target = index + offset;
                            if (target < 0 || target >= items.length) return;
                            onChange(moveItem(items, index, offset));
                            // 초점이 옮긴 항목을 따라간다. 자리를 key 로 써서 요소는 그대로 남아 있다
                            listRef.current
                                ?.querySelectorAll<HTMLElement>('[data-chip-handle]')
                                [target]?.focus();
                        };
                        const hndlRemove = () => {
                            onChange(removeItem(items, index));
                        };

                        return (
                            // 자리를 key 로 쓴다. 같은 이름이 둘 있을 수 있어 값은 key 가 되지 못한다
                            <li
                                key={index}
                                draggable
                                onDragStart={hndlDragStart}
                                onDragOver={hndlDragOver}
                                onDragEnd={hndlDragEnd}
                                className={cn(
                                    // 배치와 모양
                                    'relative inline-flex min-h-7 cursor-grab items-center gap-1 rounded-full',
                                    'border border-border-card bg-muted-foreground/20 pr-1 pl-3',
                                    // 글자
                                    'text-caption text-strong',
                                    // 끌고 있는 항목
                                    dragIndex === index && 'border-dashed text-decorative',
                                    // 놓을 자리. 이 항목의 앞이면 왼쪽, 뒤면 오른쪽 틈에 선을 세운다.
                                    // 틈(8px) 안에 띄워 그려 항목이 밀리지 않는다
                                    dragIndex !== null &&
                                        dropIndex === index &&
                                        'before:absolute before:inset-y-0.5 before:-left-1.5 before:w-0.5 before:rounded-full before:bg-primary',
                                    dragIndex !== null &&
                                        dropIndex === index + 1 &&
                                        'after:absolute after:inset-y-0.5 after:-right-1.5 after:w-0.5 after:rounded-full after:bg-primary',
                                )}
                            >
                                <span
                                    data-chip-handle
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${item}, ${items.length}개 중 ${index + 1}번째`}
                                    aria-describedby={hintId}
                                    onKeyDown={hndlKeyDown}
                                    className="rounded-full focus-visible:outline-offset-2"
                                >
                                    {item}
                                </span>
                                <button
                                    type="button"
                                    aria-label={`${item} 빼기`}
                                    disabled={!isRemovable}
                                    onClick={hndlRemove}
                                    className={cn(
                                        'inline-flex size-5 items-center justify-center rounded-full text-muted-foreground',
                                        // hover 면은 바탕과 다른 색이어야 보인다
                                        isNested ? 'hover:bg-card' : 'hover:bg-chip',
                                        'hover:text-destructive',
                                        'focus-visible:outline-offset-0',
                                        'disabled:pointer-events-none disabled:text-decorative',
                                    )}
                                >
                                    <X className="size-3" aria-hidden="true" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <p id={hintId} className="text-2xs text-decorative">
                    끌어서 순서를 바꾼다. 키보드로는 항목에서 ← → 를 누른다.
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <Input
                        size="xs"
                        aria-label={`${label}에 더할 항목`}
                        placeholder={addLabel}
                        value={draft}
                        onChange={hndlDraftChange}
                        onKeyDown={hndlDraftKeyDown}
                        className="w-48"
                    />
                    <Button
                        size="xs"
                        effect="none"
                        disabled={draft.trim() === ''}
                        onClick={hndlAdd}
                        className="items-center"
                    >
                        + 추가
                    </Button>
                </div>
            </div>
        </fieldset>
    );
}
