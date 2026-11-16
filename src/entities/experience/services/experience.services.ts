import 'server-only';

import type { ExperienceData, ExperienceResponse } from '../model/experience.types';
import { experienceRepository } from '../repositories/experience.repositories';

/**
 * 이 해부터 시작한 경력은 프로젝트 목록을 처음부터 펼친다.
 * 지금의 웹 프론트엔드 일과 이어지는 구간이다.(docs/plan/about/README.md 「경력」)
 */
const OPEN_FROM_YEAR = 2014;

export function toExperienceData(experience: ExperienceResponse): ExperienceData {
    const isCurrent = experience.endYear === null;
    const startYearText = String(experience.startYear);
    const endYearText = isCurrent ? '현재' : String(experience.endYear);
    const listed = experience.projects.length;
    // 적어 둔 수가 목록보다 많을 때만 대표 목록으로 본다
    const isPartialList = (experience.totalProjects ?? 0) > listed;

    return {
        slug: experience.slug,
        company: experience.company,
        periodText: `${startYearText} – ${endYearText}`,
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
            href: project.workSlug ? `/work/${project.workSlug}` : null,
        })),
    };
}

/** 화면에 그릴 경력 목록. 최근 회사가 앞이다 */
export async function getExperienceList(): Promise<ExperienceData[]> {
    const list = await experienceRepository.getExperienceList();
    return list.map(toExperienceData);
}
