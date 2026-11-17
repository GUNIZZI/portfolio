import 'server-only';

import { getFirebaseAuth } from '@/shared/util/firebaseAdmin';
import { getServerEnv } from '@/shared/util/serverEnv';

import { SESSION_MAX_AGE_SECONDS } from '../model/session.constants';
import { SignInErrorSchema, SignInSchema } from '../model/session.schemas';
import type { SessionResponse, SignInResponse } from '../model/session.types';

const SIGN_IN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

/** Firebase Auth 가 계정이나 비밀번호가 틀렸을 때 내는 오류 코드. 뒤에 설명이 붙어 오기도 한다 */
const REJECTED_CODES = [
    'INVALID_LOGIN_CREDENTIALS',
    'EMAIL_NOT_FOUND',
    'INVALID_PASSWORD',
    'INVALID_EMAIL',
    'USER_DISABLED',
] as const;

export interface SessionRepository {
    /**
     * 이메일과 비밀번호로 Firebase Auth 에 로그인한다
     * @returns 계정이나 비밀번호가 틀리면 null
     * @throws Firebase 에 닿지 못했거나 그 밖의 이유로 거절됐을 때
     * @see {@link SignInResponse}
     */
    signIn(email: string, password: string): Promise<SignInResponse | null>;

    /**
     * 로그인 토큰을 세션 쿠키 값으로 바꾼다
     * @returns 쿠키에 넣을 값. SESSION_MAX_AGE_SECONDS 뒤에 끝난다
     */
    createSessionCookie(idToken: string): Promise<string>;

    /**
     * 세션 쿠키 값을 검증한다
     * @returns 위조됐거나 기간이 끝났으면 null
     * @see {@link SessionResponse}
     */
    verifySessionCookie(cookie: string): Promise<SessionResponse | null>;
}

export const sessionRepository: SessionRepository = {
    async signIn(email, password) {
        const url = `${SIGN_IN_URL}?key=${getServerEnv().FIREBASE_WEB_API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
            cache: 'no-store',
        });
        const body: unknown = await response.json();

        if (response.ok) {
            const { localId, idToken } = SignInSchema.parse(body);
            return { uid: localId, idToken };
        }

        const error = SignInErrorSchema.safeParse(body);
        const message = error.success ? error.data.error.message : '';
        if (REJECTED_CODES.some((code) => message.startsWith(code))) {
            return null;
        }
        throw new Error(`Firebase Auth 로그인 요청 실패(${response.status}): ${message}`);
    },

    createSessionCookie(idToken) {
        return getFirebaseAuth().createSessionCookie(idToken, {
            expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
        });
    },

    async verifySessionCookie(cookie) {
        try {
            const { uid } = await getFirebaseAuth().verifySessionCookie(cookie);
            return { uid };
        } catch {
            return null;
        }
    },
};
