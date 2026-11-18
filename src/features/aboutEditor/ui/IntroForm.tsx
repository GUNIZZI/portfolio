'use client';

import { Controller } from 'react-hook-form';

import { ABOUT_COUNT, ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData } from '@/entities/about/model/about.types';
import ChipListField from '@/shared/ui/chipListField/ChipListField';
import { Separator } from '@/shared/ui/separator/separator';
import TextField from '@/shared/ui/textField/TextField';

import { toLineErrors } from '../model/aboutEditor.utils';
import { useSectionForm } from '../model/useSectionForm';
import ListField from './ListField';
import SectionShell from './SectionShell';

interface OwnProps {
    data: AboutEditorData['intro'];
}

/** 인트로 섹션. 소개 문단 · 성장 경로 · 그 아래 한 줄을 고친다 */
export default function IntroForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        ABOUT_SECTION.INTRO,
        data.content,
    );
    const { control, register } = form;

    return (
        <SectionShell
            section={ABOUT_SECTION.INTRO}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <Controller
                control={control}
                name="lines"
                render={({ field, fieldState }) => (
                    <ListField
                        label="소개 문단"
                        items={field.value}
                        onChange={field.onChange}
                        errors={toLineErrors(fieldState.error)}
                        min={1}
                        addLabel="+ 문단 더하기"
                        isMultiline
                    />
                )}
            />
            <Separator />
            <Controller
                control={control}
                name="growthPath"
                render={({ field }) => (
                    <ChipListField
                        label="성장 경로"
                        items={field.value}
                        onChange={field.onChange}
                        min={ABOUT_COUNT.GROWTH_PATH_MIN}
                        addLabel="항목 이름"
                    />
                )}
            />
            <Separator />
            <div>
                <p className="mb-3 text-lg font-semibold">성장 경로 아래 한줄</p>
                <TextField {...register('growthPathNote')} />
            </div>
        </SectionShell>
    );
}
