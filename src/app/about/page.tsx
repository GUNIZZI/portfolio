import type { Metadata } from 'next';

import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
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

export const metadata: Metadata = { title: '소개' };

export default async function AboutPage() {
    const [experiences, intro, principles, skillGroups] = await Promise.all([
        getExperienceList(),
        getAboutIntro(),
        getWorkPrincipleList(),
        getSkillGroupList(),
    ]);

    return (
        <div id="top" className="relative min-h-dvh overflow-x-clip">
            <Backdrop>
                <AboutDoodles />
            </Backdrop>
            <div className="relative z-raised">
                <Header currentHref="/about" />
                <main>
                    <AboutIntro intro={intro} />
                    <ExperienceTimeline experiences={experiences} />
                    <WorkPrinciples principles={principles} />
                    <SkillGroups groups={skillGroups} />
                    <Contact />
                </main>
                <Footer />
            </div>
        </div>
    );
}
