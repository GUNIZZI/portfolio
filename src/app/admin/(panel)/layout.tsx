import { Suspense } from 'react';

import { AdminHeader } from '@/widgets/adminHeader';
import { AdminGuard } from '@/features/adminAuth';

/**
 * 로그인을 뺀 관리 화면의 틀. 머리를 여기서 한 번만 그려, 메뉴를 옮겨도 본문만 바뀐다.
 * 레이아웃은 화면을 옮길 때 다시 실행되지 않는다. 그래서 페이지도 AdminGuard 로 세션을 따로 검사한다.
 */
export default function AdminPanelLayout({ children }: LayoutProps<'/admin'>) {
    return (
        <>
            {/* 세션 쿠키와 지금 주소를 읽으므로 Suspense 안에 둔다 */}
            <Suspense fallback={null}>
                <AdminGuard>
                    <AdminHeader />
                </AdminGuard>
            </Suspense>
            {children}
        </>
    );
}
