'use client';

import { ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData } from '@/entities/about/model/about.types';
import TextField from '@/shared/ui/textField/TextField';

import { useSectionForm } from '../model/useSectionForm';
import SectionShell from './SectionShell';

interface OwnProps {
    data: AboutEditorData['principles'];
}

/** 일하는 방식 섹션. 4가지의 제목과 설명을 고친다. 개수는 바꾸지 않는다 */
export default function PrinciplesForm({ data }: OwnProps) {
    const { form, isBlocked, isPending, hndlSubmit } = useSectionForm(
        ABOUT_SECTION.PRINCIPLES,
        data.content,
    );
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <SectionShell
            section={ABOUT_SECTION.PRINCIPLES}
            updatedAtText={data.updatedAtText}
            isBlocked={isBlocked}
            isPending={isPending}
            onSubmit={hndlSubmit}
        >
            <div className="flex flex-col gap-3">
                {data.content.items.map((_item, index) => {
                    const order = index + 1;
                    const itemErrors = errors.items?.[index];
                    return (
                        // 자리를 key 로 쓴다. 4개로 고정이고 순서를 바꾸지 않는다
                        <fieldset
                            key={index}
                            className="flex items-center gap-4 rounded-xl bg-card p-4"
                        >
                            {/* <legend className="text-body font-semibold text-strong">{order}번째</legend> */}
                            <p className="text-caption text-muted-foreground">{order}번째</p>
                            <div className="flex flex-1 flex-col gap-1">
                                <TextField
                                    {...register(`items.${index}.title`)}
                                    error={itemErrors?.title?.message}
                                />
                                <TextField
                                    isMultiline
                                    {...register(`items.${index}.description`)}
                                    error={itemErrors?.description?.message}
                                />
                            </div>
                        </fieldset>
                    );
                })}
            </div>
        </SectionShell>
    );
}
