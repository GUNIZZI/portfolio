/** Firebase Auth 로그인 응답 */
export interface SignInResponse {
    uid: string;
    idToken: string;
}

/** 세션 쿠키를 검증해 얻은 원문 */
export interface SessionResponse {
    uid: string;
}

/** 화면과 서버 액션이 쓰는 세션 */
export interface SessionData {
    uid: string;
}

export const LOGIN_STATUS = {
    /** 아직 로그인을 시도하지 않았다 */
    IDLE: 'IDLE',
    /** 등록한 계정이 아니거나 비밀번호가 다르다 */
    REJECTED: 'REJECTED',
    /** Firebase 에 닿지 못했거나 설정이 잘못됐다 */
    FAILED: 'FAILED',
} as const;
export type LoginStatus = (typeof LOGIN_STATUS)[keyof typeof LOGIN_STATUS];

/** 로그인 서버 액션이 폼에 돌려주는 상태 */
export interface LoginStateData {
    status: LoginStatus;
}
