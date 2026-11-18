import type { AboutSkillGroupData } from '@/entities/about/model/about.types';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';
import Panel from '@/shared/ui/panel/Panel';

/** 분야별 기술 묶음. 묶음마다 어디에 썼는지 한 줄과 기술 이름을 둔다 */
interface OwnProps {
    /** 분야별 기술 묶음. 페이지가 저장소에서 읽어 넘긴다 */
    groups: AboutSkillGroupData[];
}

export default function SkillGroups({ groups }: OwnProps) {
    return (
        <section className="mx-auto mt-12 max-w-page px-gutter">
            <Panel className="flex flex-col gap-7 p-[clamp(20px,5vw,48px)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <MarkerHeading underline="primary" underlineClassName="w-28">
                        SKILLS
                    </MarkerHeading>
                    <p className="text-sm font-medium">
                        What I <span className="text-primary">work with</span>
                    </p>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                    {groups.map((group) => (
                        <li
                            key={group.name}
                            className="flex flex-col gap-5 rounded-card border border-border-card bg-card p-5"
                        >
                            <h3 className="text-body font-bold">{group.name}</h3>
                            <ul className="flex flex-wrap gap-1">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="rounded-md bg-chip px-2.5 py-1 text-2xs text-muted-foreground"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="leading-relaxed text-muted-foreground">{group.usage}</p>
                        </li>
                    ))}
                </ul>
            </Panel>
        </section>
    );
}
