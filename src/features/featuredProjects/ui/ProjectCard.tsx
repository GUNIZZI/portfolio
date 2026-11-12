import Image from 'next/image';
import Link from 'next/link';

import type { ProjectData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';
import { cn } from '@/shared/util/cn';

interface OwnProps {
    project: ProjectData;
}

export default function ProjectCard({ project }: OwnProps) {
    return (
        <article
            className={cn(
                // 배치와 모양
                'group flex w-full flex-col overflow-hidden rounded-card border border-border-card bg-card',
                // hover · 포커스. 동작 줄이기에서는 떠오르지 않고 테두리 색만 바뀐다
                'hover:border-brand motion-safe:hover:-translate-y-1',
                'focus-within:border-brand motion-safe:focus-within:-translate-y-1',
                // 모션
                'transition-[translate,border-color] duration-fast ease-move',
            )}
        >
            {project.image ? (
                // 커진 썸네일이 아래 글자를 덮지 않게 이 칸에서 자른다
                <div className="overflow-hidden">
                    <Image
                        src={project.image.src}
                        alt={project.image.alt}
                        width={project.image.width}
                        height={project.image.height}
                        sizes="(max-width: 640px) 100vw, 300px"
                        className={cn(
                            'aspect-[2/1] w-full object-cover',
                            'motion-safe:group-focus-within:scale-105 motion-safe:group-hover:scale-105',
                            'transition-[scale] duration-fast ease-move',
                        )}
                    />
                </div>
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
