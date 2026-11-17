import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminHeader } from '@/widgets/adminHeader';
import { AdminGuard } from '@/features/adminAuth';

export const metadata: Metadata = { title: '경력 관리' };

export default function AdminExperienceListPage() {
    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <AdminHeader currentHref="/admin/experiences" />
                <main className="mx-auto max-w-page px-gutter py-10">
                    <h1 className="text-section font-bold text-strong">경력</h1>
                </main>
            </AdminGuard>
        </Suspense>
    );
}
