import type {
    ProjectImageType,
    ProjectLinkType,
    ProjectScopeLevel,
    ProjectType,
} from './project.schemas';

/** 원문 한 건. content/projects.ts 를 검증한 결과다 */
export type ProjectResponse = ProjectType;

/** 화면에서 쓰는 작업 한 건 */
export interface ProjectData {
    slug: string;
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
