import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getServerEnv } from '@/shared/util/serverEnv';

import { ADMIN_ROUTE, SESSION_COOKIE_NAME } from '../model/session.constants';
import type { SessionData } from '../model/session.types';
import { sessionRepository } from '../repositories/session.repositories';

/** 관리자로 등록한 계정인가. Firebase Auth 에 있는 계정이어도 UID 가 다르면 관리자가 아니다 */
function isAdmin(uid: string): boolean {
    return uid === getServerEnv().ADMIN_UID;
}

/**
 * 이메일과 비밀번호를 확인하고 세션 쿠키 값을 만든다
 * @returns 계정이나 비밀번호가 틀렸거나 관리자가 아니면 null
 */
export async function createAdminSession(email: string, password: string): Promise<string | null> {
    const signIn = await sessionRepository.signIn(email, password);
    if (!signIn || !isAdmin(signIn.uid)) {
        return null;
    }
    return sessionRepository.createSessionCookie(signIn.idToken);
}

/**
 * 세션 쿠키 값을 검증한다
 * @returns 값이 없거나, 검증에 실패했거나, 관리자가 아니면 null
 */
export async function verifyAdminSession(cookie: string | undefined): Promise<SessionData | null> {
    if (!cookie) {
        return null;
    }
    const session = await sessionRepository.verifySessionCookie(cookie);
    if (!session || !isAdmin(session.uid)) {
        return null;
    }
    return { uid: session.uid };
}

/** 지금 요청의 세션을 읽는다. 한 요청 안에서는 한 번만 검증한다 */
export const getSession = cache(async (): Promise<SessionData | null> => {
    const cookieStore = await cookies();
    return verifyAdminSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
});

/** 세션이 없으면 로그인 화면으로 보낸다. 관리 화면과 서버 액션이 맨 먼저 부른다 */
export async function requireSession(): Promise<SessionData> {
    const session = await getSession();
    if (!session) {
        redirect(ADMIN_ROUTE.LOGIN);
    }
    return session;
}
