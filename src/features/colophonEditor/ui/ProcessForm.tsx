'use client';

import { Controller, useFieldArray } from 'react-hook-form';

import {
    COLOPHON_MIN,
    COLOPHON_ROLE,
    COLOPHON_SECTION,
    COLOPHON_STEP_TARGETS,
} from '@/entities/colophon/model/colophon.constants';
import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';
import { Select } from '@/shared/ui/select/select';
import TextField from '@/shared/ui/textField/TextField';

import { ROLE_OPTIONS, SECTION_LABEL } from '../model/colophonEditor.constants';
import { useSectionForm } from '../model/useSectionForm';
import AddButton from './AddButton';
import ItemFieldset from './ItemFieldset';
import RowActions from './RowActions';
import SectionShell from './SectionShell';

interface OwnProps {
    data: ColophonEditorData['process'];
}

/** 단계를 누르면 내려가는 섹션. 이름은 이 화면의 섹션 이름과 같다 */
const TARGET_OPTIONS = COLOPHON_STEP_TARGETS.map((target) => ({
    code: target,
    name: SECTION_LABEL[target],
}));

/**
 * 과정 섹션. 단계를 더하고 빼고 순서를 바꾼다. 단계마다 이름 · 역할 · 이어지는 섹션을 고친다.
 * 새 단계는 맨 아래에 생기고, 역할은 「나」, 이어지는 섹션은 「디자인」 으로 시작한다
 */
export default function ProcessForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        COLOPHON_SECTION.PROCESS,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;
    const { fields, append, remove, move } = useFieldArray({ control, name: 'items' });

    function hndlAdd() {
        append({ title: '', role: COLOPHON_ROLE.ME, sectionId: COLOPHON_SECTION.DESIGN });
    }

    return (
        <SectionShell
            section={COLOPHON_SECTION.PROCESS}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                    const name = `${index + 1}단계`;
                    return (
                        <ItemFieldset
                            key={field.id}
                            legend={name}
                            actions={
                                <RowActions
                                    name={name}
                                    index={index}
                                    count={fields.length}
                                    min={COLOPHON_MIN.ITEMS}
                                    onMove={move}
                                    onRemove={remove}
                                />
                            }
                        >
                            <div className="flex flex-col gap-2 md:flex-row md:items-start">
                                <TextField
                                    afterLabel="이름"
                                    aria-label={`${name} 이름`}
                                    {...register(`items.${index}.title`)}
                                    error={errors.items?.[index]?.title?.message}
                                    className="w-full flex-1"
                                />
                                <Controller
                                    control={control}
                                    name={`items.${index}.role`}
                                    render={({ field: roleField }) => (
                                        <Select
                                            aria-label={`${name} 역할`}
                                            list={ROLE_OPTIONS}
                                            value={roleField.value}
                                            onChange={roleField.onChange}
                                            afterLabel="역할"
                                            className="w-full md:w-36"
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`items.${index}.sectionId`}
                                    render={({ field: targetField }) => (
                                        <Select
                                            aria-label={`${name} 이어지는 섹션`}
                                            list={TARGET_OPTIONS}
                                            value={targetField.value}
                                            onChange={targetField.onChange}
                                            afterLabel="이어지는 섹션"
                                            className="w-full md:w-56"
                                        />
                                    )}
                                />
                            </div>
                        </ItemFieldset>
                    );
                })}
                <AddButton label="단계 추가" onClick={hndlAdd} />
            </div>
        </SectionShell>
    );
}
