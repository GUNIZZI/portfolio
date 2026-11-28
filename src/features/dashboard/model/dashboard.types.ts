/** 프로젝트별 조회수의 한 줄 */
export interface ProjectViewRowData {
    id: string;
    title: string;
    isPublished: boolean;
    pageViews: number;
    /** 평균 참여 시간 — `2분 10초`. 조회가 없으면 null */
    durationText: string | null;
}

/** 기획 문서별 조회수의 한 줄 */
export interface PlanViewRowData {
    /** 기획 폴더의 경로 — `admin/dashboard` */
    key: string;
    /** 뷰어의 메뉴에 적힌 이름 — `관리 > 대시보드` */
    name: string;
    /** 그 기획이 다루는 화면의 주소 */
    route: string;
    pageViews: number;
    /** 평균 참여 시간 — `2분 10초`. 조회가 없으면 null */
    durationText: string | null;
}

/** 꺾은선 그래프의 하루. 자리는 그래프 영역의 왼쪽 위를 0, 오른쪽 아래를 100 으로 잡은 비율이다 */
export interface TrendChartPointData {
    /** `2026-11-16` */
    date: string;
    /** `11.16` */
    dateText: string;
    visitors: number;
    pageViews: number;
    x: number;
    visitorsY: number;
    pageViewsY: number;
}

/** 세로 눈금 하나 */
export interface TrendChartTickData {
    value: number;
    y: number;
}

/** 가로축에 적는 날짜 하나 */
export interface TrendChartLabelData {
    /** `11.16` */
    text: string;
    x: number;
    /** 양 끝의 날짜는 그래프 밖으로 나가지 않게 안쪽으로 붙인다 */
    align: 'start' | 'center' | 'end';
    /** 좁은 화면에서 숨기는 날짜인가. 마지막 날부터 하나 걸러 숨겨, 날짜가 겹치지 않는다 */
    isMinor: boolean;
}

/** 방문자 추이의 꺾은선 그래프 */
export interface TrendChartData {
    points: TrendChartPointData[];
    /** 0부터 맨 위 눈금까지. 값이 작은 순이다 */
    yTicks: TrendChartTickData[];
    xLabels: TrendChartLabelData[];
    /** 그래프를 읽을 수 없을 때 대신 읽는 한 줄 */
    summaryText: string;
}
