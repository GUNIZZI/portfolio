/** 경력 관리 화면의 주소 */
export const EXPERIENCE_ROUTE = {
    LIST: '/admin/experiences',
    NEW: '/admin/experiences/new',
} as const;

/** 경력 수정 화면의 주소 */
export function toEditHref(id: string): string {
    return `${EXPERIENCE_ROUTE.LIST}/${id}`;
}

/** 문구. 초안이다.(docs/plan/admin/experiences/README.md 검토 필요 사항의 「문구」) */
export const EDITOR_MESSAGE = {
    CREATED: '경력을 등록했습니다',
    SAVED: '경력을 저장했습니다',
    DELETED: '경력을 삭제했습니다',
    SAVE_FAILED: '저장하지 못했습니다. 다시 시도해 주세요',
    DELETE_FAILED: '삭제하지 못했습니다. 다시 시도해 주세요',
    NOT_FOUND: '경력 항목을 찾을 수 없습니다. 목록에서 다시 확인해 주세요.',
    EMPTY: '등록한 경력이 없습니다.',
    LOAD_FAILED_TITLE: '경력을 불러오지 못했습니다',
    LOAD_FAILED_DESCRIPTION: '잠시 후 다시 시도해 주세요.',
} as const;
