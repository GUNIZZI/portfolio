import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AdminGuard, AdminGuardFallback } from '@/features/adminAuth';
import { ProjectError, ProjectForm } from '@/features/projectEditor';
import type { ProjectEditorData } from '@/entities/project/model/project.types';
import { getProjectEditor } from '@/entities/project/services/project.services';

export const metadata: Metadata = { title: '프로젝트 수정' };

const LOAD_FAILED = 'LOAD_FAILED';

/** 읽지 못하면 LOAD_FAILED 를, 그 id 의 프로젝트가 없으면 null 을 낸다 */
async function loadProjectEditor(
    id: string,
): Promise<ProjectEditorData | typeof LOAD_FAILED | null> {
    try {
        return await getProjectEditor(id);
    } catch (error) {
        console.error(error);
        return LOAD_FAILED;
    }
}

/**
 * 주소의 id 를 읽는 부분. params 는 요청마다 달라 Suspense 안에서 읽는다.
 * 세션을 먼저 검사한다. 로그인하지 않은 사람에게는 그 id 의 프로젝트가 있는지도 알리지 않는다
 */
async function ProjectEditContent({ params }: Pick<PageProps<'/admin/projects/[id]'>, 'params'>) {
    const { id } = await params;
    const project = await loadProjectEditor(id);
    if (!project) notFound();

    return (
        <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
            <div>
                <h1 className="text-section font-bold text-strong">프로젝트 수정</h1>
                <p className="mt-1 text-body text-muted-foreground">
                    목록과 상세 머리에 나오는 내용을 고친다
                </p>
            </div>
            {project === LOAD_FAILED ? (
                <ProjectError retryHref={`/admin/projects/${id}`} />
            ) : (
                <ProjectForm project={project} />
            )}
        </main>
    );
}

export default function AdminProjectEditPage({ params }: PageProps<'/admin/projects/[id]'>) {
    return (
        <Suspense fallback={<AdminGuardFallback />}>
            <AdminGuard>
                <ProjectEditContent params={params} />
            </AdminGuard>
        </Suspense>
    );
}
