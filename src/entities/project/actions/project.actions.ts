'use server';

import { updateTag } from 'next/cache';

import { requireSession } from '@/entities/session/services/session.services';

import { PROJECT_CACHE_TAG } from '../model/project.constants';
import { PROJECT_SAVE_STATUS, type ProjectSaveStatus } from '../model/project.types';
import {
    createProject,
    deleteProject,
    discardProjectImage,
    reorderProjectList,
    setProjectFeatured,
    setProjectPublished,
    updateProject,
} from '../services/project.services';

/**
 * 세션을 다시 검사하고 변경 1건을 실행한다. 저장소가 바뀌었으면 공개 화면의 캐시를 지운다
 * @param change - 실행할 변경. 저장소에 쓰지 못하면 던진다
 */
async function runChange(change: () => Promise<ProjectSaveStatus>): Promise<ProjectSaveStatus> {
    await requireSession();

    let status: ProjectSaveStatus;
    try {
        status = await change();
    } catch (error) {
        console.error(error);
        return PROJECT_SAVE_STATUS.FAILED;
    }
    if (status === PROJECT_SAVE_STATUS.SAVED) {
        updateTag(PROJECT_CACHE_TAG);
    }
    return status;
}

/**
 * 프로젝트 1건을 등록한다
 * @param content - 폼이 보낸 내용. 서버에서 다시 검증하므로 타입을 믿지 않는다
 */
export async function createProjectAction(content: unknown): Promise<ProjectSaveStatus> {
    return runChange(() => createProject(content));
}

/**
 * 프로젝트 1건을 고친다
 * @param id - 고칠 프로젝트의 id
 * @param content - 폼이 보낸 내용. 서버에서 다시 검증하므로 타입을 믿지 않는다
 */
export async function updateProjectAction(
    id: string,
    content: unknown,
): Promise<ProjectSaveStatus> {
    return runChange(() => updateProject(id, content));
}

/**
 * 프로젝트 1건을 지운다. 문서와 썸네일 파일을 함께 지운다
 * @param id - 지울 프로젝트의 id
 */
export async function deleteProjectAction(id: string): Promise<ProjectSaveStatus> {
    return runChange(() => deleteProject(id));
}

/**
 * 프로젝트 1건의 공개 여부를 바꾼다. 비공개로 바꾸면 홈 노출도 함께 꺼진다
 * @param id - 바꿀 프로젝트의 id
 */
export async function setProjectPublishedAction(
    id: string,
    isPublished: boolean,
): Promise<ProjectSaveStatus> {
    return runChange(() => setProjectPublished(id, isPublished));
}

/**
 * 프로젝트 1건의 홈 노출 여부를 바꾼다. 비공개 프로젝트는 켤 수 없다
 * @param id - 바꿀 프로젝트의 id
 */
export async function setProjectFeaturedAction(
    id: string,
    isFeatured: boolean,
): Promise<ProjectSaveStatus> {
    return runChange(() => setProjectFeatured(id, isFeatured));
}

/**
 * 프로젝트의 순서를 바꾼다
 * @param ids - 놓을 차례대로 적은 id 전체. 서버에서 다시 검증하므로 타입을 믿지 않는다
 */
export async function reorderProjectListAction(ids: unknown): Promise<ProjectSaveStatus> {
    return runChange(() => reorderProjectList(ids));
}

/**
 * 올려 두고 저장하지 않은 썸네일 파일을 지운다. 프로젝트의 내용은 바뀌지 않아 캐시를 지우지 않는다
 * @param src - 지울 파일의 주소. 서버에서 다시 검증하므로 타입을 믿지 않는다
 */
export async function discardProjectImageAction(src: unknown): Promise<ProjectSaveStatus> {
    await requireSession();
    try {
        return await discardProjectImage(src);
    } catch (error) {
        console.error(error);
        return PROJECT_SAVE_STATUS.FAILED;
    }
}
