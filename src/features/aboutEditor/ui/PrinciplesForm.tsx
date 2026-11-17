'use client';

import { ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData } from '@/entities/about/model/about.types';

import { replaceItem, requiredError } from '../model/aboutEditor.utils';
import { useSectionForm } from '../model/useSectionForm';
import SectionShell from './SectionShell';
import TextField from './TextField';

interface OwnProps {
    data: AboutEditorData['principles'];
}

/** 일하는 방식 섹션. 4가지의 제목과 설명을 고친다. 개수는 바꾸지 않는다 */
export default function PrinciplesForm({ data }: OwnProps) {
    const form = useSectionForm(ABOUT_SECTION.PRINCIPLES, data.content);
    const { value, setValue } = form;

    function hndlChange(index: number, field: 'title' | 'description', text: string) {
        const item = value.items[index];
        if (!item) return;
        setValue({ items: replaceItem(value.items, index, { ...item, [field]: text }) });
    }

    return (
        <SectionShell
            section={ABOUT_SECTION.PRINCIPLES}
            updatedAtText={data.updatedAtText}
            blockedReason={form.blockedReason}
            isPending={form.isPending}
            onSave={form.save}
        >
            {value.items.map((item, index) => {
                const order = index + 1;
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
                                value={item.title}
                                onChange={(event) => {
                                    hndlChange(index, 'title', event.target.value);
                                }}
                                error={requiredError('제목', item.title)}
                            />
                            <TextField
                                isMultiline
                                value={item.description}
                                onChange={(event) => {
                                    hndlChange(index, 'description', event.target.value);
                                }}
                                error={requiredError('설명', item.description)}
                            />
                        </div>
                    </fieldset>
                );
            })}
        </SectionShell>
    );
}
