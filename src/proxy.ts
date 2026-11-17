import { type NextRequest, NextResponse } from 'next/server';

import { ADMIN_ROUTE, SESSION_COOKIE_NAME } from '@/entities/session/model/session.constants';

/**
 * 관리 화면의 1차 검사. 세션 쿠키가 없으면 페이지를 그리기 전에 로그인 화면으로 보낸다.
 * 쿠키가 있는지만 본다. 값이 맞는지는 페이지와 서버 액션이 검증한다.(features/adminAuth 의 AdminGuard)
 */
export function proxy(request: NextRequest) {
    const isLogin = request.nextUrl.pathname === ADMIN_ROUTE.LOGIN;
    if (isLogin || request.cookies.has(SESSION_COOKIE_NAME)) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL(ADMIN_ROUTE.LOGIN, request.url));
}

export const config = {
    matcher: '/admin/:path*',
};
