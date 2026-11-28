import type {
    AnalyticsPlanViewData,
    AnalyticsProjectViewData,
    AnalyticsTrendDayData,
} from '@/entities/analytics/model/analytics.types';
import type { ProjectOptionData } from '@/entities/project/model/project.types';
import type { PlanDoc } from '@/config/planDocs';

import type {
    PlanViewRowData,
    ProjectViewRowData,
    TrendChartData,
    TrendChartLabelData,
} from './dashboard.types';

/**
 * 프로젝트에 조회수를 이어 붙여 조회수가 많은 순으로 놓는다.
 * 공개 · 비공개를 모두 적고, 조회가 없는 프로젝트는 0으로 적는다.
 * 삭제한 프로젝트의 조회수는 이을 제목이 없어 뺀다.(docs/plan/admin/dashboard/README.md 「블록별 규칙」)
 * @param projects - 관리 화면의 순서로 놓인 프로젝트 전체. 조회수가 같으면 이 순서를 따른다
 * @param views - 조회가 있는 프로젝트의 조회수
 */
export function toProjectViewRowList(
    projects: readonly ProjectOptionData[],
    views: readonly AnalyticsProjectViewData[],
): ProjectViewRowData[] {
    const byId = new Map(views.map((view) => [view.projectId, view]));

    return projects
        .map((project) => {
            const view = byId.get(project.id);
            return {
                id: project.id,
                title: project.title,
                isPublished: project.isPublished,
                pageViews: view?.pageViews ?? 0,
                durationText: view?.durationText ?? null,
            };
        })
        .toSorted((a, b) => b.pageViews - a.pageViews);
}

/**
 * 기획 문서에 조회수를 이어 붙여 조회수가 많은 순으로 놓는다. 조회가 없는 문서는 0으로 적는다.
 * 목록에 없는 주소의 조회수는 이을 이름이 없어 뺀다. 지운 기획 문서나 부품 견본이다.
 * (docs/plan/admin/dashboard/README.md 「블록별 규칙」)
 * @param docs - 뷰어의 메뉴 순서로 놓인 기획 문서 전체. 조회수가 같으면 이 순서를 따른다
 * @param views - 조회가 있는 문서의 조회수
 */
export function toPlanViewRowList(
    docs: readonly PlanDoc[],
    views: readonly AnalyticsPlanViewData[],
): PlanViewRowData[] {
    const byKey = new Map(views.map((view) => [view.key, view]));

    return docs
        .map((doc) => {
            const view = byKey.get(doc.key);
            return {
                key: doc.key,
                name: doc.name,
                route: doc.route,
                pageViews: view?.pageViews ?? 0,
                durationText: view?.durationText ?? null,
            };
        })
        .toSorted((a, b) => b.pageViews - a.pageViews);
}

/** 세로 눈금의 칸 수가 이 값을 넘지 않게 간격을 고른다 */
const MAX_TICK_INTERVALS = 5;
/** 가로축에 적는 날짜가 이 개수를 넘지 않게 건너뛴다 */
const MAX_X_LABELS = 7;

/** 눈금 간격. 1 · 2 · 5 에 10의 거듭제곱을 곱한 값에서 칸 수가 넘치지 않는 가장 작은 것이다 */
function toTickStep(max: number): number {
    for (let unit = 1; ; unit *= 10) {
        for (const base of [1, 2, 5]) {
            if (max <= base * unit * MAX_TICK_INTERVALS) {
                return base * unit;
            }
        }
    }
}

/** 양 끝의 날짜는 안쪽으로 붙이고 나머지는 가운데에 맞춘다 */
function toLabelAlign(x: number): TrendChartLabelData['align'] {
    if (x === 0) {
        return 'start';
    }
    return x === 100 ? 'end' : 'center';
}

function toPercent(ratio: number): number {
    return Math.round(ratio * 10000) / 100;
}

/**
 * 일별 값을 꺾은선 그래프의 자리로 바꾼다. 방문자와 조회수는 같은 세로 눈금을 쓴다.
 * 가로축의 날짜는 마지막 날부터 거꾸로 세어 고른다. 가장 최근 날짜가 늘 적힌다.
 * @param days - 기간의 모든 날. 날짜 순이다
 */
export function toTrendChart(days: readonly AnalyticsTrendDayData[]): TrendChartData {
    const lastIndex = days.length - 1;
    const max = Math.max(0, ...days.flatMap((day) => [day.visitors, day.pageViews]));
    const tickStep = toTickStep(max);
    const top = Math.max(1, Math.ceil(max / tickStep)) * tickStep;
    const toY = (value: number) => toPercent(1 - value / top);
    const toX = (index: number) => (lastIndex > 0 ? toPercent(index / lastIndex) : 50);

    const points = days.map((day, index) => ({
        ...day,
        x: toX(index),
        visitorsY: toY(day.visitors),
        pageViewsY: toY(day.pageViews),
    }));

    const yTicks = [];
    for (let value = 0; value <= top; value += tickStep) {
        yTicks.push({ value, y: toY(value) });
    }

    const labelStep = Math.ceil(days.length / MAX_X_LABELS);
    const xLabels = points
        .filter((_, index) => (lastIndex - index) % labelStep === 0)
        .map((point, index, list) => ({
            text: point.dateText,
            x: point.x,
            align: toLabelAlign(point.x),
            isMinor: (list.length - 1 - index) % 2 === 1,
        }));

    const peakVisitors = days.toSorted((a, b) => b.visitors - a.visitors).at(0);
    const peakPageViews = days.toSorted((a, b) => b.pageViews - a.pageViews).at(0);
    const summaryText =
        peakVisitors && peakPageViews
            ? `일별 방문자와 조회수의 꺾은선 그래프. 방문자는 ${peakVisitors.dateText} 에 ${peakVisitors.visitors.toLocaleString('ko-KR')}명으로, 조회수는 ${peakPageViews.dateText} 에 ${peakPageViews.pageViews.toLocaleString('ko-KR')}회로 가장 많다. 같은 값이 아래 표에 있다.`
            : '';

    return { points, yTicks, xLabels, summaryText };
}
