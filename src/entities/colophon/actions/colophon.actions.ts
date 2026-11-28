'use server';

import { updateTag } from 'next/cache';

import { requireSession } from '@/entities/session/services/session.services';

import { COLOPHON_CACHE_TAG, type ColophonSection } from '../model/colophon.constants';
import { COLOPHON_SAVE_STATUS, type ColophonSaveStatus } from '../model/colophon.types';
import { saveColophonSection } from '../services/colophon.services';

/**
 * 「제작 과정」 의 섹션 1건을 저장한다.
 * 세션을 다시 검사하고 스키마로 검증한 뒤 저장한다. 저장하면 공개 화면의 캐시를 지운다.
 * @param section - 저장할 섹션
 * @param content - 폼이 보낸 내용. 서버에서 다시 검증하므로 타입을 믿지 않는다
 * @returns 저장했는지, 규칙에 맞지 않았는지, 저장소에 쓰지 못했는지
 */
export async function saveColophonSectionAction(
    section: ColophonSection,
    content: unknown,
): Promise<ColophonSaveStatus> {
    await requireSession();

    let isSaved: boolean;
    try {
        isSaved = await saveColophonSection(section, content);
    } catch (error) {
        console.error(error);
        return COLOPHON_SAVE_STATUS.FAILED;
    }
    if (!isSaved) {
        return COLOPHON_SAVE_STATUS.INVALID;
    }

    updateTag(COLOPHON_CACHE_TAG);
    return COLOPHON_SAVE_STATUS.SAVED;
}
