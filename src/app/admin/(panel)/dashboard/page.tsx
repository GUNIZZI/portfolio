import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard, AdminGuardFallback } from '@/features/adminAuth';
import { Dashboard } from '@/features/dashboard';

export const metadata: Metadata = { title: '대시보드' };

export default function AdminDashboardPage({ searchParams }: PageProps<'/admin/dashboard'>) {
    return (
        <Suspense fallback={<AdminGuardFallback />}>
            <AdminGuard>
                <Dashboard searchParams={searchParams} />
            </AdminGuard>
        </Suspense>
    );
}
