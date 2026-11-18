/**
 * 전체 페이지 수
 * @returns 건수가 0이어도 1이다
 */
export function getTotalPages(totalCount: number, pageSize: number): number {
    return Math.ceil(totalCount / pageSize) || 1;
}

/**
 * 한 번에 늘어놓을 페이지 번호를 만든다. 지금 페이지를 가운데 두고, 끝에 닿으면 반대쪽으로 민다.
 * 늘어놓을 개수가 짝수면 가운데가 없어 앞쪽을 한 칸 짧게 둔다
 * @param page - 지금 페이지. 1부터 센다
 * @param totalPages - 전체 페이지 수
 * @param visiblePages - 한 번에 늘어놓을 번호의 개수
 * @example getPageNumbers(8, 20, 5) // [6, 7, 8, 9, 10]
 * @example getPageNumbers(1, 3, 5) // [1, 2, 3]
 */
export function getPageNumbers(page: number, totalPages: number, visiblePages: number): number[] {
    if (totalPages <= 1) {
        return [1];
    }
    const endPage = Math.min(
        totalPages,
        Math.max(1, page - Math.floor((visiblePages - 1) / 2)) + visiblePages - 1,
    );
    const startPage = Math.max(1, endPage - visiblePages + 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}
