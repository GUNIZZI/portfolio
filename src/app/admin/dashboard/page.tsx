import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminHeader } from '@/widgets/adminHeader';
import { AdminGuard } from '@/features/adminAuth';

export const metadata: Metadata = { title: '대시보드' };

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <AdminHeader currentHref="/admin/dashboard" />
                <main className="mx-auto max-w-page px-gutter py-10">
                    <h1 className="text-section font-bold text-strong">대시보드</h1>
                </main>
            </AdminGuard>
        </Suspense>
    );
}
