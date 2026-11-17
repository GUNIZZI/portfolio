'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
    ADMIN_ROUTE,
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
} from '../model/session.constants';
import { LoginFormSchema } from '../model/session.schemas';
import { LOGIN_STATUS, type LoginStateData } from '../model/session.types';
import { createAdminSession } from '../services/session.services';

/**
 * 로그인한다. 성공하면 세션 쿠키를 심고 대시보드로 보낸다.
 * 실패하면 세션을 만들지 않고 상태만 돌려준다. 이메일과 비밀번호 중 무엇이 틀렸는지는 알리지 않는다.
 */
export async function login(_prev: LoginStateData, formData: FormData): Promise<LoginStateData> {
    const form = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    if (!form.success) {
        return { status: LOGIN_STATUS.REJECTED };
    }

    let sessionCookie: string | null;
    try {
        sessionCookie = await createAdminSession(form.data.email, form.data.password);
    } catch (error) {
        console.error(error);
        return { status: LOGIN_STATUS.FAILED };
    }
    if (!sessionCookie) {
        return { status: LOGIN_STATUS.REJECTED };
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
    });
    // redirect 는 예외를 던져 흐름을 끊는다. try 밖에서 부른다
    redirect(ADMIN_ROUTE.HOME);
}

/** 로그아웃한다. 세션 쿠키를 지우고 로그인 화면으로 보낸다 */
export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect(ADMIN_ROUTE.LOGIN);
}
