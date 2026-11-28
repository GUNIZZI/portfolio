import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { About } from '@/features/about';
import { ColophonTeaser } from '@/features/colophon';
import { FeaturedProjects } from '@/features/featuredProjects';
import { Hero } from '@/features/hero';
import { HomeDoodles } from '@/features/homeDoodles';
import { Skills } from '@/features/skills';
import { getAboutHome } from '@/entities/about/services/about.services';
import { getColophonTeaser } from '@/entities/colophon/services/colophon.services';
import { getFeaturedProjectList } from '@/entities/project/services/project.services';
import ErrorBoundary from '@/shared/ui/errorBoundary/ErrorBoundary';
import Panel from '@/shared/ui/panel/Panel';

export default async function HomePage() {
    const [projects, about, colophonTeaser] = await Promise.all([
        getFeaturedProjectList(),
        getAboutHome(),
        getColophonTeaser(),
    ]);

    return (
        <>
            <Backdrop>
                <HomeDoodles />
            </Backdrop>
            <div className="relative z-raised">
                <main>
                    <Hero />
                    <section
                        id="projects"
                        className="mx-auto max-w-page scroll-mt-header px-gutter"
                    >
                        <Panel className="flex flex-col gap-15 p-[clamp(20px,5vw,48px)]">
                            <ErrorBoundary message="프로젝트를 불러오지 못했어요.">
                                <FeaturedProjects projects={projects} />
                            </ErrorBoundary>
                            <ErrorBoundary message="기술 목록을 불러오지 못했어요.">
                                <Skills />
                            </ErrorBoundary>
                        </Panel>
                    </section>
                    <ErrorBoundary
                        message="소개를 불러오지 못했어요."
                        className="mx-auto mt-5 max-w-page px-gutter"
                    >
                        <About about={about} />
                    </ErrorBoundary>
                    <ColophonTeaser teaser={colophonTeaser} />
                    <Contact />
                </main>
                <Footer isHome />
            </div>
        </>
    );
}
