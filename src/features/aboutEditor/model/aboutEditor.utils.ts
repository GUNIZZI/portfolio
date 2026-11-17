import { withObjectParticle } from '@/shared/util/josa';

/**
 * 목록의 한 줄을 위나 아래로 옮긴 새 목록을 만든다
 * @param list - 원래 목록
 * @param index - 옮길 줄의 자리
 * @param offset - 위로는 -1, 아래로는 1
 * @returns 옮긴 목록. 끝을 넘어가면 원래 목록 그대로다
 */
export function moveItem<Item>(list: readonly Item[], index: number, offset: -1 | 1): Item[] {
    const target = index + offset;
    const next = [...list];
    const current = next[index];
    const swapped = next[target];
    if (current === undefined || swapped === undefined) {
        return next;
    }
    next[index] = swapped;
    next[target] = current;
    return next;
}

/**
 * 목록의 한 항목을 뽑아 다른 자리에 끼운 새 목록을 만든다
 * @param list - 원래 목록
 * @param from - 옮길 항목의 자리
 * @param to - 끼울 자리. 원래 목록에서 이 자리의 항목 앞에 끼운다. 맨 끝은 list.length 다
 * @returns 옮긴 목록. from 이 목록 밖이면 원래 목록 그대로다
 * @example moveItemTo(['a', 'b', 'c'], 0, 3) // ['b', 'c', 'a']
 */
export function moveItemTo<Item>(list: readonly Item[], from: number, to: number): Item[] {
    const next = [...list];
    const [moved] = next.splice(from, 1);
    if (moved === undefined) {
        return [...list];
    }
    // 뽑은 자리보다 뒤에 끼우면, 뽑으면서 자리가 하나씩 당겨졌다
    next.splice(to > from ? to - 1 : to, 0, moved);
    return next;
}

/** 목록의 한 줄을 뺀 새 목록 */
export function removeItem<Item>(list: readonly Item[], index: number): Item[] {
    return list.filter((_, itemIndex) => itemIndex !== index);
}

/** 목록의 한 줄을 바꾼 새 목록 */
export function replaceItem<Item>(list: readonly Item[], index: number, item: Item): Item[] {
    return list.map((current, itemIndex) => (itemIndex === index ? item : current));
}

/**
 * 필수 항목이 비었을 때의 오류 문구
 * @param label - 항목의 이름
 * @param value - 지금 값
 * @returns 비었으면 문구, 아니면 undefined
 */
export function requiredError(label: string | undefined, value: string): string | undefined {
    return value.trim() === '' && label ? `${withObjectParticle(label)} 입력해 주세요.` : undefined;
}
