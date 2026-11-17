import type { AboutPrincipleData } from '@/entities/about/model/about.types';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';

/** 일하는 방식. 원칙을 번호 붙은 카드로 나열한다 */
interface OwnProps {
    /** 일하는 방식. 읽는 순서대로 번호를 붙인다. 페이지가 저장소에서 읽어 넘긴다 */
    principles: AboutPrincipleData[];
}

export default function WorkPrinciples({ principles }: OwnProps) {
    return (
        <section className="mx-auto mt-12 flex max-w-page flex-col gap-6 px-gutter">
            <MarkerHeading underline="brand">HOW I WORK</MarkerHeading>
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
                {principles.map((principle, index) => (
                    <li
                        key={principle.title}
                        className="flex flex-col gap-2.5 rounded-card border border-border-card bg-card p-6"
                    >
                        <span aria-hidden="true" className="font-marker text-stat text-primary">
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
