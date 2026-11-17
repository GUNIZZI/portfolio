/** 소개 내용의 섹션. 값은 Firestore 의 about 컬렉션에 있는 문서 이름이다 */
export const ABOUT_SECTION = {
    INTRO: 'intro',
    PRINCIPLES: 'principles',
    SKILL_GROUPS: 'skillGroups',
    HOME: 'home',
} as const;
export type AboutSection = (typeof ABOUT_SECTION)[keyof typeof ABOUT_SECTION];

/** 소개 내용을 두는 Firestore 컬렉션 */
export const ABOUT_COLLECTION = 'about';

/** 소개 내용의 캐시 태그. 저장하면 이 태그의 캐시를 지운다 */
export const ABOUT_CACHE_TAG = 'about';

/** 개수가 고정인 목록. 소개 기획이 정했다.(docs/plan/admin/about/README.md 「소개 내용」) */
export const ABOUT_COUNT = {
    PRINCIPLES: 4,
    SKILL_GROUPS: 8,
    STATS: 3,
    /** 성장 경로의 최소 개수 */
    GROWTH_PATH_MIN: 2,
} as const;
