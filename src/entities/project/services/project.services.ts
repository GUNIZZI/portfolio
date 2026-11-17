import 'server-only';

import {
    PROJECT_SCOPE_AREA,
    PROJECT_SCOPE_LEVEL,
    type ProjectScopeArea,
    type ProjectScopeLevel,
} from '../model/project.schemas';
import type {
    ProjectData,
    ProjectDetailData,
    ProjectNeighborData,
    ProjectResponse,
    ProjectScopeData,
} from '../model/project.types';
import { projectRepository } from '../repositories/project.repositories';

/** 작업 상세의 주소 */
function toDetailHref(slug: string): string {
    return `/work/${slug}`;
}

export function toProjectData(project: ProjectResponse): ProjectData {
    return {
        slug: project.slug,
        title: project.title,
        category: project.category,
        summary: project.summary,
        href: project.href ?? toDetailHref(project.slug),
        image: project.image,
    };
}

/** 화면에 그릴 작업 목록 */
export async function getProjectList(): Promise<ProjectData[]> {
    const list = await projectRepository.getProjectList();
    return list.map(toProjectData);
}

function toNeighbor(project: ProjectResponse | undefined): ProjectNeighborData | null {
    return project ? { title: project.title, href: toDetailHref(project.slug) } : null;
}

/** 영역의 이름과 순서. 적힌 순서가 화면의 순서다 */
const SCOPE_AREA_LABEL: Record<ProjectScopeArea, string> = {
    [PROJECT_SCOPE_AREA.PLANNING]: '기획',
    [PROJECT_SCOPE_AREA.DESIGN]: '디자인',
    [PROJECT_SCOPE_AREA.PUBLISHING]: '퍼블리싱',
    [PROJECT_SCOPE_AREA.DEVELOPMENT]: '개발',
};

const SCOPE_LEVEL_LABEL: Record<ProjectScopeLevel, string> = {
    [PROJECT_SCOPE_LEVEL.SOLE]: '전담',
    [PROJECT_SCOPE_LEVEL.LEAD]: '주도',
    [PROJECT_SCOPE_LEVEL.PART]: '참여',
};

const SCOPE_AREA_ORDER = Object.keys(SCOPE_AREA_LABEL) as ProjectScopeArea[];

/** 팀 구성을 한 줄로 적는다. 적지 않았으면 null */
function toTeamText(team: ProjectResponse['team']): string | null {
    if (team.length === 0) return null;
    return team.map((member) => `${member.part} ${member.count}명`).join(' · ');
}

/** 맡은 범위를 일이 흘러가는 순서로 놓고 이름을 붙인다. 원문에 적은 순서와 상관없다 */
function toScope(scope: ProjectResponse['scope']): ProjectScopeData[] {
    return SCOPE_AREA_ORDER.flatMap((area) => {
        const item = scope.find((candidate) => candidate.area === area);
        if (!item) return [];
        return [
            {
                areaLabel: SCOPE_AREA_LABEL[area],
                level: item.level,
                levelLabel: SCOPE_LEVEL_LABEL[item.level],
            },
        ];
    });
}

/** 본문의 앞뒤 공백을 뗀다. 적지 않았거나 비어 있으면 null */
function toBody(body: string | undefined): string | null {
    const trimmed = (body ?? '').trim();
    return trimmed === '' ? null : trimmed;
}

function toPeriodText(period: ProjectResponse['period']): string | null {
    if (!period) return null;
    return `${period.start} – ${period.end ?? '진행 중'}`;
}

/**
 * 원문 목록에서 한 건을 상세 화면용으로 바꾼다. 앞뒤 작업은 목록의 순서를 따른다
 * @param list 원문 전체. 순서가 화면의 순서다
 * @param index 바꿀 작업의 자리
 */
export function toProjectDetailData(
    list: readonly ProjectResponse[],
    index: number,
): ProjectDetailData | null {
    const project = list[index];
    if (!project) return null;

    return {
        ...toProjectData(project),
        teamText: toTeamText(project.team),
        role: project.role ?? null,
        scope: toScope(project.scope),
        periodText: toPeriodText(project.period),
        stack: project.stack,
        links: project.links,
        body: toBody(project.body),
        prev: toNeighbor(list[index - 1]),
        next: toNeighbor(list[index + 1]),
    };
}

/** 작업 상세 한 건. 없는 slug 면 null */
export async function getProject(slug: string): Promise<ProjectDetailData | null> {
    const list = await projectRepository.getProjectList();
    const index = list.findIndex((project) => project.slug === slug);
    return index === -1 ? null : toProjectDetailData(list, index);
}

/** 상세 페이지를 미리 그릴 slug 전체 */
export async function getProjectSlugList(): Promise<string[]> {
    const list = await projectRepository.getProjectList();
    return list.map((project) => project.slug);
}
