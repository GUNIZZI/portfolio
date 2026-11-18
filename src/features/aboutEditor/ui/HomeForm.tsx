'use client';

import { Controller } from 'react-hook-form';

import { ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData } from '@/entities/about/model/about.types';
import { Separator } from '@/shared/ui/separator/separator';
import TextField from '@/shared/ui/textField/TextField';
import { cn } from '@/shared/util/cn';

import { toLineErrors } from '../model/aboutEditor.utils';
import { useSectionForm } from '../model/useSectionForm';
import ListField from './ListField';
import SectionShell from './SectionShell';

interface OwnProps {
    data: AboutEditorData['home'];
}

const STAT_LABELS = ['나이', '프로젝트', '경력'];

/** 홈 소개 섹션. 소개 문단과 숫자 3개의 값 · 기호 · 이름을 고친다. 아이콘은 고치지 않는다 */
export default function HomeForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        ABOUT_SECTION.HOME,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;

    return (
        <SectionShell
            section={ABOUT_SECTION.HOME}
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
                    />
                )}
            />
            <Separator />
            <div>
                <h3 className="mb-3 text-lg font-semibold">통계</h3>
                <div className="flex flex-col gap-3">
                    {data.content.stats.map((_stat, index) => {
                        const statErrors = errors.stats?.[index];
                        return (
                            // 자리를 key 로 쓴다. 3개로 고정이고 순서를 바꾸지 않는다
                            <fieldset
                                key={index}
                                className={cn(
                                    'flex min-w-0 flex-col gap-1 rounded-xl bg-card p-4',
                                    'md:grid md:grid-cols-[60px_auto_1fr] md:items-center',
                                )}
                            >
                                <p className="text-caption text-muted-foreground">
                                    {STAT_LABELS[index]}
                                </p>
                                <div className="flex w-full flex-1 gap-1">
                                    <TextField
                                        afterLabel="값"
                                        type="number"
                                        min={0}
                                        step={1}
                                        inputMode="numeric"
                                        // 숫자로 바꿔 스키마에 넘긴다. 비운 입력은 NaN 이 되어 스키마가 걸러 낸다
                                        {...register(`stats.${index}.value`, {
                                            valueAsNumber: true,
                                        })}
                                        error={statErrors?.value?.message}
                                        className="max-w-30 min-w-0 flex-1"
                                    />
                                    <TextField
                                        afterLabel="기호"
                                        {...register(`stats.${index}.suffix`)}
                                        className="w-25"
                                    />
                                </div>
                                <TextField
                                    afterLabel="문구"
                                    {...register(`stats.${index}.label`)}
                                    error={statErrors?.label?.message}
                                    className="flex-1"
                                />
                            </fieldset>
                        );
                    })}
                </div>
            </div>
        </SectionShell>
    );
}
