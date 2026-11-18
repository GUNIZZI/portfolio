'use client';

import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import type { ExperienceType } from '@/entities/experience/model/experience.schemas';
import { Button } from '@/shared/ui/button/button';
import ChipListField from '@/shared/ui/chipListField/ChipListField';
import { Select } from '@/shared/ui/select/select';
import TextField from '@/shared/ui/textField/TextField';
import { cn } from '@/shared/util/cn';

import type { ExperienceFormValue, ProjectOption } from '../model/experienceEditor.types';

/** 줄 안에서 포커스를 받는 자리. 줄을 더하고 빼고 옮긴 뒤 포커스를 보낼 곳을 가리킨다 */
export const ROW_TARGET = {
    NAME: 'name',
    UP: 'up',
    DOWN: 'down',
} as const;
export type RowTarget = (typeof ROW_TARGET)[keyof typeof ROW_TARGET];

/** 줄 안의 요소 id. 포커스를 보낼 때 이 id 로 찾는다 */
export function toRowTargetId(rowId: string, target: RowTarget): string {
    return `${rowId}-${target}`;
}

/**
 * 프로젝트 연결을 비우는 항목의 값. 폼에는 빈 문자열로 둔다.
 * Select 의 항목은 빈 값을 가질 수 없어 목록 안에서만 이 값을 쓴다. slug 에는 밑줄이 없어 겹치지 않는다
 */
const UNLINKED_CODE = '__unlinked__';

interface OwnProps {
    /** 이 줄의 요소 id 앞에 붙는 값. 폼의 id 에 줄의 자리를 붙인 것이다 */
    rowId: string;
    /** 폼의 projects 에서 이 줄의 자리. 0부터 센다 */
    index: number;
    isFirst: boolean;
    isLast: boolean;
    /** 프로젝트 연결에서 고를 수 있는 프로젝트 */
    options: ProjectOption[];
    onMove: (offset: -1 | 1) => void;
    onRemove: () => void;
}

/**
 * 경력의 프로젝트 1줄. 이름 · 시기 · 프로젝트 연결 · 기술 태그와 위 · 아래 · 빼기 버튼이 있다.
 * 값과 오류 문구는 감싼 폼(FormProvider)에서 읽는다.(ExperienceForm.tsx)
 */
export default function ProjectRow({
    rowId,
    index,
    isFirst,
    isLast,
    options,
    onMove,
    onRemove,
}: OwnProps) {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<ExperienceFormValue, unknown, ExperienceType>();
    const name = `${index + 1}번째 프로젝트`;
    const rowErrors = errors.projects?.[index];
    const linkList = [
        // 고르면 연결을 비운다. 이름은 고르지 않았을 때 Select 가 보여 주는 글자와 같다
        // { code: UNLINKED_CODE, name: '선택없음' },
        ...options.map((option) => ({ code: option.slug, name: option.title })),
    ];

    return (
        <li
            className={cn(
                'flex flex-col items-end gap-2 rounded-xl bg-card p-4',
                'md:flex-row md:items-center',
            )}
        >
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex flex-col items-end gap-2 md:flex-row md:items-start">
                    <TextField
                        id={toRowTargetId(rowId, ROW_TARGET.NAME)}
                        aria-label={`${name} 이름`}
                        afterLabel="이름"
                        {...register(`projects.${index}.name`)}
                        error={rowErrors?.name?.message}
                        className="flex-1"
                    />
                    <TextField
                        aria-label={`${name} 시기`}
                        afterLabel="시기"
                        placeholder="2025.06"
                        inputMode="decimal"
                        {...register(`projects.${index}.date`)}
                        error={rowErrors?.date?.message}
                        className="md:w-30"
                    />
                    <Controller
                        control={control}
                        name={`projects.${index}.workSlug`}
                        render={({ field }) => (
                            <Select
                                aria-label={`${name} 연결`}
                                list={linkList}
                                afterLabel="연결"
                                // 이어 둔 프로젝트가 지워졌으면 고르지 않은 것으로 그린다.(docs/plan/admin/experiences/wireframe.html S-02)
                                value={
                                    options.some((option) => option.slug === field.value)
                                        ? field.value
                                        : ''
                                }
                                onChange={(code) => {
                                    field.onChange(code === UNLINKED_CODE ? '' : code);
                                }}
                                className="md:w-56"
                            />
                        )}
                    />
                </div>
                <Controller
                    control={control}
                    name={`projects.${index}.tags`}
                    render={({ field }) => (
                        <ChipListField
                            items={field.value}
                            onChange={field.onChange}
                            min={0}
                            addLabel="기술 태그"
                            inputLabel={`${name}에 더할 기술 태그`}
                            isNested
                        />
                    )}
                />
            </div>
            <div className="flex min-h-9 items-center gap-1">
                <Button
                    id={toRowTargetId(rowId, ROW_TARGET.UP)}
                    variant="secondary"
                    size="2xs"
                    aria-label={`${name} 위로`}
                    disabled={isFirst}
                    onClick={() => {
                        onMove(-1);
                    }}
                    className="flex w-6.5 items-center justify-center p-0"
                >
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                    id={toRowTargetId(rowId, ROW_TARGET.DOWN)}
                    variant="secondary"
                    size="2xs"
                    aria-label={`${name} 아래로`}
                    disabled={isLast}
                    onClick={() => {
                        onMove(1);
                    }}
                    className="flex w-6.5 items-center justify-center p-0"
                >
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                    variant="destructive"
                    size="2xs"
                    aria-label={`${name} 빼기`}
                    onClick={onRemove}
                    className="flex w-6.5 items-center justify-center p-0"
                >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
            </div>
        </li>
    );
}
