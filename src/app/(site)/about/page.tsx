import type { Metadata } from 'next';

import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { AboutDoodles } from '@/features/aboutDoodles';
import { AboutIntro } from '@/features/aboutIntro';
import { ExperienceTimeline } from '@/features/experienceTimeline';
import { SkillGroups } from '@/features/skillGroups';
import { WorkPrinciples } from '@/features/workPrinciples';
import {
    getAboutIntro,
    getSkillGroupList,
    getWorkPrincipleList,
} from '@/entities/about/services/about.services';
import { getExperienceList } from '@/entities/experience/services/experience.services';
import { getProjectIdList } from '@/entities/project/services/project.services';
import ErrorBoundary from '@/shared/ui/errorBoundary/ErrorBoundary';

export const metadata: Metadata = { title: '소개' };

export default async function AboutPage() {
    const [experiences, intro, principles, skillGroups] = await Promise.all([
        // 경력의 프로젝트는 공개한 프로젝트에 이은 것만 상세로 가는 링크를 갖는다
        getProjectIdList().then(getExperienceList),
        getAboutIntro(),
        getWorkPrincipleList(),
        getSkillGroupList(),
    ]);

    return (
        <>
            <Backdrop>
                <AboutDoodles />
            </Backdrop>
            <div className="relative z-raised">
                <main>
                    <AboutIntro intro={intro} />
                    <ErrorBoundary
                        message="경력을 불러오지 못했어요."
                        className="mx-auto mt-10 max-w-page px-gutter"
                    >
                        <ExperienceTimeline experiences={experiences} />
                    </ErrorBoundary>
                    <ErrorBoundary
                        message="일하는 방식을 불러오지 못했어요."
                        className="mx-auto mt-12 max-w-page px-gutter"
                    >
                        <WorkPrinciples principles={principles} />
                    </ErrorBoundary>
                    <ErrorBoundary
                        message="기술 목록을 불러오지 못했어요."
                        className="mx-auto mt-12 max-w-page px-gutter"
                    >
                        <SkillGroups groups={skillGroups} />
                    </ErrorBoundary>
                    <Contact />
                </main>
                <Footer />
            </div>
        </>
    );
}
