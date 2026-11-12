import 'server-only';

import type { ProjectData, ProjectResponse } from '../model/project.types';
import { projectRepository } from '../repositories/project.repositories';

export function toProjectData(project: ProjectResponse): ProjectData {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    summary: project.summary,
    href: project.href ?? `/work/${project.slug}`,
    image: project.image,
  };
}

/** 화면에 그릴 작업 목록 */
export async function getProjectList(): Promise<ProjectData[]> {
  const list = await projectRepository.getProjectList();
  return list.map(toProjectData);
}
