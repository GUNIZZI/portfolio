import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard } from '@/features/adminAuth';

export const metadata: Metadata = { title: '프로젝트 관리' };

export default function AdminProjectListPage() {
    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <main className="mx-auto max-w-page px-gutter py-10">
                    <h1 className="text-section font-bold text-strong">프로젝트</h1>
                </main>
            </AdminGuard>
        </Suspense>
    );
}
