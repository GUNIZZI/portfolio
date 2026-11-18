import Link from 'next/link';

import type { ExperienceData } from '@/entities/experience/model/experience.types';
import Icon from '@/shared/ui/icon/Icon';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';
import Panel from '@/shared/ui/panel/Panel';
import { cn } from '@/shared/util/cn';

import ExperienceToggleAll from './ExperienceToggleAll';
import TimelineLine from './TimelineLine';
import TimelineMarker from './TimelineMarker';

/** 회사 목록의 id. 전체 펼치기 버튼이 이 목록 안의 details 를 여닫는다 */
const LIST_ID = 'experience-list';

/** 경력이 0건일 때의 문구. 초안이다.(docs/plan/admin/experiences/README.md 검토 필요 사항의 「경력이 0건일 때」) */
const EMPTY_MESSAGE = '등록된 경력이 없습니다.';

interface OwnProps {
    experiences: ExperienceData[];
}

/**
 * 경력 타임라인. 회사를 최근부터 나열하고 회사마다 프로젝트 목록을 둔다.
 * 최근 경력은 펼쳐 두고 이전 경력은 접어 둔다. 여닫는 것은 details 라 스크립트 없이 동작한다.
 * 경력이 0건이면 섹션은 그대로 두고 목록 대신 문구를 보여 준다.
 */
export default function ExperienceTimeline({ experiences }: OwnProps) {
    const isEmpty = experiences.length === 0;

    return (
        <section id="experience" className="mx-auto mt-10 max-w-page scroll-mt-header px-gutter">
            <Panel className="flex flex-col gap-8 p-[clamp(20px,5vw,48px)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <MarkerHeading underline="primary">EXPERIENCE</MarkerHeading>
                    {isEmpty ? null : <ExperienceToggleAll listId={LIST_ID} />}
                </div>

                {isEmpty ? (
                    <p className="text-body text-muted-foreground">{EMPTY_MESSAGE}</p>
                ) : (
                    <div className="relative">
                        <TimelineLine />
                        <ol id={LIST_ID} className="flex flex-col gap-3">
                            {experiences.map((experience) => (
                                <li key={experience.id} className="relative pl-8 md:pl-32">
                                    <TimelineMarker
                                        startYearText={experience.startYearText}
                                        endYearText={experience.endYearText}
                                    />
                                    <details
                                        open={experience.isOpen}
                                        className={cn(
                                            // 배치와 모양
                                            'group rounded-card border border-border-card bg-card',
                                            // 여닫을 때 프로젝트 목록의 높이가 0 과 제 높이 사이를 오간다.
                                            // 높이를 움직이는 것은 모션 규칙(docs/motion.md 원칙 4)의 예외다. 사용자가 정했다(2026-11-16).
                                            // interpolate-size 를 모르는 브라우저에서는 움직이지 않고 바로 여닫힌다
                                            '[interpolate-size:allow-keywords]',
                                            'details-content:h-0 details-content:overflow-clip open:details-content:h-auto',
                                            // 모션. 닫힐 때는 높이가 다 줄어든 뒤에 내용을 숨긴다
                                            'details-content:transition-[height,content-visibility] details-content:transition-discrete',
                                            'details-content:duration-base details-content:ease-move',
                                        )}
                                    >
                                        <summary
                                            className={cn(
                                                // 배치와 모양. 브라우저 기본 세모를 지우고 직접 그린다
                                                'flex min-h-14 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 rounded-card px-4 py-3',
                                                '[&::-webkit-details-marker]:hidden',
                                                // hover
                                                'hover:bg-chip',
                                                // 모션
                                                'transition-colors duration-fast ease-move',
                                            )}
                                        >
                                            <h3 className="text-lead font-bold">
                                                {experience.company}
                                            </h3>
                                            {experience.isCurrent ? (
                                                <span className="rounded-md bg-badge px-2 py-0.75 text-2xs font-semibold">
                                                    재직 중
                                                </span>
                                            ) : null}
                                            <span className="text-caption text-muted-foreground tabular-nums md:hidden">
                                                {experience.periodText}
                                            </span>
                                            <span className="ml-auto flex items-center gap-2 text-caption text-muted-foreground">
                                                프로젝트 {experience.projectCountText}
                                                <Icon
                                                    name="arrowRight"
                                                    size={16}
                                                    strokeWidth={2}
                                                    className="rotate-90 transition-[rotate] duration-fast ease-move group-open:-rotate-90"
                                                />
                                            </span>
                                            {/*
                                          요약은 회사를 펼쳤을 때만 보인다. summary 안에는 문단을 둘 수 없어 span 으로 그린다.
                                          목록과 같은 속도로 높이가 늘어나며 나타난다. 갑자기 생기면 제목 줄의 높이가 튄다.
                                          닫혀 있을 때는 높이가 0 이고, 줄 사이 간격(gap-y-1)만큼을 음수 여백으로 지운다
                                        */}
                                            {experience.summary ? (
                                                <span
                                                    className={cn(
                                                        // 배치와 모양
                                                        'block w-full overflow-clip',
                                                        // 글자
                                                        'text-xs leading-relaxed text-muted-foreground',
                                                        // 상태
                                                        'invisible -mt-1 h-0',
                                                        'group-open:visible group-open:mt-0 group-open:h-auto',
                                                        // 모션
                                                        'transition-[height,margin,visibility] duration-base ease-move',
                                                    )}
                                                >
                                                    {experience.summary}
                                                </span>
                                            ) : null}
                                        </summary>

                                        <div className="flex flex-col gap-4 border-t border-line px-4 pt-4 pb-5">
                                            <ol className="flex flex-col">
                                                {experience.projects.map((project) => (
                                                    <li
                                                        key={`${project.name}-${project.dateText}`}
                                                        className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line py-2.5 last:border-b-0"
                                                    >
                                                        <span className="w-16 shrink-0 text-caption text-muted-foreground tabular-nums">
                                                            {project.dateText}
                                                        </span>
                                                        {project.href ? (
                                                            <Link
                                                                href={project.href}
                                                                className="inline-flex min-w-0 items-center gap-1 text-body font-semibold text-primary"
                                                            >
                                                                {project.name}
                                                                <Icon
                                                                    name="external"
                                                                    size={14}
                                                                    strokeWidth={2}
                                                                />
                                                            </Link>
                                                        ) : (
                                                            <span className="min-w-0 text-body font-medium">
                                                                {project.name}
                                                            </span>
                                                        )}
                                                        <ul className="flex flex-wrap gap-1.5 md:ml-auto md:justify-end">
                                                            {project.tags.map((tag) => (
                                                                <li
                                                                    key={tag}
                                                                    className="rounded-md bg-chip px-2 py-0.75 text-2xs text-foreground"
                                                                >
                                                                    {tag}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </details>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </Panel>
        </section>
    );
}
