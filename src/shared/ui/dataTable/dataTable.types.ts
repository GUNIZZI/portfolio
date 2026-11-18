/**
 * DataTable 이 받는 목록 한 페이지. Kozipsa 의 백엔드 목록 응답과 같은 모양이다.
 * 자르는 일은 바깥이 하고, DataTable 은 받은 행만 그린다
 */
export interface DataTablePage<TRow> {
    /** 이 페이지의 행 */
    content: TRow[];
    /** 전체 건수. 페이저와 「전체 N」 이 이 값을 쓴다 */
    totalElements: number;
    /** 이 페이지의 번호. 1부터 센다. 번호 열이 역순 일련번호를 만들 때 읽는다 */
    page?: number;
    totalPages?: number;
}
