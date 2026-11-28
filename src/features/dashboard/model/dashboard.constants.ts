import {
    type AnalyticsPagePath,
    type AnalyticsPeriodDays,
    DEFAULT_ANALYTICS_PERIOD_DAYS,
} from '@/entities/analytics/model/analytics.constants';
import { PLAN_VIEWER_HREF } from '@/config/nav';

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

/** 기획 뷰어에서 그 문서를 여는 주소. 기획 문서별 조회수의 이름이 새 탭으로 연다 */
export function toPlanViewerHref(key: string): string {
    return `${PLAN_VIEWER_HREF}#${key}`;
}

/** 페이지별 조회수에 적는 페이지 이름 */
export const PAGE_LABEL: Record<AnalyticsPagePath, string> = {
    '/': '홈',
    '/project': '프로젝트 목록',
    '/about': '소개',
    '/colophon': '제작 과정',
};

/**
 * 방문자 추이의 선 2개. 색만으로 구별하지 않게 조회수는 점선으로 그린다.
 * 토큰을 새로 만들지 않고 있는 색을 쓴다.(2026-11-25 사용자 결정)
 */
export const TREND_SERIES = [
    {
        key: 'visitors',
        label: '방문자',
        unit: '명',
        valueKey: 'visitors',
        yKey: 'visitorsY',
        strokeClass: 'stroke-brand-soft',
        dotClass: 'bg-brand-soft',
        dash: undefined,
    },
    {
        key: 'pageViews',
        label: '조회수',
        unit: '회',
        valueKey: 'pageViews',
        yKey: 'pageViewsY',
        strokeClass: 'stroke-info',
        dotClass: 'bg-info',
        dash: '6 4',
    },
] as const;

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
    NOTICE: 'Google 애널리틱스 통계는 약 하루 뒤에 반영됩니다. 광고 차단 도구를 사용하는 방문은 집계에서 빠질 수 있습니다.',
    LOADING: '통계를 불러오고 있습니다.',
    EMPTY: '선택한 기간에 집계된 데이터가 없습니다.',
    LOAD_FAILED_TITLE: '통계를 불러오지 못했습니다',
    LOAD_FAILED_DESCRIPTION: '잠시 후 다시 시도해 주세요.',
    BLOCK_FAILED: '이 항목을 불러오지 못했습니다',
    REFRESH_FAILED_TITLE: '통계를 새로 불러오지 못했습니다',
    REFRESH_FAILED_DESCRIPTION: '마지막으로 불러온 통계를 표시합니다.',
    REFRESHED: '최신 통계를 불러왔습니다',
} as const;
