import type { ProjectImageType, ProjectType } from './project.schemas';

/** 원문 한 건. content/projects.ts 를 검증한 결과다 */
export type ProjectResponse = ProjectType;

/** 화면에서 쓰는 작업 한 건 */
export interface ProjectData {
    slug: string;
    title: string;
    category: string;
    summary: string;
    href: string;
    image: ProjectImageType | null;
}
