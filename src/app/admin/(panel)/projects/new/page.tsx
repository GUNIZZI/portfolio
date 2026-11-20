import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard, AdminGuardFallback } from '@/features/adminAuth';
import { ProjectForm } from '@/features/projectEditor';

export const metadata: Metadata = { title: '프로젝트 등록' };

export default function AdminProjectNewPage() {
    return (
        <Suspense fallback={<AdminGuardFallback />}>
            <AdminGuard>
                <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
                    <div>
                        <h1 className="text-section font-bold text-strong">프로젝트 등록</h1>
                        <p className="mt-1 text-body text-muted-foreground">
                            새 프로젝트는 비공개로 시작한다
                        </p>
                    </div>
                    <ProjectForm project={null} />
                </main>
            </AdminGuard>
        </Suspense>
    );
}
