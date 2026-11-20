/** 고를 수 있는 기간(일). 오늘은 넣지 않는다.(docs/plan/admin/dashboard/README.md 「기간」) */
export const ANALYTICS_PERIOD_DAYS = [7, 30, 90] as const;
export type AnalyticsPeriodDays = (typeof ANALYTICS_PERIOD_DAYS)[number];

/** 주소에 기간이 없거나 3가지가 아닌 값일 때의 기간 */
export const DEFAULT_ANALYTICS_PERIOD_DAYS: AnalyticsPeriodDays = 30;

/**
 * 페이지별 조회수가 세는 주소. 공개 화면의 메뉴 4개다.
 * 프로젝트 상세는 프로젝트별 조회수가 따로 센다.(docs/plan/admin/dashboard/README.md 「블록별 규칙」)
 */
export const ANALYTICS_PAGE_PATHS = ['/', '/work', '/about', '/colophon'] as const;
export type AnalyticsPagePath = (typeof ANALYTICS_PAGE_PATHS)[number];

/** 프로젝트 상세 주소의 앞부분. 뒤에 프로젝트의 id 가 붙는다 */
export const ANALYTICS_PROJECT_PATH_PREFIX = '/work/';

/** 수집하지 않는 주소의 앞부분. 관리 화면이다.(docs/plan/admin/dashboard/README.md 요구사항 9) */
export const ANALYTICS_EXCLUDED_PATH_PREFIX = '/admin';

/** 통계의 캐시 태그. 기간마다 따로 간직하므로 새로 고침은 그 기간의 캐시만 지운다 */
export function toAnalyticsCacheTag(days: AnalyticsPeriodDays): string {
    return `analytics-${days}`;
}
