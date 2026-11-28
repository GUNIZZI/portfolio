import type { Metadata } from 'next';

import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { ProjectCard } from '@/features/featuredProjects';
import { ProjectExplorer } from '@/features/projectExplorer';
import { WorkDoodles } from '@/features/workDoodles';
import { getProjectList } from '@/entities/project/services/project.services';

export const metadata: Metadata = { title: '프로젝트' };

export default async function WorkPage() {
    const projects = await getProjectList();
    // 카드는 서버에서 그려 넘긴다. 격자는 거르고 자리를 옮기는 일만 한다
    const items = projects.map((project) => ({
        id: project.id,
        category: project.category,
        card: <ProjectCard project={project} />,
    }));

    return (
        <>
            <Backdrop>
                <WorkDoodles />
            </Backdrop>
            <div className="relative z-raised flex flex-1 flex-col">
                <main className="flex-1">
                    <ProjectExplorer items={items} />
                    <Contact />
                </main>
                <Footer />
            </div>
        </>
    );
}
