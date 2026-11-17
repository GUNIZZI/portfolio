import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminLogin, SignedInRedirect } from '@/features/adminAuth';

export const metadata: Metadata = { title: '로그인' };

export default function AdminLoginPage() {
    return (
        <>
            <Suspense fallback={null}>
                <SignedInRedirect />
            </Suspense>
            <AdminLogin />
        </>
    );
}
