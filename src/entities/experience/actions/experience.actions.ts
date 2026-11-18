'use server';

import { updateTag } from 'next/cache';

import { requireSession } from '@/entities/session/services/session.services';

import { EXPERIENCE_CACHE_TAG } from '../model/experience.constants';
import { EXPERIENCE_SAVE_STATUS, type ExperienceSaveStatus } from '../model/experience.types';
import {
    createExperience,
    deleteExperience,
    updateExperience,
} from '../services/experience.services';

/**
 * 세션을 다시 검사하고 변경 1건을 실행한다. 저장소가 바뀌었으면 공개 화면의 캐시를 지운다
 * @param change - 실행할 변경. 저장소에 쓰지 못하면 던진다
 */
async function runChange(
    change: () => Promise<ExperienceSaveStatus>,
): Promise<ExperienceSaveStatus> {
    await requireSession();

    let status: ExperienceSaveStatus;
    try {
        status = await change();
    } catch (error) {
        console.error(error);
        return EXPERIENCE_SAVE_STATUS.FAILED;
    }
    if (status === EXPERIENCE_SAVE_STATUS.SAVED) {
        updateTag(EXPERIENCE_CACHE_TAG);
    }
    return status;
}

/**
 * 경력 1건을 등록한다
 * @param content - 폼이 보낸 내용. 서버에서 다시 검증하므로 타입을 믿지 않는다
 */
export async function createExperienceAction(content: unknown): Promise<ExperienceSaveStatus> {
    return runChange(() => createExperience(content));
}

/**
 * 경력 1건을 고친다
 * @param id - 고칠 경력의 id
 * @param content - 폼이 보낸 내용. 서버에서 다시 검증하므로 타입을 믿지 않는다
 */
export async function updateExperienceAction(
    id: string,
    content: unknown,
): Promise<ExperienceSaveStatus> {
    return runChange(() => updateExperience(id, content));
}

/**
 * 경력 1건을 지운다
 * @param id - 지울 경력의 id
 */
export async function deleteExperienceAction(id: string): Promise<ExperienceSaveStatus> {
    return runChange(() => deleteExperience(id));
}
