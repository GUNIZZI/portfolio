/** 프로젝트 관리 화면의 주소 */
export const PROJECT_ROUTE = {
    LIST: '/admin/projects',
    NEW: '/admin/projects/new',
} as const;

/** 프로젝트 수정 화면의 주소 */
export function toEditHref(id: string): string {
    return `${PROJECT_ROUTE.LIST}/${id}`;
}

/** 썸네일을 올릴 권한을 받는 주소.(src/app/admin/api/project-images/route.ts) */
export const IMAGE_UPLOAD_URL = '/admin/api/project-images';

/**
 * 새 프로젝트의 본문에 넣어 두는 템플릿. 절 제목 5개다.(docs/plan/admin/README.md 요구사항 32)
 * 절의 순서는 작업 상세의 기획이 정했다.(docs/plan/work/README.md 「상세」)
 */
export const BODY_TEMPLATE = ['프로젝트 소개', '해결해야 했던 문제', '해결 과정', '결과', '배운 점']
    .map((heading) => `<h2>${heading}</h2><p></p>`)
    .join('');

/** 문구.(docs/plan/admin/wireframe.html P-02 「토스트 문구」 · S-04) */
export const EDITOR_MESSAGE = {
    CREATED: '프로젝트를 등록했습니다',
    SAVED: '프로젝트를 저장했습니다',
    DELETED: '프로젝트를 삭제했습니다',
    PUBLISHED: '프로젝트를 공개했습니다',
    UNPUBLISHED: '프로젝트를 비공개로 바꿨습니다',
    FEATURED: '홈에 표시했습니다',
    UNFEATURED: '홈에서 숨겼습니다',
    ORDER_SAVED: '순서를 저장했습니다',
    FAILED: '저장하지 못했습니다. 다시 시도해 주세요',
    // 기획에 없는 문구다. 경력 관리의 같은 상황과 맞췄다.(src/features/experienceEditor/model/experienceEditor.constants.ts)
    NOT_FOUND: '프로젝트를 찾을 수 없습니다. 목록에서 다시 확인해 주세요.',
    EMPTY: '등록한 프로젝트가 없습니다.',
    LOAD_FAILED_TITLE: '프로젝트를 불러오지 못했습니다',
    LOAD_FAILED_DESCRIPTION: '잠시 후 다시 시도해 주세요.',
} as const;
