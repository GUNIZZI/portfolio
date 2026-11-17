/** 세션 쿠키의 이름 */
export const SESSION_COOKIE_NAME = 'admin_session';

/** 세션을 유지하는 시간(초). 2시간이다 (2026-11-17 사용자 결정) */
export const SESSION_MAX_AGE_SECONDS = 2 * 60 * 60;

/** 관리 화면의 주소 */
export const ADMIN_ROUTE = {
    HOME: '/admin',
    LOGIN: '/admin/login',
} as const;
