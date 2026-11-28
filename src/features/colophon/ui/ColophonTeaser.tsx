import type { ColophonTeaserData } from '@/entities/colophon/model/colophon.types';
import { Button } from '@/shared/ui/button/button';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';
import Panel from '@/shared/ui/panel/Panel';

import ProcessSteps from './ProcessSteps';

interface OwnProps {
    /** 한 줄 요약과 과정의 단계. 페이지가 entity colophon 에서 읽어 넘긴다 */
    teaser: ColophonTeaserData;
}

/**
 * 홈의 제작 과정 섹션. 이 사이트를 만든 과정을 4단계로 줄여 보여 주고 페이지(/colophon)로 이어 준다.
 * 한 줄 요약과 과정의 단계는 페이지와 같은 저장소의 값을 쓴다. 홈에서는 단계를 누를 수 없고, 페이지로 가는 길은 버튼 하나다.
 * (docs/plan/home/README.md 「제작 과정 섹션」)
 */
export default function ColophonTeaser({ teaser }: OwnProps) {
    return (
        <section id="colophon" className="mx-auto mt-5 max-w-page scroll-mt-header px-gutter">
            <Panel className="flex flex-col gap-7 p-[clamp(24px,5vw,50px)]">
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                    <div className="flex flex-col gap-4">
                        <MarkerHeading underline="primary" underlineClassName="w-60">
                            HOW THIS SITE IS BUILT
                        </MarkerHeading>
                        <p className="text-body leading-relaxed text-foreground">
                            {teaser.summary}
                        </p>
                    </div>
                    <Button asChild variant="outlineBrand" size="md" effect="sweep" arrow="end">
                        <a href="/colophon">See How It&apos;s Built</a>
                    </Button>
                </div>
                <ProcessSteps steps={teaser.steps} />
            </Panel>
        </section>
    );
}
