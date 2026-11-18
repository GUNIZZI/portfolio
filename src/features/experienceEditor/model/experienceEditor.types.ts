/** 폼에 있는 경력의 프로젝트 1줄. 입력 중인 값이라 모두 글자다 */
export interface ProjectFormValue {
    name: string;
    date: string;
    tags: string[];
    /** 이은 프로젝트의 slug. 잇지 않았으면 빈 문자열 */
    workSlug: string;
}

/** 폼에 있는 경력 1건. 입력 중인 값이라 숫자도 글자로 갖는다 */
export interface ExperienceFormValue {
    company: string;
    startYear: string;
    /** 재직 중인가. 켜면 떠난 해를 입력받지 않는다 */
    isCurrent: boolean;
    endYear: string;
    summary: string;
    /** 실제 프로젝트 수. 적지 않았으면 빈 문자열 */
    totalProjects: string;
    projects: ProjectFormValue[];
}

/** 프로젝트 연결에서 고를 수 있는 프로젝트 1건 */
export interface ProjectOption {
    slug: string;
    title: string;
}
