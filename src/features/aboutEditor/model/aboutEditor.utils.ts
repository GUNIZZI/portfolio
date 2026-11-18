/**
 * 글 목록(`lines`)의 오류를 줄마다의 문구로 바꾼다.
 * react-hook-form 은 배열 항목의 오류를 줄과 같은 자리의 배열로 준다. 타입은 오류 1건으로 적혀 있어 모양을 직접 본다
 * @param error - 목록 항목의 오류. 없으면 undefined
 * @returns 줄과 같은 순서의 문구. 문제가 없는 줄은 undefined 다
 */
export function toLineErrors(error: unknown): (string | undefined)[] | undefined {
    if (!Array.isArray(error)) {
        return undefined;
    }
    return error.map((item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        'message' in item &&
        typeof item.message === 'string'
            ? item.message
            : undefined,
    );
}
