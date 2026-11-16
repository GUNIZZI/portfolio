import type { Metadata } from 'next';

import { Backdrop } from '@/widgets/backdrop';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { AboutDoodles } from '@/features/aboutDoodles';
import { AboutIntro } from '@/features/aboutIntro';
import { Contact } from '@/features/contact';
import { ExperienceTimeline } from '@/features/experienceTimeline';
import { SkillGroups } from '@/features/skillGroups';
import { WorkPrinciples } from '@/features/workPrinciples';
import { getExperienceList } from '@/entities/experience/services/experience.services';

export const metadata: Metadata = { title: '소개' };

export default async function AboutPage() {
    const experiences = await getExperienceList();

    return (
        <div id="top" className="relative min-h-dvh overflow-x-clip">
            <Backdrop>
                <AboutDoodles />
            </Backdrop>
            <div className="relative z-raised">
                <Header currentHref="/about" />
                <main>
                    <AboutIntro />
                    <ExperienceTimeline experiences={experiences} />
                    <WorkPrinciples />
                    <SkillGroups />
                    <Contact />
                </main>
                <Footer />
            </div>
        </div>
    );
}
