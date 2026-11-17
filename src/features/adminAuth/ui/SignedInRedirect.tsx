import { redirect } from 'next/navigation';

import { ADMIN_ROUTE } from '@/entities/session/model/session.constants';
import { getSession } from '@/entities/session/services/session.services';

/**
 * 이미 로그인했으면 작업 목록으로 보낸다. 아무것도 그리지 않는다.
 * 쿠키를 읽으므로 Suspense 안에 둔다.
 */
export default async function SignedInRedirect() {
    const session = await getSession();
    if (session) {
        redirect(ADMIN_ROUTE.HOME);
    }
    return null;
}
