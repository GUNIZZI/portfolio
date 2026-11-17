import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard } from '@/features/adminAuth';

export const metadata: Metadata = { title: '작업 등록' };

export default function AdminProjectNewPage() {
    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <main className="mx-auto max-w-page px-gutter py-10">
                    <h1 className="text-section font-bold text-strong">작업 등록</h1>
                </main>
            </AdminGuard>
        </Suspense>
    );
}
