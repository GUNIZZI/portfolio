import type { ReactNode } from 'react';

import { requireSession } from '@/entities/session/services/session.services';

interface OwnProps {
    children: ReactNode;
}

/**
 * 로그인한 관리자에게만 안쪽을 그린다. 세션이 없으면 로그인 화면으로 보낸다.
 * 쿠키를 읽으므로 Suspense 안에 둔다.
 */
export default async function AdminGuard({ children }: OwnProps) {
    await requireSession();
    return children;
}
