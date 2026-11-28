import type {
    ColophonDesignType,
    ColophonDevelopType,
    ColophonGuardsType,
    ColophonHeadType,
    ColophonHumanType,
    ColophonProcessType,
    ColophonStackType,
} from './colophon.schemas';

/** 섹션마다 저장소에 두는 내용 */
export interface ColophonSectionContent {
    head: ColophonHeadType;
    process: ColophonProcessType;
    design: ColophonDesignType;
    develop: ColophonDevelopType;
    guards: ColophonGuardsType;
    human: ColophonHumanType;
    stack: ColophonStackType;
}

/** 저장소에서 읽은 섹션 1건 */
export interface ColophonSectionResponse<Content> {
    content: Content;
    /** 마지막으로 저장한 시각(ISO 8601). 기록이 없으면 null */
    updatedAt: string | null;
}

/** 저장소에서 읽은 내용 전체. 한 번도 저장하지 않은 섹션은 문서가 없어 null 이다 */
export type ColophonResponse = {
    [Section in keyof ColophonSectionContent]: ColophonSectionResponse<
        ColophonSectionContent[Section]
    > | null;
};

/** 공개 화면이 그리는 내용 전체. 저장소에 없는 섹션은 처음 값으로 채웠다 */
export type ColophonData = ColophonSectionContent;

/** 과정의 단계 1개 */
export type ColophonProcessStepData = ColophonProcessType['items'][number];

/** 홈의 제작 과정 섹션이 그리는 값 */
export interface ColophonTeaserData {
    summary: string;
    /** 과정의 단계. 홈에서는 누를 수 없어 이어지는 섹션을 쓰지 않는다 */
    steps: ColophonProcessStepData[];
}

/** 관리 화면이 그리는 섹션 1건. 내용과 수정 일시 문구다 */
export interface ColophonEditorSectionData<Content> {
    content: Content;
    /** 수정 일시. 2026.11.17 (10:12) 형식이고, 저장한 적이 없으면 null */
    updatedAtText: string | null;
}

/** 관리 화면이 그리는 내용 전체 */
export type ColophonEditorData = {
    [Section in keyof ColophonSectionContent]: ColophonEditorSectionData<
        ColophonSectionContent[Section]
    >;
};

export const COLOPHON_SAVE_STATUS = {
    SAVED: 'SAVED',
    /** 규칙에 맞지 않아 저장하지 않았다 */
    INVALID: 'INVALID',
    /** 저장소에 쓰지 못했다 */
    FAILED: 'FAILED',
} as const;
export type ColophonSaveStatus = (typeof COLOPHON_SAVE_STATUS)[keyof typeof COLOPHON_SAVE_STATUS];
