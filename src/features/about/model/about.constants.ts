import type { IconName } from '@/shared/ui/icon/Icon';

/** 소개 문단. 줄마다 한 항목이다 */
export const ABOUT_LINES = [
    '안녕하세요! 프론트엔드 개발자 GUNI입니다.',
    '사용자에게 더 나은 경험을 제공하기 위해,',
    '오늘도 새로운 기술과 아이디어를 고민합니다.',
] as const;

/** 숫자는 원본 디자인(sample/)의 값이다. 사용자가 나중에 실제 값으로 바꾼다 */
export const ABOUT_STATS = [
    { value: '40+', label: 'Years Old', icon: 'cake' },
    { value: '20+', label: 'Projects', icon: 'users' },
    { value: '7+', label: 'Years of Experience', icon: 'star' },
] as const satisfies readonly { value: string; label: string; icon: IconName }[];
