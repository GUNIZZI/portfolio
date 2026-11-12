import Image from 'next/image';
import Link from 'next/link';

import type { ProjectData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';

interface OwnProps {
    project: ProjectData;
}

export default function ProjectCard({ project }: OwnProps) {
    return (
        <article className="flex flex-col overflow-hidden rounded-card border border-border-card bg-card">
            {project.image ? (
                <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="aspect-[2/1] w-full object-cover"
                />
            ) : (
                <div
                    role="img"
                    aria-label="썸네일 이미지 자리"
                    className="flex aspect-[2/1] w-full items-center justify-center bg-linear-135 from-doodle-indigo to-brand text-caption text-brand-foreground"
                >
                    [썸네일 이미지 교체]
                </div>
            )}
            <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
                <span className="self-start rounded-md bg-badge px-2 py-0.75 text-2xs font-semibold">
                    {project.category}
                </span>
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold">{project.title}</h3>
                    <Link
                        href={project.href}
                        aria-label={`${project.title} 열기`}
                        className="flex p-1"
                    >
                        <Icon name="external" size={18} strokeWidth={2} />
                    </Link>
                </div>
                <p className="text-caption text-muted">{project.summary}</p>
            </div>
        </article>
    );
}
