import type { ExperienceType } from '@/entities/experience/model/experience.schemas';

import type { ExperienceFormValue, ProjectFormValue } from './experienceEditor.types';

/** 빈 프로젝트 1줄 */
export function createEmptyProject(): ProjectFormValue {
    return { name: '', date: '', tags: [], workSlug: '' };
}

/**
 * 저장된 경력을 폼의 값으로 바꾼다
 * @param content - 저장된 내용. 등록 화면이면 null
 * @param projectSlugs - 지금 등록된 프로젝트의 slug. 여기 없는 연결은 「잇지 않음」 으로 바꾼다
 * @returns 폼의 처음 값. 등록 화면이면 모두 빈 값이다
 */
export function toFormValue(
    content: ExperienceType | null,
    projectSlugs: readonly string[],
): ExperienceFormValue {
    if (!content) {
        return {
            company: '',
            startYear: '',
            isCurrent: false,
            endYear: '',
            summary: '',
            totalProjects: '',
            projects: [],
        };
    }
    return {
        company: content.company,
        startYear: String(content.startYear),
        isCurrent: content.endYear === null,
        endYear: content.endYear === null ? '' : String(content.endYear),
        summary: content.summary,
        totalProjects: content.totalProjects === undefined ? '' : String(content.totalProjects),
        projects: content.projects.map((project) => ({
            name: project.name,
            date: project.date,
            tags: project.tags,
            workSlug:
                project.workSlug && projectSlugs.includes(project.workSlug) ? project.workSlug : '',
        })),
    };
}

/** 숫자만 적은 글자를 숫자로 바꾼다. 그 밖의 글자는 NaN 이라 스키마가 걸러 낸다 */
function toNumber(text: string): number {
    const trimmed = text.trim();
    return /^\d+$/.test(trimmed) ? Number(trimmed) : Number.NaN;
}

/**
 * 폼의 값을 저장할 내용으로 바꾼다. 값이 없는 선택 항목은 키째로 뺀다
 * @returns 스키마로 검증하기 전의 내용. 규칙에 맞는지는 ExperienceSchema 가 본다
 */
export function toContent(value: ExperienceFormValue): ExperienceType {
    return {
        company: value.company,
        startYear: toNumber(value.startYear),
        endYear: value.isCurrent ? null : toNumber(value.endYear),
        summary: value.summary,
        ...(value.totalProjects.trim() === ''
            ? {}
            : { totalProjects: toNumber(value.totalProjects) }),
        projects: value.projects.map((project) => ({
            name: project.name,
            date: project.date.trim(),
            tags: project.tags,
            ...(project.workSlug === '' ? {} : { workSlug: project.workSlug }),
        })),
    };
}
