import type { Column, Row, RowData, Table } from '@tanstack/react-table';

/*
 * TanStack Table 의 컬럼 · 표 meta 에 DataTable 이 쓰는 값을 더한다.(src/shared/ui/dataTable/dataTable.tsx)
 * meta 는 라이브러리가 비워 둔 자리라, 여기서 타입을 채워야 컬럼 정의와 셀에서 any 없이 읽는다.
 */
declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        /**
         * 열의 폭과 정렬. 문자열이면 머리 셀과 몸 셀에 함께 붙는다.
         * 함수면 행마다 다른 클래스를 낼 수 있고, 몸 셀에만 붙는다
         */
        className?:
            | string
            | ((context: {
                  row: Row<TData>;
                  column: Column<TData, TValue>;
                  table: Table<TData>;
              }) => string);
    }

    interface TableMeta<TData extends RowData> {
        /** DataTable 에 넘긴 data 통째로 */
        fullData: { content: TData[]; totalElements: number; page?: number } | null | undefined;
        /** 전체 건수 */
        totalCount: number;
        /** 지금 페이지. 1부터 센다 */
        pageIndex: number;
        /** 한 페이지 건수 */
        pageSize: number;
        /** DataTable 의 meta prop 으로 넘긴 값 */
        [key: string]: unknown;
    }
}
