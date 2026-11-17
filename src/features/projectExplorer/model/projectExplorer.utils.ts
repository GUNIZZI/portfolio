/** 주소에 고른 분류를 남기는 이름 — /work?category=Dashboard */
export const CATEGORY_PARAM = 'category';

/** 작업들에 있는 분류를 처음 나온 순서대로, 중복 없이 낸다 */
export function toCategoryList(items: readonly { category: string }[]): string[] {
    return [...new Set(items.map((item) => item.category))];
}

/** 주소에 적힌 값이 목록에 있는 분류일 때만 받는다. 없는 분류면 전체(null)로 본다 */
export function toSelectedCategory(value: string | null, categories: readonly string[]) {
    return value && categories.includes(value) ? value : null;
}
