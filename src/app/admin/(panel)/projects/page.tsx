import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard, AdminGuardFallback } from '@/features/adminAuth';
import { ProjectError, ProjectList } from '@/features/projectEditor';
import type { ProjectRowData } from '@/entities/project/model/project.types';
import { getProjectRowList } from '@/entities/project/services/project.services';

export const metadata: Metadata = { title: '프로젝트 관리' };

/** 읽지 못하면 null 을 낸다. 화면은 오류 상태를 그린다 */
async function loadProjectRowList(): Promise<ProjectRowData[] | null> {
    try {
        return await getProjectRowList();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function AdminProjectListPage() {
    const projects = await loadProjectRowList();

    return (
        <Suspense fallback={<AdminGuardFallback />}>
            <AdminGuard>
                <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
                    <div>
                        <h1 className="text-section font-bold text-strong">프로젝트</h1>
                        <p className="mt-1 text-body text-muted-foreground">
                            포트폴리오에 싣는 프로젝트를 관리한다
                        </p>
                    </div>
                    {projects ? (
                        <ProjectList projects={projects} />
                    ) : (
                        <ProjectError retryHref="/admin/projects" />
                    )}
                </main>
            </AdminGuard>
        </Suspense>
    );
}
