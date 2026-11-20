import { findNavHref, NAV_ITEMS } from '@/config/nav';

/** 페이지를 옮길 때의 연출. paint 는 붓질로 덮고, dissolve 는 붓질 없이 번지며 바뀐다 */
export type PageTransitionMode = 'paint' | 'dissolve';

/**
 * 옮기는 두 주소로 연출을 고른다.
 * 같은 메뉴 안의 이동(작업 목록 ↔ 상세, 상세 ↔ 상세)은 붓질을 빼고 디졸브만 한다.(2026-11-20 사용자 결정)
 */
export function toTransitionMode(from: string, to: string): PageTransitionMode {
    const fromNav = findNavHref(from);
    return fromNav !== null && fromNav === findNavHref(to) ? 'dissolve' : 'paint';
}

/**
 * 옮겨 가는 페이지가 메뉴에서 왼쪽에 있는가.
 * 참이면 붓질을 좌우로 뒤집어, 첫 획을 오른쪽에서 왼쪽으로 긋는다.
 * 순서가 같은 것은 메뉴에 없는 주소끼리 옮길 때뿐이다. 그때는 더 짧은 주소로 갈 때를 왼쪽으로 본다
 */
export function isLeftward(from: string, to: string): boolean {
    const fromOrder = NAV_ITEMS.findIndex((item) => item.href === findNavHref(from));
    const toOrder = NAV_ITEMS.findIndex((item) => item.href === findNavHref(to));
    if (fromOrder !== toOrder) return toOrder < fromOrder;
    return to.length < from.length;
}
