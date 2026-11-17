'use client';

import type { ChangeEvent } from 'react';

import { ABOUT_COUNT, ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData } from '@/entities/about/model/about.types';
import { Separator } from '@/shared/ui/separator/separator';

import { useSectionForm } from '../model/useSectionForm';
import ChipListField from './ChipListField';
import ListField from './ListField';
import SectionShell from './SectionShell';
import TextField from './TextField';

interface OwnProps {
    data: AboutEditorData['intro'];
}

/** 인트로 섹션. 소개 문단 · 성장 경로 · 그 아래 한 줄을 고친다 */
export default function IntroForm({ data }: OwnProps) {
    const form = useSectionForm(ABOUT_SECTION.INTRO, data.content);
    const { value, setValue } = form;

    function hndlLinesChange(lines: string[]) {
        setValue({ ...value, lines });
    }

    function hndlGrowthPathChange(growthPath: string[]) {
        setValue({ ...value, growthPath });
    }

    function hndlNoteChange(event: ChangeEvent<HTMLInputElement>) {
        setValue({ ...value, growthPathNote: event.target.value });
    }

    return (
        <SectionShell
            section={ABOUT_SECTION.INTRO}
            updatedAtText={data.updatedAtText}
            blockedReason={form.blockedReason}
            isPending={form.isPending}
            onSave={form.save}
        >
            <ListField
                label="소개 문단"
                items={value.lines}
                onChange={hndlLinesChange}
                min={1}
                addLabel="+ 문단 더하기"
                isMultiline
            />
            <Separator />
            <ChipListField
                label="성장 경로"
                items={value.growthPath}
                onChange={hndlGrowthPathChange}
                min={ABOUT_COUNT.GROWTH_PATH_MIN}
                addLabel="항목 이름"
            />
            <Separator />
            <div>
                <p className="mb-3 text-lg font-semibold">성장 경로 아래 한줄</p>
                <TextField value={value.growthPathNote} onChange={hndlNoteChange} />
            </div>
        </SectionShell>
    );
}
