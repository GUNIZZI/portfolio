import type { AnalyticsProjectViewData } from '@/entities/analytics/model/analytics.types';
import type { ProjectOptionData } from '@/entities/project/model/project.types';

import type { ProjectViewRowData } from './dashboard.types';

/**
 * 프로젝트에 조회수를 이어 붙여 조회수가 많은 순으로 놓는다.
 * 공개 · 비공개를 모두 적고, 조회가 없는 프로젝트는 0으로 적는다.
 * 삭제한 프로젝트의 조회수는 이을 제목이 없어 뺀다.(docs/plan/admin/dashboard/README.md 「블록별 규칙」)
 * @param projects - 관리 화면의 순서로 놓인 프로젝트 전체. 조회수가 같으면 이 순서를 따른다
 * @param views - 조회가 있는 프로젝트의 조회수
 */
export function toProjectViewRowList(
    projects: readonly ProjectOptionData[],
    views: readonly AnalyticsProjectViewData[],
): ProjectViewRowData[] {
    const byId = new Map(views.map((view) => [view.projectId, view]));

    return projects
        .map((project) => {
            const view = byId.get(project.id);
            return {
                id: project.id,
                title: project.title,
                isPublished: project.isPublished,
                pageViews: view?.pageViews ?? 0,
                durationText: view?.durationText ?? null,
            };
        })
        .toSorted((a, b) => b.pageViews - a.pageViews);
}
