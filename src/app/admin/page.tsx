import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminEntry } from '@/features/adminAuth';

export const metadata: Metadata = { title: '관리' };

// 화면을 그리지 않는다. 세션에 따라 로그인이나 대시보드로 보낸다
export default function AdminPage() {
    return (
        <Suspense fallback={null}>
            <AdminEntry />
        </Suspense>
    );
}
