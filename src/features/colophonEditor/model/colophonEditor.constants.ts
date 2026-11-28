import {
    COLOPHON_ROLE,
    COLOPHON_ROLE_NAME,
    COLOPHON_SECTION,
    type ColophonSection,
} from '@/entities/colophon/model/colophon.constants';

/** 섹션의 이름. 화면의 제목과 토스트 문구에 쓴다 */
export const SECTION_LABEL = {
    [COLOPHON_SECTION.HEAD]: '페이지 소개',
    [COLOPHON_SECTION.PROCESS]: '전체 과정',
    [COLOPHON_SECTION.DESIGN]: '디자인',
    [COLOPHON_SECTION.DEVELOP]: '개발 과정',
    [COLOPHON_SECTION.GUARDS]: '품질을 지키는 방법',
    [COLOPHON_SECTION.HUMAN]: '제가 한 일',
    [COLOPHON_SECTION.STACK]: '기술과 폰트',
} as const satisfies Record<ColophonSection, string>;

/** 섹션이 보이는 곳. 제목 아래에 적는다 */
export const SECTION_PLACE = {
    [COLOPHON_SECTION.HEAD]: '한 줄 요약은 홈에도 표시됩니다.',
    [COLOPHON_SECTION.PROCESS]: '제작 과정 페이지의 PROCESS 섹션과 홈에 표시됩니다.',
    [COLOPHON_SECTION.DESIGN]: 'DESIGN 섹션에 표시됩니다.',
    [COLOPHON_SECTION.DEVELOP]: 'DEVELOP 섹션에 표시됩니다.',
    [COLOPHON_SECTION.GUARDS]: 'GUARDRAILS 섹션에 표시됩니다.',
    [COLOPHON_SECTION.HUMAN]: 'HUMAN 섹션에 표시됩니다.',
    [COLOPHON_SECTION.STACK]: 'STACK 섹션에 표시됩니다.',
} as const satisfies Record<ColophonSection, string>;

/** 역할을 고르는 선택 상자의 목록. 과정의 단계와 디자인의 단락이 쓴다 */
export const ROLE_OPTIONS = Object.values(COLOPHON_ROLE).map((role) => ({
    code: role,
    name: COLOPHON_ROLE_NAME[role],
}));

/** 문구. 초안이다.(docs/plan/admin/colophon/README.md 검토 필요 사항의 「문구」) */
export const EDITOR_MESSAGE = {
    SAVE_FAILED: '저장하지 못했습니다. 다시 시도해 주세요',
    LOAD_FAILED_TITLE: '내용을 불러오지 못했습니다',
    LOAD_FAILED_DESCRIPTION: '잠시 후 다시 시도해 주세요.',
} as const;
