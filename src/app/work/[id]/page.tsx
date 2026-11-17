import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { ProjectDetail } from '@/features/projectDetail';
import { WorkDoodles } from '@/features/workDoodles';
import { getProject, getProjectSlugList } from '@/entities/project/services/project.services';

/** 빌드할 때 모든 작업의 상세를 미리 그린다 */
export async function generateStaticParams() {
    const slugs = await getProjectSlugList();
    return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<'/work/[id]'>): Promise<Metadata> {
    const { id } = await params;
    const project = await getProject(id);
    return project
        ? { title: project.title, description: project.summary }
        : { title: '작업 상세' };
}

/**
 * 주소의 id 를 읽는 부분만 따로 둔다.
 * params 를 Suspense 밖에서 읽으면 헤더 · 푸터 같은 틀까지 주소를 기다리게 되어, 목록에서 넘어올 때 바로 열리지 않는다.
 * 미리 그려 둔 작업은 빌드할 때 이 안까지 다 그려지므로 기다리는 화면이 보이지 않는다
 */
async function WorkDetailContent({ params }: Pick<PageProps<'/work/[id]'>, 'params'>) {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) notFound();

    return <ProjectDetail project={project} />;
}

export default function WorkDetailPage({ params }: PageProps<'/work/[id]'>) {
    return (
        <div id="top" className="relative min-h-dvh overflow-x-clip">
            <Backdrop>
                <WorkDoodles />
            </Backdrop>
            <div className="relative z-raised flex min-h-dvh flex-col">
                <Header currentHref="/work" />
                <main className="flex-1">
                    <Suspense fallback={null}>
                        <WorkDetailContent params={params} />
                    </Suspense>
                    <Contact />
                </main>
                <Footer />
            </div>
        </div>
    );
}
