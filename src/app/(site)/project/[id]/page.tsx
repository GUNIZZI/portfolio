import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { ProjectDetail } from '@/features/projectDetail';
import { WorkDoodles } from '@/features/workDoodles';
import { getProject, getProjectIdList } from '@/entities/project/services/project.services';
import LogoLoader from '@/shared/ui/logoLoader/LogoLoader';

/**
 * 공개한 작업이 하나도 없을 때 대신 넘기는 id. 이 id 의 작업은 없어 「찾을 수 없음」 을 그린다.
 * 캐시 컴포넌트를 켠 상태에서는 미리 그릴 주소가 0개면 빌드가 실패한다.
 * (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md 「With Cache Components」)
 */
const PLACEHOLDER_ID = '__none__';

/** 빌드할 때 공개한 작업의 상세를 모두 미리 그린다 */
export async function generateStaticParams() {
    const ids = await getProjectIdList();
    return (ids.length > 0 ? ids : [PLACEHOLDER_ID]).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<'/project/[id]'>): Promise<Metadata> {
    const { id } = await params;
    const project = await getProject(id);
    return project
        ? { title: project.title, description: project.summary }
        : { title: '프로젝트 상세' };
}

/**
 * 주소의 id 를 읽는 부분만 따로 둔다.
 * params 를 Suspense 밖에서 읽으면 헤더 · 푸터 같은 틀까지 주소를 기다리게 되어, 목록에서 넘어올 때 바로 열리지 않는다.
 * 미리 그려 둔 작업은 빌드할 때 이 안까지 다 그려지므로 기다리는 화면이 보이지 않는다.
 * 빌드한 뒤에 공개한 작업은 처음 열 때 본문 자리에 로고 로더가 보인다
 */
async function WorkDetailContent({ params }: Pick<PageProps<'/project/[id]'>, 'params'>) {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) notFound();

    return <ProjectDetail project={project} />;
}

export default function WorkDetailPage({ params }: PageProps<'/project/[id]'>) {
    return (
        <>
            <Backdrop>
                <WorkDoodles />
            </Backdrop>
            <div className="relative z-raised flex flex-1 flex-col">
                <main className="flex-1">
                    <Suspense fallback={<LogoLoader />}>
                        <WorkDetailContent params={params} />
                    </Suspense>
                    <Contact />
                </main>
                <Footer />
            </div>
        </>
    );
}
