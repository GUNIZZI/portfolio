import type { ProjectScopeLevel } from '@/entities/project/model/project.schemas';
import type { ProjectDetailData } from '@/entities/project/model/project.types';
import Icon from '@/shared/ui/icon/Icon';
import Panel from '@/shared/ui/panel/Panel';
import { cn } from '@/shared/util/cn';

interface OwnProps {
    project: ProjectDetailData;
}

const TERM_CLASS = 'text-2xs font-semibold text-muted-foreground';

/**
 * 단계마다의 표시. 깊이 맡을수록 색이 짙다.
 * 색만으로 뜻을 전하지 않는다. 단계 이름을 항상 글자로 함께 적는다
 */
const SCOPE_LEVEL_CLASS: Record<ProjectScopeLevel, string> = {
    sole: 'bg-primary font-bold text-primary-foreground',
    lead: 'bg-brand font-semibold text-brand-foreground',
    part: 'bg-chip text-strong',
};

/**
 * 작업의 메타. 팀 · 역할 · 맡은 범위 · 기간 · 기술 · 외부 링크다. 적지 않은 항목은 그리지 않는다.
 * 채용하는 사람이 먼저 찾는 것(팀에서 했는지, 어떤 자리였는지, 어디까지 직접 했는지)을 앞에 둔다.
 * 하나도 없으면 칸 자체를 그리지 않는다.
 */
export default function ProjectMeta({ project }: OwnProps) {
    const hasStack = project.stack.length > 0;
    const hasLinks = project.links.length > 0;
    const hasScope = project.scope.length > 0;
    const isEmpty =
        !project.teamText &&
        !project.role &&
        !hasScope &&
        !project.periodText &&
        !hasStack &&
        !hasLinks;
    if (isEmpty) return null;

    return (
        <Panel className="min-w-0 flex-[1_1_240px] self-end p-6 lg:sticky lg:top-[calc(var(--header-height,0px)+24px)]">
            <dl className="flex flex-col gap-5">
                {project.teamText ? (
                    <div className="flex flex-col gap-1">
                        <dt className={TERM_CLASS}>팀</dt>
                        <dd className="text-body font-medium">{project.teamText}</dd>
                    </div>
                ) : null}
                {project.role ? (
                    <div className="flex flex-col gap-1">
                        <dt className={TERM_CLASS}>역할</dt>
                        <dd className="text-body font-medium">{project.role}</dd>
                    </div>
                ) : null}
                {hasScope ? (
                    <div className="flex flex-col gap-2">
                        <dt className={TERM_CLASS}>맡은 범위</dt>
                        <dd>
                            <ul className="flex flex-col gap-1.5">
                                {project.scope.map((item) => (
                                    <li
                                        key={item.areaLabel}
                                        className="flex items-center justify-between gap-3 text-body font-medium"
                                    >
                                        {item.areaLabel}
                                        <span
                                            className={cn(
                                                'rounded-md px-2 py-0.75 text-2xs',
                                                SCOPE_LEVEL_CLASS[item.level],
                                            )}
                                        >
                                            {item.levelLabel}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                ) : null}
                {project.periodText ? (
                    <div className="flex flex-col gap-1">
                        <dt className={TERM_CLASS}>기간</dt>
                        <dd className="text-body font-medium tabular-nums">{project.periodText}</dd>
                    </div>
                ) : null}
                {hasStack ? (
                    <div className="flex flex-col gap-2">
                        <dt className={TERM_CLASS}>기술</dt>
                        <dd>
                            <ul className="flex flex-wrap gap-1.5">
                                {project.stack.map((name) => (
                                    <li
                                        key={name}
                                        className="rounded-md bg-chip px-2.5 py-1 text-caption text-strong"
                                    >
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                ) : null}
                {hasLinks ? (
                    <div className="flex flex-col gap-1">
                        <dt className={TERM_CLASS}>링크</dt>
                        <dd>
                            <ul className="flex flex-col">
                                {project.links.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${link.label} (새 탭)`}
                                            className="inline-flex min-h-11 items-center gap-1.5 text-body font-semibold text-primary"
                                        >
                                            {link.label}
                                            <Icon name="external" size={14} strokeWidth={2} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                ) : null}
            </dl>
        </Panel>
    );
}
