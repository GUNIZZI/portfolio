import type {
    AboutHomeType,
    AboutIntroType,
    AboutPrinciplesType,
    AboutSkillGroupsType,
} from './about.schemas';

/** 섹션마다 저장소에 두는 내용 */
export interface AboutSectionContent {
    intro: AboutIntroType;
    principles: AboutPrinciplesType;
    skillGroups: AboutSkillGroupsType;
    home: AboutHomeType;
}

/** 저장소에서 읽은 섹션 1건 */
export interface AboutSectionResponse<Content> {
    content: Content;
    /** 마지막으로 저장한 시각(ISO 8601). 기록이 없으면 null */
    updatedAt: string | null;
}

/** 저장소에서 읽은 소개 내용 전체 */
export type AboutResponse = {
    [Section in keyof AboutSectionContent]: AboutSectionResponse<AboutSectionContent[Section]>;
};

/** 소개 페이지의 인트로가 그리는 값 */
export type AboutIntroData = AboutIntroType;

/** 일하는 방식 1가지 */
export type AboutPrincipleData = AboutPrinciplesType['items'][number];

/** 기술 묶음 1개 */
export type AboutSkillGroupData = AboutSkillGroupsType['items'][number];

/** 홈의 소개 섹션이 그리는 값 */
export type AboutHomeData = AboutHomeType;

/** 관리 화면이 그리는 섹션 1건. 내용과 수정 일시 문구다 */
export interface AboutEditorSectionData<Content> {
    content: Content;
    /** 수정 일시. 2026.11.17 (10:12) 형식이고, 기록이 없으면 null */
    updatedAtText: string | null;
}

/** 관리 화면이 그리는 소개 내용 전체 */
export type AboutEditorData = {
    [Section in keyof AboutSectionContent]: AboutEditorSectionData<AboutSectionContent[Section]>;
};

export const ABOUT_SAVE_STATUS = {
    SAVED: 'SAVED',
    /** 규칙에 맞지 않아 저장하지 않았다 */
    INVALID: 'INVALID',
    /** 저장소에 쓰지 못했다 */
    FAILED: 'FAILED',
} as const;
export type AboutSaveStatus = (typeof ABOUT_SAVE_STATUS)[keyof typeof ABOUT_SAVE_STATUS];
