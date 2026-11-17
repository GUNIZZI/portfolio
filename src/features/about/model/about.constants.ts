import type { IconName } from '@/shared/ui/icon/Icon';

/**
 * 숫자 3개에 붙이는 아이콘. 숫자의 순서와 같다.
 * 아이콘은 코드에 있는 이름이라 관리 화면에서 고치지 않는다.(docs/plan/admin/about/README.md 「소개 내용」)
 */
export const ABOUT_STAT_ICONS = ['cake', 'users', 'star'] as const satisfies readonly IconName[];
