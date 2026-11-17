import { Suspense } from 'react';
import Image from 'next/image';

import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';

import { PROJECT_INTRO_LINES } from '../model/projectExplorer.constants';
import type { ProjectFilterItem } from '../model/projectExplorer.types';
import { toCategoryList } from '../model/projectExplorer.utils';
import ProjectFilterGrid from './ProjectFilterGrid';
import ProjectFilterGridView from './ProjectFilterGridView';

interface OwnProps {
    items: ProjectFilterItem[];
}

/**
 * 작업 목록 페이지의 본문. 페이지 제목과, 분류로 거를 수 있는 작업 격자.
 * 머리는 소개 페이지의 첫 화면과 같은 짜임이다. 왼쪽에 제목과 소개 문단, 오른쪽에 색 면을 깐 캐릭터
 */
export default function ProjectExplorer({ items }: OwnProps) {
    return (
        <section className="mx-auto flex max-w-page flex-col gap-8 px-gutter pt-6 pb-16">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-8">
                <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
                    <span
                        aria-hidden="true"
                        className="inline-block -rotate-6 self-start font-hand text-greeting font-bold"
                    >
                        Take a look!
                    </span>
                    <MarkerHeading as="h1" underline="primary" className="text-hero-sub">
                        ALL PROJECTS
                    </MarkerHeading>
                    <div className="flex max-w-140 flex-col gap-3 text-lead leading-relaxed text-foreground">
                        {PROJECT_INTRO_LINES.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </div>
                </div>

                <div className="flex min-w-0 flex-[1_1_320px] justify-center">
                    <div className="relative flex aspect-[640/470] w-full max-w-110 items-center justify-center">
                        {/* 소개의 색 면은 보라다. 여기는 하늘색으로 두고 반대로 기울여 두 페이지를 구분한다 */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-[8%] top-[10%] bottom-0 z-base rotate-3 rounded-blob bg-doodle-sky"
                        />
                        <Image
                            src="/images/characters/project.png"
                            alt="윙크하며 엄지를 든 개발자 캐릭터 일러스트"
                            // 원본이 276×219 로 작다. 틀에 맞춰 늘리면 흐려져서 원본 크기를 넘기지 않는다
                            width={276}
                            height={219}
                            loading="eager"
                            className="z-raised h-auto max-w-full"
                        />
                        <p
                            aria-hidden="true"
                            className="absolute top-0 left-0 z-float -rotate-6 font-hand text-note font-bold whitespace-pre-line"
                        >
                            {'Made\nby me!'}
                        </p>
                    </div>
                </div>
            </div>
            {/* 주소를 읽기 전에는 전체 목록을 그려 둔다. 미리 그린 HTML 에 카드가 다 들어 있다 */}
            <Suspense
                fallback={
                    <ProjectFilterGridView
                        items={items}
                        categories={toCategoryList(items)}
                        selected={null}
                    />
                }
            >
                <ProjectFilterGrid items={items} />
            </Suspense>
        </section>
    );
}
