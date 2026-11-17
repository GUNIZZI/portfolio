import { redirect } from 'next/navigation';

import { ADMIN_ROUTE } from '@/entities/session/model/session.constants';
import { getSession } from '@/entities/session/services/session.services';

/**
 * /admin 으로 들어온 요청을 보낸다. 아무것도 그리지 않는다.
 * 세션이 있으면 대시보드, 없으면 로그인이다.(docs/plan/admin/login/README.md 요구사항 5)
 * 쿠키를 읽으므로 Suspense 안에 둔다.
 */
export default async function AdminEntry(): Promise<null> {
    const session = await getSession();
    redirect(session ? ADMIN_ROUTE.HOME : ADMIN_ROUTE.LOGIN);
}
