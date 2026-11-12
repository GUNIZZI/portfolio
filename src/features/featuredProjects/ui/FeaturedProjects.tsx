import type { ProjectData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';

import ProjectCard from './ProjectCard';

interface OwnProps {
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
            <p className="mt-1 text-sm text-foreground">Here are some of my recent projects.</p>
          </div>
        </div>
        <a
          href="#projects"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent"
        >
          View All Projects
          <Icon name="arrowRight" size={16} strokeWidth={2} />
        </a>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
