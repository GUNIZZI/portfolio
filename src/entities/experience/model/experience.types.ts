import type { ExperienceType } from './experience.schemas';

/** 원문 한 건(회사 하나). content/experiences.json 을 검증한 결과다 */
export type ExperienceResponse = ExperienceType;

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
    slug: string;
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
