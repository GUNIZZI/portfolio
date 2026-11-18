'use client';

import { Controller } from 'react-hook-form';

import { ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData } from '@/entities/about/model/about.types';
import ChipListField from '@/shared/ui/chipListField/ChipListField';
import TextField from '@/shared/ui/textField/TextField';

import { useSectionForm } from '../model/useSectionForm';
import SectionShell from './SectionShell';

interface OwnProps {
    data: AboutEditorData['skillGroups'];
}

/** 기술 묶음 섹션. 8개 묶음의 이름 · 쓴 곳 · 기술 이름을 고친다. 묶음의 개수는 바꾸지 않는다 */
export default function SkillGroupsForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        ABOUT_SECTION.SKILL_GROUPS,
        data.content,
    );
    const {
        control,
        register,
        formState: { errors },
    } = form;

    return (
        <SectionShell
            section={ABOUT_SECTION.SKILL_GROUPS}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <div className="flex flex-col gap-3">
                {data.content.items.map((_group, index) => {
                    const groupErrors = errors.items?.[index];
                    return (
                        // 자리를 key 로 쓴다. 8개로 고정이고 순서를 바꾸지 않는다
                        <div key={index} className="flex flex-col gap-1 rounded-xl bg-card p-4">
                            <TextField
                                afterLabel="이름"
                                size="xl"
                                {...register(`items.${index}.name`)}
                                error={groupErrors?.name?.message}
                            />
                            <TextField
                                afterLabel="내용"
                                {...register(`items.${index}.usage`)}
                                error={groupErrors?.usage?.message}
                            />
                            <Controller
                                control={control}
                                name={`items.${index}.items`}
                                render={({ field }) => (
                                    <ChipListField
                                        items={field.value}
                                        onChange={field.onChange}
                                        min={1}
                                        addLabel="Skill 이름"
                                        isNested
                                    />
                                )}
                            />
                        </div>
                    );
                })}
            </div>
        </SectionShell>
    );
}
