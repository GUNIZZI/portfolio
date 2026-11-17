'use client';

import { useState, useTransition } from 'react';

import { saveAboutSectionAction } from '@/entities/about/actions/about.actions';
import type { AboutSection } from '@/entities/about/model/about.constants';
import { ABOUT_SECTION_SCHEMAS } from '@/entities/about/model/about.schemas';
import { ABOUT_SAVE_STATUS, type AboutSectionContent } from '@/entities/about/model/about.types';
import { withObjectParticle } from '@/shared/util/josa';

import { EDITOR_MESSAGE, SECTION_LABEL } from './aboutEditor.constants';
import { useToast } from './aboutEditor.contexts';

interface SectionForm<Content> {
    /** 지금 폼에 있는 값 */
    value: Content;
    setValue: (value: Content) => void;
    /** 저장 버튼을 누를 수 없는 이유. 누를 수 있으면 null */
    blockedReason: string | null;
    isPending: boolean;
    save: () => void;
}

/**
 * 섹션 폼 하나의 상태. 고친 내용이 있고 규칙에 맞을 때만 저장할 수 있다.
 * 저장하면 그 값을 새 기준으로 삼아, 다시 고치기 전까지 저장 버튼을 비활성으로 둔다.
 */
export function useSectionForm<Section extends AboutSection>(
    section: Section,
    initial: AboutSectionContent[Section],
): SectionForm<AboutSectionContent[Section]> {
    const [saved, setSaved] = useState(initial);
    const [value, setValue] = useState(initial);
    const [isPending, startTransition] = useTransition();
    const showToast = useToast();

    const isDirty = JSON.stringify(value) !== JSON.stringify(saved);
    const isValid = ABOUT_SECTION_SCHEMAS[section].safeParse(value).success;

    let blockedReason: string | null = null;
    if (!isDirty) {
        blockedReason = EDITOR_MESSAGE.NOT_DIRTY;
    } else if (!isValid) {
        blockedReason = EDITOR_MESSAGE.INVALID;
    }

    function save() {
        startTransition(async () => {
            const status = await saveAboutSectionAction(section, value);
            if (status === ABOUT_SAVE_STATUS.SAVED) {
                setSaved(value);
                showToast(`${withObjectParticle(SECTION_LABEL[section])} 저장했습니다`);
                return;
            }
            showToast(EDITOR_MESSAGE.SAVE_FAILED);
        });
    }

    return { value, setValue, blockedReason, isPending, save };
}
