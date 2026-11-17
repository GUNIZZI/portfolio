'use client';

import { ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData, AboutSkillGroupData } from '@/entities/about/model/about.types';

import { replaceItem, requiredError } from '../model/aboutEditor.utils';
import { useSectionForm } from '../model/useSectionForm';
import ChipListField from './ChipListField';
import SectionShell from './SectionShell';
import TextField from './TextField';

interface OwnProps {
    data: AboutEditorData['skillGroups'];
}

/** 기술 묶음 섹션. 8개 묶음의 이름 · 쓴 곳 · 기술 이름을 고친다. 묶음의 개수는 바꾸지 않는다 */
export default function SkillGroupsForm({ data }: OwnProps) {
    const form = useSectionForm(ABOUT_SECTION.SKILL_GROUPS, data.content);
    const { value, setValue } = form;

    function hndlChange(index: number, patch: Partial<AboutSkillGroupData>) {
        const group = value.items[index];
        if (!group) return;
        setValue({ items: replaceItem(value.items, index, { ...group, ...patch }) });
    }

    return (
        <SectionShell
            section={ABOUT_SECTION.SKILL_GROUPS}
            updatedAtText={data.updatedAtText}
            blockedReason={form.blockedReason}
            isPending={form.isPending}
            onSave={form.save}
        >
            <div className="flex flex-col gap-3">
                {value.items.map((group, index) => {
                    return (
                        // 자리를 key 로 쓴다. 8개로 고정이고 순서를 바꾸지 않는다
                        <div key={index} className="flex flex-col gap-1 rounded-xl bg-card p-4">
                            <TextField
                                afterLabel="이름"
                                size="xl"
                                value={group.name}
                                onChange={(event) => {
                                    hndlChange(index, { name: event.target.value });
                                }}
                                error={requiredError('이름', group.name)}
                            />
                            <TextField
                                afterLabel="내용"
                                value={group.usage}
                                onChange={(event) => {
                                    hndlChange(index, { usage: event.target.value });
                                }}
                                error={requiredError('쓴 곳', group.usage)}
                            />
                            <ChipListField
                                items={group.items}
                                onChange={(items) => {
                                    hndlChange(index, { items });
                                }}
                                min={1}
                                addLabel="Skill 이름"
                                isNested
                            />
                        </div>
                    );
                })}
            </div>
        </SectionShell>
    );
}
