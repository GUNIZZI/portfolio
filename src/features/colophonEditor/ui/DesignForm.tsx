'use client';

import { Controller, useFieldArray } from 'react-hook-form';

import {
    COLOPHON_MIN,
    COLOPHON_ROLE,
    COLOPHON_SECTION,
} from '@/entities/colophon/model/colophon.constants';
import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';
import { Select } from '@/shared/ui/select/select';
import TextField from '@/shared/ui/textField/TextField';

import { ROLE_OPTIONS } from '../model/colophonEditor.constants';
import { useSectionForm } from '../model/useSectionForm';
import AddButton from './AddButton';
import ItemFieldset from './ItemFieldset';
import RowActions from './RowActions';
import SectionShell from './SectionShell';

interface OwnProps {
    data: ColophonEditorData['design'];
}

/** 디자인 섹션. 단락을 더하고 빼고 순서를 바꾼다. 단락마다 제목 · 역할 · 설명을 고친다 */
export default function DesignForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        COLOPHON_SECTION.DESIGN,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;
    const { fields, append, remove, move } = useFieldArray({ control, name: 'items' });

    function hndlAdd() {
        append({ title: '', role: COLOPHON_ROLE.ME, description: '' });
    }

    return (
        <SectionShell
            section={COLOPHON_SECTION.DESIGN}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                    const name = `단락 ${index + 1}`;
                    const itemErrors = errors.items?.[index];
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
                            <div className="flex flex-col gap-2 md:flex-row md:items-end">
                                <TextField
                                    label="제목"
                                    {...register(`items.${index}.title`)}
                                    error={itemErrors?.title?.message}
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
                            </div>
                            <TextField
                                isMultiline
                                label="설명"
                                {...register(`items.${index}.description`)}
                                error={itemErrors?.description?.message}
                            />
                        </ItemFieldset>
                    );
                })}
                <AddButton label="단락 추가" onClick={hndlAdd} />
            </div>
        </SectionShell>
    );
}
