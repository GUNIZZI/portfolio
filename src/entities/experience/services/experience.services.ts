import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { toUpdatedAtText } from '@/shared/util/dateText';

import { EXPERIENCE_CACHE_TAG } from '../model/experience.constants';
import { ExperienceSchema, type ExperienceType } from '../model/experience.schemas';
import {
    EXPERIENCE_SAVE_STATUS,
    type ExperienceData,
    type ExperienceEditorData,
    type ExperienceResponse,
    type ExperienceRowData,
    type ExperienceSaveStatus,
} from '../model/experience.types';
import { experienceRepository } from '../repositories/experience.repositories';

/**
 * 이 해부터 시작한 경력은 프로젝트 목록을 처음부터 펼친다.
 * 지금의 웹 프론트엔드 일과 이어지는 구간이다.(docs/plan/about/README.md 「경력」)
 */
const OPEN_FROM_YEAR = 2014;

function toPeriodText(experience: ExperienceResponse): string {
    return `${experience.startYear} – ${experience.endYear ?? '현재'}`;
}

/**
 * 경력 1건을 공개 화면용으로 바꾼다
 * @param experience - 저장소에서 읽은 경력
 * @param linkableProjectIds - 상세 화면이 있는 프로젝트의 id. 공개한 프로젝트다.
 *   여기 없는 프로젝트(비공개 · 삭제)에 이은 줄은 링크 없이 이름만 그린다.
 *   (docs/plan/admin/experiences/README.md 「등록 · 수정」)
 */
export function toExperienceData(
    experience: ExperienceResponse,
    linkableProjectIds: readonly string[],
): ExperienceData {
    const isCurrent = experience.endYear === null;
    const startYearText = String(experience.startYear);
    const endYearText = isCurrent ? '현재' : String(experience.endYear);
    const listed = experience.projects.length;
    // 적어 둔 수가 목록보다 많을 때만 대표 목록으로 본다
    const isPartialList = (experience.totalProjects ?? 0) > listed;

    return {
        id: experience.id,
        company: experience.company,
        periodText: toPeriodText(experience),
        startYearText,
        endYearText,
        isCurrent,
        isOpen: experience.startYear >= OPEN_FROM_YEAR,
        summary: experience.summary.trim() || null,
        projectCountText: isPartialList ? `${experience.totalProjects}개+` : `${listed}개`,
        projects: experience.projects.map((project) => ({
            name: project.name,
            dateText: project.date,
            tags: project.tags,
            href:
                project.projectId && linkableProjectIds.includes(project.projectId)
                    ? `/work/${project.projectId}`
                    : null,
        })),
    };
}

export function toExperienceRowData(experience: ExperienceResponse): ExperienceRowData {
    return {
        id: experience.id,
        company: experience.company,
        periodText: toPeriodText(experience),
        listedCountText: `${experience.projects.length}개`,
        totalCountText: experience.totalProjects ? `${experience.totalProjects}개+` : null,
        updatedAtText: toUpdatedAtText(experience.updatedAt),
    };
}

/**
 * 들어간 해가 늦은 회사부터 놓는다.(docs/plan/admin/experiences/README.md 「목록」)
 * 들어간 해가 같으면 재직 중인 회사, 늦게 떠난 회사 순이다. 저장소가 주는 순서는 정해져 있지 않다
 */
export function sortExperienceList(list: ExperienceResponse[]): ExperienceResponse[] {
    return list.toSorted(
        (a, b) =>
            b.startYear - a.startYear ||
            (b.endYear ?? Infinity) - (a.endYear ?? Infinity) ||
            a.company.localeCompare(b.company),
    );
}

/**
 * 경력 전체를 읽어 순서대로 놓는다. 결과를 캐시해 공개 화면이 요청마다 저장소를 부르지 않게 한다.
 * 관리 화면에서 저장하거나 지우면 EXPERIENCE_CACHE_TAG 의 캐시를 지운다
 */
async function getExperienceResponseList(): Promise<ExperienceResponse[]> {
    'use cache';
    cacheTag(EXPERIENCE_CACHE_TAG);
    cacheLife('days');

    return sortExperienceList(await experienceRepository.getExperienceList());
}

/**
 * 화면에 그릴 경력 목록. 최근 회사가 앞이다
 * @param linkableProjectIds - 상세 화면이 있는 프로젝트의 id. 페이지가 entity project 에서 읽어 넘긴다
 */
export async function getExperienceList(
    linkableProjectIds: readonly string[],
): Promise<ExperienceData[]> {
    const list = await getExperienceResponseList();
    return list.map((experience) => toExperienceData(experience, linkableProjectIds));
}

/** 관리 화면의 경력 목록. 최근 회사가 앞이다 */
export async function getExperienceRowList(): Promise<ExperienceRowData[]> {
    const list = await getExperienceResponseList();
    return list.map(toExperienceRowData);
}

/**
 * 관리 화면의 수정 폼이 그릴 경력 1건
 * @param id - 경력의 id
 * @returns 그 id 의 경력이 없으면 null
 */
export async function getExperienceEditor(id: string): Promise<ExperienceEditorData | null> {
    const list = await getExperienceResponseList();
    const experience = list.find((item) => item.id === id);
    if (!experience) {
        return null;
    }
    const { id: _id, updatedAt, ...content } = experience;
    return { id, content, updatedAtText: toUpdatedAtText(updatedAt) };
}

/**
 * 폼이 보낸 내용을 검증한다. 값이 없는 선택 항목은 키째로 뺀다. 저장소는 undefined 를 받지 않는다
 * @returns 규칙에 맞지 않으면 null
 */
function parseContent(content: unknown): ExperienceType | null {
    const parsed = ExperienceSchema.safeParse(content);
    if (!parsed.success) {
        return null;
    }
    return JSON.parse(JSON.stringify(parsed.data)) as ExperienceType;
}

/**
 * 경력 1건을 검증하고 등록한다
 * @param content - 폼이 보낸 내용
 */
export async function createExperience(content: unknown): Promise<ExperienceSaveStatus> {
    const parsed = parseContent(content);
    if (!parsed) {
        return EXPERIENCE_SAVE_STATUS.INVALID;
    }
    await experienceRepository.createExperience(parsed);
    return EXPERIENCE_SAVE_STATUS.SAVED;
}

/**
 * 경력 1건을 검증하고 고친다
 * @param id - 고칠 경력의 id
 * @param content - 폼이 보낸 내용
 */
export async function updateExperience(
    id: string,
    content: unknown,
): Promise<ExperienceSaveStatus> {
    const parsed = parseContent(content);
    if (!parsed) {
        return EXPERIENCE_SAVE_STATUS.INVALID;
    }
    const isUpdated = await experienceRepository.updateExperience(id, parsed);
    return isUpdated ? EXPERIENCE_SAVE_STATUS.SAVED : EXPERIENCE_SAVE_STATUS.NOT_FOUND;
}

/**
 * 경력 1건을 지운다. 이어 둔 프로젝트(entity project)는 지우지 않는다
 * @param id - 지울 경력의 id
 */
export async function deleteExperience(id: string): Promise<ExperienceSaveStatus> {
    const isDeleted = await experienceRepository.deleteExperience(id);
    return isDeleted ? EXPERIENCE_SAVE_STATUS.SAVED : EXPERIENCE_SAVE_STATUS.NOT_FOUND;
}
