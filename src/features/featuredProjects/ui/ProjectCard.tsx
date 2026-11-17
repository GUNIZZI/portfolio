import Image from 'next/image';
import Link from 'next/link';

import type { ProjectData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';
import { cn } from '@/shared/util/cn';

import ProjectCardFrame from './ProjectCardFrame';

interface OwnProps {
    project: ProjectData;
}

/**
 * 작업 카드. 카드 전체가 상세로 가는 링크다.
 * 글자와 이미지는 서버에서 그리고, hover 연출만 ProjectCardFrame 이 맡는다
 */
export default function ProjectCard({ project }: OwnProps) {
    return (
        <ProjectCardFrame>
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
                    {/*
                      카드 어디를 눌러도 상세로 간다. 링크는 하나만 두고, 보이지 않는 면(after)을 카드 전체로 넓힌다.
                      카드를 통째로 링크로 감싸면 스크린 리더가 카드 안의 글자를 전부 링크 이름으로 읽는다
                    */}
                    <Link
                        href={project.href}
                        aria-label={`${project.title} 열기`}
                        className="flex p-1 after:absolute after:inset-0"
                    >
                        <Icon name="external" size={18} strokeWidth={2} />
                    </Link>
                </div>
                <p className="text-caption text-muted-foreground">{project.summary}</p>
            </div>
        </ProjectCardFrame>
    );
}
