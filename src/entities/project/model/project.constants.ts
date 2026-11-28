import type { ProjectScopeArea, ProjectScopeLevel } from './project.schemas';

/** 프로젝트를 두는 Firestore 컬렉션. 프로젝트 1건이 문서 1개다 */
export const PROJECT_COLLECTION = 'projects';

/** 프로젝트의 캐시 태그. 저장하거나 지우면 이 태그의 캐시를 지운다 */
export const PROJECT_CACHE_TAG = 'projects';

/**
 * 고를 수 있는 분류. 폼은 이 가운데 하나를 고르게 하고, 서버도 이 목록에 있는 값만 저장한다.
 * 적힌 순서가 폼에 보이는 순서다. 분류를 더하거나 빼려면 이 목록만 고친다.
 * 「무엇을 만들었나」 한 가지 기준으로 나눴다. 경력의 프로젝트 내역에서 잡았다.
 * (docs/plan/admin/README.md 요구사항 33 · 34)
 * - Admin: 관리 화면 · 백오피스
 * - Dashboard: 데이터를 보여 주는 대시보드
 * - Design System: 디자인 시스템 · UI Kit
 * - Website: 기업 · 브랜드 · 서비스 사이트
 * - Promotion: 프로모션 · 마이크로사이트
 * - Interactive: 키오스크 · 전광판 · 체험형 콘텐츠
 */
export const PROJECT_CATEGORIES = [
    'Admin',
    'Dashboard',
    'Design System',
    'Website',
    'Promotion',
    'Interactive',
] as const;

/** 썸네일의 제한.(docs/plan/admin/README.md 「등록 · 수정」) */
export const PROJECT_IMAGE = {
    /** 올릴 수 있는 형식. PNG · JPG · WebP */
    CONTENT_TYPES: ['image/png', 'image/jpeg', 'image/webp'],
    /** 올릴 수 있는 크기. 5MB */
    MAX_BYTES: 5 * 1024 * 1024,
    /** 올릴 때 줄이는 크기. 긴 변이 이 값(px)을 넘으면 이 값에 맞춰 줄인다.(docs/plan/admin/README.md 요구사항 31) */
    MAX_SIDE: 1000,
    /** 이미지 저장소에서 썸네일을 두는 폴더 */
    FOLDER: 'projects',
} as const;

/** 이미지 저장소(Vercel Blob)의 공개 주소가 끝나는 호스트. 앞에 저장소의 id 가 붙는다 */
export const PROJECT_IMAGE_HOST_SUFFIX = '.public.blob.vercel-storage.com';

/**
 * 항목이 규칙에 맞지 않을 때의 오류 문구. ProjectContentSchema 가 낸다. 폼은 이 문구를 그대로 그린다.
 * (docs/plan/admin/wireframe.html S-02 「오류 문구」)
 */
export const PROJECT_FIELD_ERROR = {
    TITLE: '제목을 입력해 주세요.',
    CATEGORY: '분류를 선택해 주세요.',
    SUMMARY: '요약을 입력해 주세요.',
    IMAGE_ALT: '대체 텍스트를 입력해 주세요.',
    IMAGE_TYPE: 'PNG · JPG · WebP 파일만 올릴 수 있습니다.',
    IMAGE_SIZE: '5MB 이하의 파일만 올릴 수 있습니다.',
    IMAGE_UPLOAD: '파일을 올리지 못했습니다. 다시 시도해 주세요.',
    TEAM_PART: '역할을 입력해 주세요.',
    TEAM_COUNT: '1 이상의 숫자를 입력해 주세요.',
    PERIOD_START: '시작일을 입력해 주세요.',
    PERIOD_FORMAT: '2025.06 형식으로 입력해 주세요.',
    PERIOD_END_BEFORE_START: '종료일은 시작일보다 빠를 수 없습니다.',
    LINK_LABEL: '이름을 입력해 주세요.',
    LINK_HREF: 'https:// 로 시작하는 주소를 입력해 주세요.',
} as const;

/** 맡은 범위의 영역 이름. 적힌 순서가 화면의 순서다. 일이 흘러가는 순서다 */
export const PROJECT_SCOPE_AREA_LABEL: Record<ProjectScopeArea, string> = {
    planning: '기획',
    design: '디자인',
    publishing: '퍼블리싱',
    development: '개발',
};

/** 맡은 범위의 단계 이름 */
export const PROJECT_SCOPE_LEVEL_LABEL: Record<ProjectScopeLevel, string> = {
    sole: '전담',
    lead: '주도',
    part: '참여',
};
