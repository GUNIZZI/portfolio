import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard, AdminGuardFallback } from '@/features/adminAuth';
import { ExperienceForm } from '@/features/experienceEditor';
import { getProjectOptionList } from '@/entities/project/services/project.services';

export const metadata: Metadata = { title: '경력 등록' };

export default async function AdminExperienceNewPage() {
    // 프로젝트 연결에서 고를 프로젝트
    const projects = await getProjectOptionList();

    return (
        <Suspense fallback={<AdminGuardFallback />}>
            <AdminGuard>
                <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
                    <div>
                        <h1 className="text-section font-bold text-strong">경력 등록</h1>
                        <p className="mt-1 text-body text-muted-foreground">
                            회사와 그 회사에서 한 프로젝트를 등록한다
                        </p>
                    </div>
                    <ExperienceForm experience={null} projects={projects} />
                </main>
            </AdminGuard>
        </Suspense>
    );
}
