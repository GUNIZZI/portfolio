'use client';

import { Controller, useFieldArray } from 'react-hook-form';

import {
    COLOPHON_FONT_FACE,
    COLOPHON_FONT_FACE_NAME,
    COLOPHON_MIN,
    COLOPHON_SECTION,
} from '@/entities/colophon/model/colophon.constants';
import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';
import ChipListField from '@/shared/ui/chipListField/ChipListField';
import { Select } from '@/shared/ui/select/select';
import { Separator } from '@/shared/ui/separator/separator';
import TextField from '@/shared/ui/textField/TextField';

import { useSectionForm } from '../model/useSectionForm';
import AddButton from './AddButton';
import ItemFieldset from './ItemFieldset';
import RowActions from './RowActions';
import SectionShell from './SectionShell';

interface OwnProps {
    data: ColophonEditorData['stack'];
}

/** 폰트의 이름을 적을 견본 글꼴. 이 사이트가 불러오는 글꼴만 고를 수 있다 */
const FACE_OPTIONS = Object.values(COLOPHON_FONT_FACE).map((face) => ({
    code: face,
    name: COLOPHON_FONT_FACE_NAME[face],
}));

/**
 * 기술과 폰트 섹션. 기술 이름과 폰트를 더하고 빼고 순서를 바꾼다.
 * 폰트마다 이름 · 견본 글꼴 · 쓰는 곳 · 라이선스를 고친다. 새 폰트의 견본 글꼴은 본문 글꼴로 시작한다
 */
export default function StackForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        COLOPHON_SECTION.STACK,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;
    const { fields, append, remove, move } = useFieldArray({ control, name: 'fonts' });

    function hndlAdd() {
        append({ name: '', face: COLOPHON_FONT_FACE.SANS, usage: '', license: '' });
    }

    return (
        <SectionShell
            section={COLOPHON_SECTION.STACK}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <Controller
                control={control}
                name="techs"
                render={({ field }) => (
                    <ChipListField
                        label="기술"
                        items={field.value}
                        onChange={field.onChange}
                        min={COLOPHON_MIN.ITEMS}
                        addLabel="기술 이름"
                    />
                )}
            />
            <Separator />
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">폰트</h3>
                <div className="grid gap-3 md:grid-cols-3">
                    {fields.map((field, index) => {
                        const name = `폰트 ${index + 1}`;
                        const fontErrors = errors.fonts?.[index];
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
                                    {...register(`fonts.${index}.name`)}
                                    error={fontErrors?.name?.message}
                                />
                                <Controller
                                    control={control}
                                    name={`fonts.${index}.face`}
                                    render={({ field: faceField }) => (
                                        <Select
                                            aria-label={`${name} 견본 글꼴`}
                                            list={FACE_OPTIONS}
                                            value={faceField.value}
                                            onChange={faceField.onChange}
                                            afterLabel="견본 글꼴"
                                            className="w-full"
                                        />
                                    )}
                                />
                                <TextField
                                    label="사용 위치"
                                    {...register(`fonts.${index}.usage`)}
                                    error={fontErrors?.usage?.message}
                                />
                                <TextField
                                    label="라이선스"
                                    {...register(`fonts.${index}.license`)}
                                    error={fontErrors?.license?.message}
                                />
                            </ItemFieldset>
                        );
                    })}
                </div>
                <AddButton label="폰트 추가" onClick={hndlAdd} />
            </div>
        </SectionShell>
    );
}
