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
    data: ColophonEditorData['guards'];
}

/** 장치 섹션. 장치를 더하고 빼고 순서를 바꾼다. 장치마다 이름 · 개수 · 점검 항목 · 적용 예를 고친다 */
export default function GuardsForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        COLOPHON_SECTION.GUARDS,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;
    const { fields, append, remove, move } = useFieldArray({ control, name: 'items' });

    function hndlAdd() {
        append({ name: '', count: '', prevents: '', example: '' });
    }

    return (
        <SectionShell
            section={COLOPHON_SECTION.GUARDS}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                    const name = `장치 ${index + 1}`;
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
                            <div className="grid gap-2 md:grid-cols-2">
                                <TextField
                                    label="이름"
                                    {...register(`items.${index}.name`)}
                                    error={itemErrors?.name?.message}
                                />
                                <TextField
                                    label="개수"
                                    {...register(`items.${index}.count`)}
                                    error={itemErrors?.count?.message}
                                />
                            </div>
                            <TextField
                                label="점검 항목"
                                {...register(`items.${index}.prevents`)}
                                error={itemErrors?.prevents?.message}
                            />
                            <TextField
                                isMultiline
                                label="적용 사례"
                                {...register(`items.${index}.example`)}
                                error={itemErrors?.example?.message}
                            />
                        </ItemFieldset>
                    );
                })}
                <AddButton label="점검 도구 추가" onClick={hndlAdd} />
            </div>
        </SectionShell>
    );
}
