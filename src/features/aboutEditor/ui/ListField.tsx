'use client';

import type { ChangeEvent } from 'react';

import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui/button/button';

import { moveItem, removeItem, replaceItem, requiredError } from '../model/aboutEditor.utils';
import TextField from './TextField';

interface OwnProps {
    /** 목록의 이름. 줄마다 번호를 붙여 입력의 이름으로 쓴다 */
    label?: string;
    items: string[];
    onChange: (items: string[]) => void;
    /** 남겨야 하는 최소 개수. 이만큼만 남으면 빼기를 누를 수 없다 */
    min: number;
    /** 더하기 버튼의 문구 */
    addLabel: string;
    /** 여러 줄 입력으로 그릴지 */
    isMultiline?: boolean;
}

/** 길이가 바뀌는 목록. 줄마다 위 · 아래 · 빼기 버튼이 있고, 더하면 맨 아래에 빈 줄이 생긴다 */
export default function ListField({
    label,
    items,
    onChange,
    min,
    addLabel,
    isMultiline = false,
}: OwnProps) {
    function hndlAdd() {
        onChange([...items, '']);
    }

    return (
        <fieldset className="flex flex-col gap-3">
            {label && <legend className="mb-3 text-lg font-semibold">{label}</legend>}
            {items.map((item, index) => {
                const name = `${label} ${index + 1}`;
                const hndlChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    onChange(replaceItem(items, index, event.target.value));
                };
                const hndlUp = () => {
                    onChange(moveItem(items, index, -1));
                };
                const hndlDown = () => {
                    onChange(moveItem(items, index, 1));
                };
                const hndlRemove = () => {
                    onChange(removeItem(items, index));
                };

                return (
                    // 자리를 key 로 쓴다. 줄에 고유한 값이 없다. 입력 값은 상태가 갖고 있어 자리가 바뀌어도 어긋나지 않는다
                    <div key={index} className="flex items-center gap-2 rounded-lg bg-card p-4">
                        <TextField
                            afterLabel={name}
                            isMultiline={isMultiline}
                            value={item}
                            onChange={hndlChange}
                            error={requiredError(label ?? '', item)}
                            className="min-w-60 flex-1"
                        />
                        <Button
                            variant="secondary"
                            size="2xs"
                            effect="none"
                            aria-label={`${name} 위로`}
                            disabled={index === 0}
                            onClick={hndlUp}
                            className="items-center"
                        >
                            <ArrowUp className="size-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="2xs"
                            effect="none"
                            aria-label={`${name} 아래로`}
                            disabled={index === items.length - 1}
                            onClick={hndlDown}
                            className="items-center"
                        >
                            <ArrowDown className="size-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="2xs"
                            effect="none"
                            aria-label={`${name} 빼기`}
                            disabled={items.length <= min}
                            onClick={hndlRemove}
                            className="items-center"
                        >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                        </Button>
                    </div>
                );
            })}
            <div className="text-center">
                <Button
                    variant="secondary"
                    size="sm"
                    effect="none"
                    onClick={hndlAdd}
                    className="items-center px-10"
                >
                    {addLabel}
                </Button>
            </div>
        </fieldset>
    );
}
