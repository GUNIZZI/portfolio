'use client';

import { useFieldArray } from 'react-hook-form';

import { COLOPHON_MIN, COLOPHON_SECTION } from '@/entities/colophon/model/colophon.constants';
import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';
import { Separator } from '@/shared/ui/separator/separator';
import TextField from '@/shared/ui/textField/TextField';

import { useSectionForm } from '../model/useSectionForm';
import AddButton from './AddButton';
import ItemFieldset from './ItemFieldset';
import RowActions from './RowActions';
import SectionShell from './SectionShell';

interface OwnProps {
    data: ColophonEditorData['head'];
}

/** 머리 섹션. 한 줄 요약과 집계 기준일을 고치고, 숫자를 더하고 빼고 순서를 바꾼다 */
export default function HeadForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        COLOPHON_SECTION.HEAD,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;
    const { fields, append, remove, move } = useFieldArray({ control, name: 'stats' });

    function hndlAdd() {
        append({ label: '', value: '' });
    }

    return (
        <SectionShell
            section={COLOPHON_SECTION.HEAD}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <TextField
                isMultiline
                label="한 줄 요약"
                {...register('summary')}
                error={errors.summary?.message}
            />
            <Separator />
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">숫자</h3>
                <div className="grid gap-3 md:grid-cols-3">
                    {fields.map((field, index) => {
                        const name = `숫자 ${index + 1}`;
                        const statErrors = errors.stats?.[index];
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
                                    label="이름"
                                    {...register(`stats.${index}.label`)}
                                    error={statErrors?.label?.message}
                                />
                                <TextField
                                    label="값"
                                    {...register(`stats.${index}.value`)}
                                    error={statErrors?.value?.message}
                                />
                            </ItemFieldset>
                        );
                    })}
                </div>
                <AddButton label="통계 항목 추가" onClick={hndlAdd} />
                <TextField
                    label="집계 기준일"
                    {...register('statsDate')}
                    error={errors.statsDate?.message}
                    className="md:max-w-60"
                />
            </div>
        </SectionShell>
    );
}
