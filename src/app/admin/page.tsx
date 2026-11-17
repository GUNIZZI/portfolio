import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard, LogoutButton } from '@/features/adminAuth';

export const metadata: Metadata = { title: '작업 관리' };

export default function AdminPage() {
    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <main className="mx-auto max-w-page px-gutter py-10">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-section font-bold text-strong">작업 관리</h1>
                        <LogoutButton />
                    </div>
                </main>
            </AdminGuard>
        </Suspense>
    );
}
