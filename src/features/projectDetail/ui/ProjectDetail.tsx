import Image from 'next/image';
import Link from 'next/link';

import type { ProjectDetailData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';
import Panel from '@/shared/ui/panel/Panel';
import TiptapViewer from '@/shared/ui/tiptapViewer/TiptapViewer';

import ProjectMeta from './ProjectMeta';
import ProjectPager from './ProjectPager';

interface OwnProps {
    project: ProjectDetailData;
}

/**
 * 작업 상세. 머리(분류 · 제목 · 한 줄 설명 · 이미지), 메타, 케이스 스터디 본문, 앞뒤 작업.
 * 넓은 화면에서는 메타가 본문 오른쪽 옆에 붙어 따라오고, 좁은 화면에서는 본문 위로 올라간다.
 */
export default function ProjectDetail({ project }: OwnProps) {
    return (
        <article className="mx-auto flex max-w-page flex-col gap-10 px-gutter pt-6 pb-16">
            <Link
                href="/work"
                className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-accent"
            >
                <Icon name="arrowRight" size={16} strokeWidth={2} className="rotate-180" />
                All Projects
            </Link>

            <header className="flex flex-wrap items-center gap-x-10 gap-y-8">
                <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4">
                    <span className="self-start rounded-md bg-badge px-2 py-0.75 text-2xs font-semibold">
                        {project.category}
                    </span>
                    <h1 className="text-contact leading-tight font-bold text-strong">
                        {project.title}
                    </h1>
                    <p className="text-lead text-foreground">{project.summary}</p>
                </div>
                <div className="min-w-0 flex-[1_1_360px]">
                    {project.image ? (
                        <Image
                            src={project.image.src}
                            alt={project.image.alt}
                            width={project.image.width}
                            height={project.image.height}
                            sizes="(max-width: 920px) 100vw, 560px"
                            loading="eager"
                            className="aspect-[2/1] w-full rounded-card border border-border-card object-cover"
                        />
                    ) : (
                        <div
                            role="img"
                            aria-label="썸네일 이미지 자리"
                            className="flex aspect-[2/1] w-full items-center justify-center rounded-card bg-linear-135 from-doodle-indigo to-brand text-caption text-brand-foreground"
                        >
                            [썸네일 이미지 교체]
                        </div>
                    )}
                </div>
            </header>

            {/* 줄이 바뀌면 메타가 본문 위로 올라가게 거꾸로 접는다. 거꾸로 접으면 세로 기준도 뒤집혀 items-end 가 위쪽 맞춤이다 */}
            <div className="flex flex-wrap-reverse items-end gap-6">
                <Panel className="min-w-0 flex-[3_1_480px] p-[clamp(20px,5vw,48px)]">
                    {project.body ? (
                        <TiptapViewer content={project.body} />
                    ) : (
                        <p className="text-body text-muted">아직 작성한 내용이 없습니다.</p>
                    )}
                </Panel>
                <ProjectMeta project={project} />
            </div>

            <ProjectPager prev={project.prev} next={project.next} />
        </article>
    );
}
