/** 로그인에 실패했을 때의 안내 문구. docs/plan/admin/wireframe.html S-01 */
export const LOGIN_NOTICE = {
    REJECTED: {
        title: '로그인하지 못했습니다',
        description: '이메일 또는 비밀번호를 확인해 주세요.',
    },
    FAILED: {
        title: '로그인하지 못했습니다',
        description: '잠시 후 다시 시도해 주세요.',
    },
} as const;
