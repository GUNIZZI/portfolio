'use client';

import { useFieldArray } from 'react-hook-form';

import { COLOPHON_MIN, COLOPHON_SECTION } from '@/entities/colophon/model/colophon.constants';
import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';
import TextField from '@/shared/ui/textField/TextField';

import { useSectionForm } from '../model/useSectionForm';
import AddButton from './AddButton';
import ItemFieldset from './ItemFieldset';
import RowActions from './RowActions';
import SectionShell from './SectionShell';

interface OwnProps {
    data: ColophonEditorData['human'];
}

/** 사람이 한 일 섹션. 항목을 더하고 빼고 순서를 바꾼다. 항목마다 제목과 설명을 고친다 */
export default function HumanForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        COLOPHON_SECTION.HUMAN,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;
    const { fields, append, remove, move } = useFieldArray({ control, name: 'items' });

    function hndlAdd() {
        append({ title: '', description: '' });
    }

    return (
        <SectionShell
            section={COLOPHON_SECTION.HUMAN}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                    const name = `항목 ${index + 1}`;
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
                            <TextField
                                label="제목"
                                {...register(`items.${index}.title`)}
                                error={itemErrors?.title?.message}
                            />
                            <TextField
                                isMultiline
                                label="설명"
                                {...register(`items.${index}.description`)}
                                error={itemErrors?.description?.message}
                            />
                        </ItemFieldset>
                    );
                })}
                <AddButton label="항목 추가" onClick={hndlAdd} />
            </div>
        </SectionShell>
    );
}
