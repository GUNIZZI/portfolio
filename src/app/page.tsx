import { Backdrop } from '@/widgets/backdrop';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { About } from '@/features/about';
import { Contact } from '@/features/contact';
import { FeaturedProjects } from '@/features/featuredProjects';
import { Hero } from '@/features/hero';
import { Skills } from '@/features/skills';
import { getProjectList } from '@/entities/project/services/project.services';
import Panel from '@/shared/ui/panel/Panel';

export default async function HomePage() {
    const projects = await getProjectList();

    return (
        <div id="top" className="relative min-h-dvh overflow-x-clip">
            <Backdrop />
            <div className="relative z-raised">
                <Header />
                <main>
                    <Hero />
                    <section
                        id="projects"
                        className="mx-auto max-w-page scroll-mt-header px-gutter"
                    >
                        <Panel className="flex flex-col gap-15 p-[clamp(20px,5vw,48px)]">
                            <FeaturedProjects projects={projects} />
                            <Skills />
                        </Panel>
                    </section>
                    <About />
                    <Contact />
                </main>
                <Footer />
            </div>
        </div>
    );
}
