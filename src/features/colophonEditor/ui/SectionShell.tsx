import type { ReactNode, SyntheticEvent } from 'react';

import { Save } from 'lucide-react';

import type { ColophonSection } from '@/entities/colophon/model/colophon.constants';
import { Button } from '@/shared/ui/button/button';
import Panel from '@/shared/ui/panel/Panel';

import { SECTION_LABEL, SECTION_PLACE } from '../model/colophonEditor.constants';

interface OwnProps {
    section: ColophonSection;
    /** 수정 일시 문구. 저장한 적이 없으면 null */
    updatedAtText: string | null;
    /** 저장 버튼을 누를 수 없는가 */
    isBlocked: boolean;
    isPending: boolean;
    /** 폼을 제출했다. 검증과 저장은 useSectionForm 이 한다 */
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
    children: ReactNode;
}

/**
 * 섹션 하나의 틀. 제목 · 보이는 곳 · 수정 일시와, 아래에 그 섹션만 저장하는 버튼이 있다.
 * 모양은 소개 관리의 섹션과 같다.(src/features/aboutEditor/ui/SectionShell.tsx)
 */
export default function SectionShell({
    section,
    updatedAtText,
    isBlocked,
    isPending,
    onSubmit,
    children,
}: OwnProps) {
    const label = SECTION_LABEL[section];
    const headingId = `colophon-section-${section}`;

    return (
        <Panel className="p-6">
            <form aria-labelledby={headingId} onSubmit={onSubmit} className="flex flex-col gap-8">
                <div>
                    {/* 수정 일시는 제목 밖에 둔다. 안에 두면 이 제목으로 이름이 붙는 폼의 이름에 일시까지 읽힌다 */}
                    <div className="flex items-center justify-between gap-2">
                        <h2 id={headingId} className="text-2xl font-bold text-strong">
                            {label}
                        </h2>
                        {updatedAtText ? (
                            <span className="text-xs text-muted-foreground">
                                마지막 수정 {updatedAtText}
                            </span>
                        ) : null}
                    </div>
                    <p className="mt-1 text-caption text-muted-foreground">
                        {SECTION_PLACE[section]}
                    </p>
                </div>
                {children}
                <div className="flex flex-wrap items-center justify-end gap-4 rounded-b-xl py-5">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isBlocked}
                        isLoading={isPending}
                        className="items-center px-10"
                    >
                        <Save className="size-4.5" aria-hidden="true" /> {label} 저장
                    </Button>
                </div>
            </form>
        </Panel>
    );
}
