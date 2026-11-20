import type {
    ProjectContentType,
    ProjectImageType,
    ProjectLinkType,
    ProjectScopeLevel,
    ProjectType,
} from './project.schemas';

/** 저장소에서 읽은 프로젝트 한 건 */
export interface ProjectResponse extends ProjectType {
    /** 저장소가 발급한 문서 id. 상세 주소에 쓴다 */
    id: string;
    /** 마지막으로 저장한 시각(ISO 8601). 기록이 없으면 null */
    updatedAt: string | null;
}

/** 화면에서 쓰는 작업 한 건 */
export interface ProjectData {
    id: string;
    title: string;
    category: string;
    summary: string;
    href: string;
    image: ProjectImageType | null;
}

/** 상세 아래에서 옆 작업으로 가는 링크 */
export interface ProjectNeighborData {
    title: string;
    href: string;
}

/** 맡은 범위 한 줄 */
export interface ProjectScopeData {
    /** 영역 이름 — 기획 · 디자인 · 퍼블리싱 · 개발 */
    areaLabel: string;
    /** 단계. 화면이 색을 고를 때 쓴다 */
    level: ProjectScopeLevel;
    /** 단계 이름 — 전담 · 주도 · 참여 */
    levelLabel: string;
}

/** 화면에서 쓰는 작업 상세 한 건 */
export interface ProjectDetailData extends ProjectData {
    /** `프론트엔드 2명 · 디자이너 1명`. 적지 않았으면 null */
    teamText: string | null;
    /** 팀에서의 자리. 적지 않았으면 null */
    role: string | null;
    /** 맡은 범위. 기획 → 디자인 → 퍼블리싱 → 개발 순서다 */
    scope: ProjectScopeData[];
    /** `2025.03 – 2026.01` · `2025.06 – 진행 중`. 적지 않았으면 null */
    periodText: string | null;
    stack: string[];
    links: ProjectLinkType[];
    /** 케이스 스터디 본문(HTML). 적지 않았으면 null */
    body: string | null;
    /** 목록에서 앞에 있는 작업. 첫 작업이면 null */
    prev: ProjectNeighborData | null;
    /** 목록에서 뒤에 있는 작업. 마지막 작업이면 null */
    next: ProjectNeighborData | null;
}

/** 관리 화면의 프로젝트 목록이 그리는 한 줄 */
export interface ProjectRowData {
    id: string;
    title: string;
    category: string;
    /** 썸네일. 없으면 null */
    image: Pick<ProjectImageType, 'src' | 'alt'> | null;
    isPublished: boolean;
    /** 홈의 대표 작업에도 보이는가. 비공개면 언제나 false 다 */
    isFeatured: boolean;
    /** 수정 일시. 2026.11.17 (10:12) 형식이고, 기록이 없으면 null */
    updatedAtText: string | null;
}

/**
 * 수정 폼에 채울 내용. 저장할 내용과 같은 모양이고 분류만 글자다.
 * 목록에서 뺀 분류가 저장되어 있을 수 있다. 그때는 폼이 다시 고르게 한다
 */
export type ProjectEditorContent = Omit<ProjectContentType, 'category'> & { category: string };

/** 관리 화면의 프로젝트 수정 폼이 그리는 한 건 */
export interface ProjectEditorData {
    id: string;
    content: ProjectEditorContent;
    /** 수정 일시. 2026.11.17 (10:12) 형식이고, 기록이 없으면 null */
    updatedAtText: string | null;
}

/** 다른 화면이 프로젝트를 고를 때 쓰는 한 건. 경력의 프로젝트 연결이 쓴다 */
export interface ProjectOptionData {
    id: string;
    title: string;
    isPublished: boolean;
}

export const PROJECT_SAVE_STATUS = {
    SAVED: 'SAVED',
    /** 규칙에 맞지 않아 저장하지 않았다 */
    INVALID: 'INVALID',
    /** 고치거나 지울 프로젝트가 저장소에 없다 */
    NOT_FOUND: 'NOT_FOUND',
    /** 저장소에 쓰지 못했다 */
    FAILED: 'FAILED',
} as const;
export type ProjectSaveStatus = (typeof PROJECT_SAVE_STATUS)[keyof typeof PROJECT_SAVE_STATUS];
