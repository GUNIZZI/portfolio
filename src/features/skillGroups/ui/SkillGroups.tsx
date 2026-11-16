import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';
import Panel from '@/shared/ui/panel/Panel';

import { SKILL_GROUPS } from '../model/skillGroups.constants';

/** 분야별 기술 묶음. 묶음마다 어디에 썼는지 한 줄과 기술 이름을 둔다 */
export default function SkillGroups() {
    return (
        <section className="mx-auto mt-12 max-w-page px-gutter">
            <Panel className="flex flex-col gap-7 p-[clamp(20px,5vw,48px)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <MarkerHeading underline="accent" underlineClassName="w-28">
                        SKILLS
                    </MarkerHeading>
                    <p className="text-sm font-medium">
                        What I <span className="text-accent">work with</span>
                    </p>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                    {SKILL_GROUPS.map((group) => (
                        <li
                            key={group.name}
                            className="flex flex-col gap-3 rounded-card border border-border-card bg-card p-5"
                        >
                            <h3 className="text-body font-bold">{group.name}</h3>
                            <ul className="flex flex-wrap gap-1">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="rounded-md bg-chip px-2.5 py-1 text-xs text-muted"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="leading-relaxed text-foreground">{group.usage}</p>
                        </li>
                    ))}
                </ul>
            </Panel>
        </section>
    );
}
