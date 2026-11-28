/**
 * 기획 문서의 목록. scripts/build-plan-index.mjs 가 docs/plan/README.md 「구조」 표에서 만든다.
 * 손으로 고치지 않는다. 표를 고치고 `pnpm plan-index` 를 다시 실행한다.
 * 순서는 기획 뷰어의 왼쪽 메뉴와 같다.
 */
export const PLAN_DOCS = [
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'home',
        name: '메인 > 홈',
        route: '/',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'work',
        name: '작업 > 목록 · 상세',
        route: '/project · /project/[id]',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'about',
        name: '소개 > 소개',
        route: '/about',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'colophon',
        name: '공통 > 제작 과정',
        route: '/colophon',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'not-found',
        name: '공통 > 찾을 수 없음',
        route: '없는 모든 주소 (app/not-found.tsx)',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'admin/login',
        name: '관리 > 로그인',
        route: '/admin · /admin/login',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'admin/dashboard',
        name: '관리 > 대시보드',
        route: '/admin/dashboard',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'admin',
        name: '관리 > 프로젝트',
        route: '/admin/projects · /admin/projects/new · /admin/projects/[id]',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'admin/about',
        name: '관리 > 소개',
        route: '/admin/about',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'admin/experiences',
        name: '관리 > 경력',
        route: '/admin/experiences · /admin/experiences/new · /admin/experiences/[id]',
    },
    {
        /** 기획 폴더의 경로. 뷰어의 주소 해시이고, 조회를 모으는 주소의 끝부분이다 */
        key: 'admin/colophon',
        name: '관리 > 제작 과정',
        route: '/admin/colophon',
    },
] as const;

export type PlanDoc = (typeof PLAN_DOCS)[number];
