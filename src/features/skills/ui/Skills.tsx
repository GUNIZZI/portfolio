import Image from 'next/image';

import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';

import { SKILLS } from '../model/skills.constants';

export default function Skills() {
    return (
        <div id="skills" className="flex scroll-mt-6 flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <MarkerHeading underline="accent" underlineClassName="w-37.5">
                    MY SKILLS
                </MarkerHeading>
                <p className="text-sm font-medium">
                    Tools I <span className="text-accent">work with</span>
                </p>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
                {SKILLS.map((skill) => (
                    <li
                        key={skill.name}
                        className="flex flex-col items-center gap-2 rounded-xl border border-border-card bg-card px-2 py-3.5 text-caption"
                    >
                        <Image
                            src={`/images/skills/${skill.icon}.png`}
                            alt=""
                            width={44}
                            height={44}
                            className="size-11 rounded-md"
                        />
                        {skill.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
