/** 프로젝트별 조회수의 한 줄 */
export interface ProjectViewRowData {
    id: string;
    title: string;
    isPublished: boolean;
    pageViews: number;
    /** 평균 참여 시간 — `2분 10초`. 조회가 없으면 null */
    durationText: string | null;
}
