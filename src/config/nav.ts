/**
 * 헤더 메뉴. 메뉴 하나가 페이지 하나다.(2026-11-16 사용자 결정)
 * 기술(Skills)은 전용 페이지가 없어 메뉴에 두지 않는다. 연락은 헤더의 Contact 버튼이 맡는다.
 */
export const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/work' },
    { label: 'About', href: '/about' },
] as const;

/** 푸터 메뉴. 헤더 메뉴에 연락을 더한 것이다. 연락의 주소는 페이지마다 달라 푸터가 따로 받는다 */
export const FOOTER_NAV_ITEMS = NAV_ITEMS;

/** 메뉴가 가리키는 페이지의 주소. 헤더가 지금 주소에서 찾은 메뉴를 나타낼 때 쓴다 */
export type NavHref = (typeof NAV_ITEMS)[number]['href'];

/** 관리 화면의 메뉴. 순서와 주소는 docs/plan/admin/dashboard/README.md 요구사항 6 */
export const ADMIN_NAV_ITEMS = [
    { label: '대시보드', href: '/admin/dashboard' },
    { label: '프로젝트', href: '/admin/projects' },
    { label: '소개', href: '/admin/about' },
    { label: '경력', href: '/admin/experiences' },
] as const;
