import 'server-only';

import { PROJECTS } from '@content/projects';

import { ProjectListSchema } from '../model/project.schemas';
import type { ProjectResponse } from '../model/project.types';

export interface ProjectRepository {
    /**
     * 작업 원문 전체를 읽고 스키마로 검증한다
     * @returns 원문 순서 그대로의 목록
     * @see {@link ProjectResponse}
     */
    getProjectList(): Promise<ProjectResponse[]>;
}

export const projectRepository: ProjectRepository = {
    getProjectList() {
        return Promise.resolve(ProjectListSchema.parse(PROJECTS));
    },
};
