import type { ExperienceType } from './experience.schemas';

/** 저장소에서 읽은 경력 한 건(회사 하나) */
export interface ExperienceResponse extends ExperienceType {
    /** 저장소가 발급한 문서 id */
    id: string;
    /** 마지막으로 저장한 시각(ISO 8601). 기록이 없으면 null */
    updatedAt: string | null;
}

/** 화면에서 쓰는 프로젝트 한 건 */
export interface ExperienceProjectData {
    name: string;
    /** 한 시기. `2025.06` 또는 `2022` */
    dateText: string;
    tags: string[];
    /** 작업 상세 주소. 상세가 없으면 null */
    href: string | null;
}

/** 화면에서 쓰는 경력 한 건(회사 하나) */
export interface ExperienceData {
    id: string;
    company: string;
    /** `2025 – 현재` · `2014 – 2025` */
    periodText: string;
    /** 들어간 해 — `2025` */
    startYearText: string;
    /** 떠난 해 — `2014`, 재직 중이면 `현재` */
    endYearText: string;
    isCurrent: boolean;
    /** 처음부터 프로젝트 목록을 펼쳐 두는가 */
    isOpen: boolean;
    /** 회사에서 맡은 역할과 한 일. 쓰지 않았으면 null */
    summary: string | null;
    /** 프로젝트 수 문구. 목록을 다 적었으면 `4개`, 대표만 적었으면 `50개+` */
    projectCountText: string;
    projects: ExperienceProjectData[];
}

/** 관리 화면의 경력 목록이 그리는 한 줄 */
export interface ExperienceRowData {
    id: string;
    company: string;
    /** `2025 – 현재` */
    periodText: string;
    /** 목록에 적은 프로젝트 수 — `7개` */
    listedCountText: string;
    /** 실제 프로젝트 수 — `50개+`. 적지 않았으면 null */
    totalCountText: string | null;
    /** 수정 일시. 2026.11.17 (10:12) 형식이고, 기록이 없으면 null */
    updatedAtText: string | null;
}

/** 관리 화면의 경력 수정 폼이 그리는 한 건 */
export interface ExperienceEditorData {
    id: string;
    content: ExperienceType;
    /** 수정 일시. 2026.11.17 (10:12) 형식이고, 기록이 없으면 null */
    updatedAtText: string | null;
}

export const EXPERIENCE_SAVE_STATUS = {
    SAVED: 'SAVED',
    /** 규칙에 맞지 않아 저장하지 않았다 */
    INVALID: 'INVALID',
    /** 고치거나 지울 경력이 저장소에 없다 */
    NOT_FOUND: 'NOT_FOUND',
    /** 저장소에 쓰지 못했다 */
    FAILED: 'FAILED',
} as const;
export type ExperienceSaveStatus =
    (typeof EXPERIENCE_SAVE_STATUS)[keyof typeof EXPERIENCE_SAVE_STATUS];
