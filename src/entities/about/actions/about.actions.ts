'use server';

import { updateTag } from 'next/cache';

import { requireSession } from '@/entities/session/services/session.services';

import { ABOUT_CACHE_TAG, type AboutSection } from '../model/about.constants';
import { ABOUT_SAVE_STATUS, type AboutSaveStatus } from '../model/about.types';
import { saveAboutSection } from '../services/about.services';

/**
 * 소개 내용의 섹션 1건을 저장한다.
 * 세션을 다시 검사하고 스키마로 검증한 뒤 저장한다. 저장하면 공개 화면의 캐시를 지운다.
 * @param section - 저장할 섹션
 * @param content - 폼이 보낸 내용. 서버에서 다시 검증하므로 타입을 믿지 않는다
 * @returns 저장했는지, 규칙에 맞지 않았는지, 저장소에 쓰지 못했는지
 */
export async function saveAboutSectionAction(
    section: AboutSection,
    content: unknown,
): Promise<AboutSaveStatus> {
    await requireSession();

    let isSaved: boolean;
    try {
        isSaved = await saveAboutSection(section, content);
    } catch (error) {
        console.error(error);
        return ABOUT_SAVE_STATUS.FAILED;
    }
    if (!isSaved) {
        return ABOUT_SAVE_STATUS.INVALID;
    }

    updateTag(ABOUT_CACHE_TAG);
    return ABOUT_SAVE_STATUS.SAVED;
}
