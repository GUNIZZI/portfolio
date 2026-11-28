'use client';

import { useFieldArray } from 'react-hook-form';

import { COLOPHON_MIN, COLOPHON_SECTION } from '@/entities/colophon/model/colophon.constants';
import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';
import TextField from '@/shared/ui/textField/TextField';

import { useSectionForm } from '../model/useSectionForm';
import AddButton from './AddButton';
import ItemFieldset from './ItemFieldset';
import LinkFields from './LinkFields';
import RowActions from './RowActions';
import SectionShell from './SectionShell';

interface OwnProps {
    data: ColophonEditorData['develop'];
}

/**
 * 개발 과정 섹션. 단계를 더하고 빼고 순서를 바꾼다.
 * 단계마다 제목 · 작업 내용 · 대시보드 적용 사례와 그 단계의 링크를 고친다
 */
export default function DevelopForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        COLOPHON_SECTION.DEVELOP,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;
    const { fields, append, remove, move } = useFieldArray({ control, name: 'items' });

    function hndlAdd() {
        append({ title: '', work: '', example: '', links: [] });
    }

    return (
        <SectionShell
            section={COLOPHON_SECTION.DEVELOP}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                    const name = `${index + 1}단계`;
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
                                label="작업 내용"
                                {...register(`items.${index}.work`)}
                                error={itemErrors?.work?.message}
                            />
                            <TextField
                                isMultiline
                                label="대시보드 적용 사례"
                                {...register(`items.${index}.example`)}
                                error={itemErrors?.example?.message}
                            />
                            <LinkFields
                                control={control}
                                register={register}
                                stepIndex={index}
                                errors={itemErrors}
                            />
                        </ItemFieldset>
                    );
                })}
                <AddButton label="단계 추가" onClick={hndlAdd} />
            </div>
        </SectionShell>
    );
}
