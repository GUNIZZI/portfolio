import type { ReactNode } from 'react';

import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';

interface OwnProps {
    /** 과정 그림의 단계가 이 id 로 스크롤한다 */
    id: string;
    title: string;
    /** 제목 아래 한 줄. 이 섹션이 무엇을 말하는지 적는다 */
    lead: string;
    /** 제목 밑줄의 색. 섹션마다 번갈아 준다 */
    underline: 'primary' | 'brand';
    children: ReactNode;
}

/** 페이지의 섹션 하나. 넓은 화면에서는 제목이 왼쪽 열, 내용이 오른쪽 열이다 */
export default function ColophonSection({ id, title, lead, underline, children }: OwnProps) {
    return (
        <section
            id={id}
            className="mx-auto mt-16 grid max-w-page scroll-mt-header gap-x-10 gap-y-6 px-gutter lg:grid-cols-[260px_minmax(0,1fr)]"
        >
            <div className="flex flex-col gap-3">
                <MarkerHeading underline={underline}>{title}</MarkerHeading>
                <p className="text-sm leading-relaxed text-muted-foreground">{lead}</p>
            </div>
            <div className="min-w-0">{children}</div>
        </section>
    );
}
