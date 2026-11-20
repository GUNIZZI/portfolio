import {
    type AnalyticsPagePath,
    type AnalyticsPeriodDays,
    DEFAULT_ANALYTICS_PERIOD_DAYS,
} from '@/entities/analytics/model/analytics.constants';

/** 대시보드의 주소 */
export const DASHBOARD_ROUTE = '/admin/dashboard';

/**
 * 기간을 고른 대시보드의 주소. 고른 기간은 주소에 남긴다.
 * 30일은 처음 값이라 적지 않는다.(docs/plan/admin/dashboard/README.md 「기간」)
 */
export function toPeriodHref(days: AnalyticsPeriodDays): string {
    return days === DEFAULT_ANALYTICS_PERIOD_DAYS
        ? DASHBOARD_ROUTE
        : `${DASHBOARD_ROUTE}?days=${days}`;
}

/** 프로젝트 수정 화면의 주소. 프로젝트별 조회수의 제목이 간다 */
export function toProjectEditHref(id: string): string {
    return `/admin/projects/${id}`;
}

/** 페이지별 조회수에 적는 페이지 이름 */
export const PAGE_LABEL: Record<AnalyticsPagePath, string> = {
    '/': '홈',
    '/work': '프로젝트 목록',
    '/about': '소개',
    '/colophon': '이 사이트는 이렇게',
};

/** 새 탭으로 여는 외부 화면. 전송량은 그리지 않고 Vercel 에서 본다.(docs/plan/admin/dashboard/README.md 요구사항 5) */
export const EXTERNAL_LINKS = [
    { label: 'GA 콘솔', href: 'https://analytics.google.com/' },
    { label: 'Vercel 사용량', href: 'https://vercel.com/dashboard/usage' },
] as const;

/**
 * 문구. 와이어프레임의 초안을 채택했다.(2026-11-20 사용자 결정, docs/plan/admin/dashboard/wireframe.html S-03 「문구」)
 * REFRESHED 는 초안에 없어 더했다. 새로 고침의 결과를 알리는 데 쓴다
 */
export const DASHBOARD_MESSAGE = {
    NOTICE: 'GA 의 통계는 하루쯤 늦게 반영됩니다. 광고 차단 도구를 쓰는 방문은 세어지지 않습니다.',
    LOADING: '통계를 불러오고 있습니다.',
    EMPTY: '아직 모인 데이터가 없습니다.',
    LOAD_FAILED_TITLE: '통계를 불러오지 못했습니다',
    LOAD_FAILED_DESCRIPTION: '잠시 뒤에 다시 시도해 주세요.',
    BLOCK_FAILED: '이 항목을 불러오지 못했습니다',
    REFRESH_FAILED_TITLE: '새 통계를 받지 못했습니다',
    REFRESH_FAILED_DESCRIPTION: '이전에 받은 값을 보여 주고 있습니다.',
    REFRESHED: '새 통계를 받았습니다',
} as const;
