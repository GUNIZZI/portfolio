'use client';

import { ABOUT_SECTION } from '@/entities/about/model/about.constants';
import type { AboutEditorData, AboutHomeData } from '@/entities/about/model/about.types';
import { Separator } from '@/shared/ui/separator/separator';

import { replaceItem, requiredError } from '../model/aboutEditor.utils';
import { useSectionForm } from '../model/useSectionForm';
import ListField from './ListField';
import SectionShell from './SectionShell';
import TextField from './TextField';

interface OwnProps {
    data: AboutEditorData['home'];
}

type Stat = AboutHomeData['stats'][number];

const STAT_LABELS = ['나이', '프로젝트', '경력'];

/** 홈 소개 섹션. 소개 문단과 숫자 3개의 값 · 기호 · 이름을 고친다. 아이콘은 고치지 않는다 */
export default function HomeForm({ data }: OwnProps) {
    const form = useSectionForm(ABOUT_SECTION.HOME, data.content);
    const { value, setValue } = form;

    function hndlLinesChange(lines: string[]) {
        setValue({ ...value, lines });
    }

    function hndlStatChange(index: number, patch: Partial<Stat>) {
        const stat = value.stats[index];
        if (!stat) return;
        setValue({ ...value, stats: replaceItem(value.stats, index, { ...stat, ...patch }) });
    }

    return (
        <SectionShell
            section={ABOUT_SECTION.HOME}
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
                addLabel="문단 더하기"
            />
            <Separator />
            <div>
                <h3 className="mb-3 text-lg font-semibold">통계</h3>
                <div className="flex flex-col gap-3">
                    {value.stats.map((stat, index) => {
                        const isNumber = Number.isInteger(stat.value) && stat.value >= 0;
                        return (
                            // 자리를 key 로 쓴다. 3개로 고정이고 순서를 바꾸지 않는다
                            <fieldset
                                key={index}
                                className="grid grid-cols-[60_auto_auto_1fr] items-center gap-1 rounded-xl bg-card p-4"
                            >
                                <p className="text-caption text-muted-foreground">
                                    {STAT_LABELS[index]}
                                </p>
                                <TextField
                                    afterLabel="값"
                                    type="number"
                                    min={0}
                                    step={1}
                                    inputMode="numeric"
                                    value={Number.isNaN(stat.value) ? '' : stat.value}
                                    onChange={(event) => {
                                        hndlStatChange(index, {
                                            value: event.target.valueAsNumber,
                                        });
                                    }}
                                    error={isNumber ? undefined : '숫자만 입력해 주세요.'}
                                    className="w-32"
                                />
                                <TextField
                                    afterLabel="기호"
                                    value={stat.suffix}
                                    onChange={(event) => {
                                        hndlStatChange(index, { suffix: event.target.value });
                                    }}
                                    className="w-24"
                                />
                                <TextField
                                    afterLabel="문구"
                                    value={stat.label}
                                    onChange={(event) => {
                                        hndlStatChange(index, { label: event.target.value });
                                    }}
                                    error={requiredError('이름', stat.label)}
                                    className="min-w-48 flex-1"
                                />
                            </fieldset>
                        );
                    })}
                </div>
            </div>
        </SectionShell>
    );
}
