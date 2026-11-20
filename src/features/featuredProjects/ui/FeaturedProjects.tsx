import Link from 'next/link';

import type { ProjectData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';

import ProjectCard from './ProjectCard';
import ProjectGrid from './ProjectGrid';

interface OwnProps {
    /** 홈에 올릴 작업. 공개한 것 가운데 홈 노출을 켠 것이다 */
    projects: ProjectData[];
}

export default function FeaturedProjects({ projects }: OwnProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3.5">
                    <Icon name="star" size={44} strokeWidth={2} className="text-doodle-violet" />
                    <div>
                        <MarkerHeading>FEATURED PROJECTS</MarkerHeading>
                        <p className="mt-1 text-sm text-foreground">
                            Here are some of my recent projects.
                        </p>
                    </div>
                </div>
                <Link
                    href="/work"
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary"
                >
                    View All Projects
                    <Icon name="arrowRight" size={16} strokeWidth={2} />
                </Link>
            </div>
            {projects.length > 0 ? (
                <ProjectGrid className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </ProjectGrid>
            ) : (
                // 홈에 올린 프로젝트가 없어도 섹션은 감추지 않는다.(docs/plan/admin/README.md 「공개 화면 반영」)
                <p className="py-10 text-center text-body text-muted-foreground">
                    아직 등록된 프로젝트가 없습니다
                </p>
            )}
        </div>
    );
}
