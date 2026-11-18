/** 경력을 두는 Firestore 컬렉션. 회사 1곳이 문서 1개다 */
export const EXPERIENCE_COLLECTION = 'experiences';

/** 경력의 캐시 태그. 저장하거나 지우면 이 태그의 캐시를 지운다 */
export const EXPERIENCE_CACHE_TAG = 'experiences';

/**
 * 항목이 규칙에 맞지 않을 때의 오류 문구. ExperienceSchema 가 낸다. 폼은 이 문구를 그대로 그린다.
 * 초안이다.(docs/plan/admin/experiences/wireframe.html S-02 「오류 문구」)
 */
export const EXPERIENCE_FIELD_ERROR = {
    COMPANY: '회사를 입력해 주세요.',
    YEAR: '연도 4자리를 입력해 주세요.',
    END_BEFORE_START: '퇴사날짜는 입사날짜보다 앞설 수 없습니다.',
    TOTAL_PROJECTS: '1 이상의 숫자를 입력해 주세요.',
    PROJECT_NAME: '이름을 입력해 주세요.',
    PROJECT_DATE: '2025.06 또는 2022 처럼 입력해 주세요.',
} as const;
