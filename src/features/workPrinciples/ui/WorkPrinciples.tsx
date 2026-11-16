import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';

import { WORK_PRINCIPLES } from '../model/workPrinciples.constants';

/** 일하는 방식. 원칙을 번호 붙은 카드로 나열한다 */
export default function WorkPrinciples() {
    return (
        <section className="mx-auto mt-12 flex max-w-page flex-col gap-6 px-gutter">
            <MarkerHeading underline="brand">HOW I WORK</MarkerHeading>
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
                {WORK_PRINCIPLES.map((principle, index) => (
                    <li
                        key={principle.title}
                        className="flex flex-col gap-2.5 rounded-card border border-border-card bg-card p-6"
                    >
                        <span aria-hidden="true" className="font-marker text-stat text-accent">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-lead font-bold">{principle.title}</h3>
                        <p className="text-sm leading-relaxed text-foreground">
                            {principle.description}
                        </p>
                    </li>
                ))}
            </ol>
        </section>
    );
}
