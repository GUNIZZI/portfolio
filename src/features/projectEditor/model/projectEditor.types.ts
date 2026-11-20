import type {
    ProjectImageType,
    ProjectScopeArea,
    ProjectScopeLevel,
} from '@/entities/project/model/project.schemas';

/** 폼에 있는 팀의 파트 1줄. 입력 중인 값이라 인원도 글자다 */
export interface TeamFormValue {
    part: string;
    count: string;
}

/** 폼에 있는 링크 1줄 */
export interface LinkFormValue {
    label: string;
    href: string;
}

/** 폼에서 영역마다 고른 단계. 손대지 않은 영역은 빈 문자열이다 */
export type ScopeFormValue = Record<ProjectScopeArea, ProjectScopeLevel | ''>;

/**
 * 폼에 있는 프로젝트 1건. 저장할 내용과 항목의 이름이 같고, 입력 중인 값이라 비운 선택 항목을 빈 문자열로 갖는다.
 * 기본 항목과 상세 항목을 함께 갖는다.(docs/plan/admin/README.md 「등록 · 수정」)
 */
export interface ProjectFormValue {
    title: string;
    /** 고른 분류. 고르지 않았으면 빈 문자열 */
    category: string;
    summary: string;
    /** 상세 주소. 적지 않았으면 빈 문자열 */
    href: string;
    /** 썸네일. 올리지 않았으면 null. 대체 텍스트는 올린 뒤에 입력받는다 */
    image: ProjectImageType | null;
    published: boolean;
    featured: boolean;
    team: TeamFormValue[];
    /** 팀에서의 자리. 적지 않았으면 빈 문자열 */
    role: string;
    scope: ScopeFormValue;
    /** 기간. `2025.06`. 적지 않았으면 빈 문자열 */
    period: { start: string; end: string };
    /** 진행 중인가. 켜면 끝을 입력받지 않는다 */
    isOngoing: boolean;
    stack: string[];
    links: LinkFormValue[];
    /** 본문(HTML) */
    body: string;
}

/** 올린 썸네일 파일. 대체 텍스트는 폼이 따로 입력받는다 */
export type UploadedImage = Omit<ProjectImageType, 'alt'>;

/** 목록 위에 적는 건수 */
export interface ProjectCounts {
    total: number;
    published: number;
    featured: number;
}
