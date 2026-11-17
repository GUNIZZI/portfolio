import { ABOUT_SECTION, type AboutSection } from '@/entities/about/model/about.constants';

/** 섹션의 이름. 화면의 제목과 토스트 문구에 쓴다 */
export const SECTION_LABEL = {
    [ABOUT_SECTION.INTRO]: '인트로',
    [ABOUT_SECTION.PRINCIPLES]: '일하는 방식',
    [ABOUT_SECTION.SKILL_GROUPS]: 'Skill 관리',
    [ABOUT_SECTION.HOME]: '홈 소개',
} as const satisfies Record<AboutSection, string>;

/** 섹션이 보이는 곳. 제목 아래에 적는다 */
export const SECTION_PLACE = {
    [ABOUT_SECTION.INTRO]: '소개 페이지',
    [ABOUT_SECTION.PRINCIPLES]: '소개 페이지 · 4가지',
    [ABOUT_SECTION.SKILL_GROUPS]: '소개 페이지 · 8개',
    [ABOUT_SECTION.HOME]: '홈의 소개 섹션',
} as const satisfies Record<AboutSection, string>;

/** 토스트를 띄워 두는 시간(ms) */
export const TOAST_DURATION_MS = 3000;

/** 문구. 초안이다.(docs/plan/admin/about/README.md 검토 필요 사항의 「문구」) */
export const EDITOR_MESSAGE = {
    SAVE_FAILED: '저장하지 못했습니다. 다시 시도해 주세요',
    NOT_DIRTY: '고친 내용이 없습니다',
    INVALID: '필수 항목을 입력해 주세요',
    LOAD_FAILED_TITLE: '소개 내용을 불러오지 못했습니다',
    LOAD_FAILED_DESCRIPTION: '잠시 뒤에 다시 시도해 주세요.',
} as const;
