import { z } from 'zod';

import {
    PROJECT_CATEGORIES,
    PROJECT_FIELD_ERROR,
    PROJECT_IMAGE_HOST_SUFFIX,
} from './project.constants';

/*
 * 규칙과 오류 문구를 함께 둔다. 폼은 따로 검사하지 않고 이 스키마가 낸 문구를 그린다.
 * (docs/architecture.md 4.3절)
 */

/** 이미지 저장소의 공개 주소만 받는다. 다른 곳의 주소를 썸네일로 저장하지 못하게 한다 */
const IMAGE_HOST_PATTERN = new RegExp(`${PROJECT_IMAGE_HOST_SUFFIX.replaceAll('.', '\\.')}$`);

export const ProjectImageSchema = z.object({
    /** 이미지 저장소의 주소 */
    src: z.url({ protocol: /^https$/, hostname: IMAGE_HOST_PATTERN }),
    alt: z.string().trim().min(1, { error: PROJECT_FIELD_ERROR.IMAGE_ALT }),
    /** 가로 · 세로 크기. 올릴 때 파일에서 읽는다 */
    width: z.number().int().positive(),
    height: z.number().int().positive(),
});

/** 한 시기. `2025.06` */
const YearMonthSchema = z
    .string()
    .regex(/^\d{4}\.\d{2}$/, { error: PROJECT_FIELD_ERROR.PERIOD_FORMAT });

export const ProjectLinkSchema = z.object({
    label: z.string().trim().min(1, { error: PROJECT_FIELD_ERROR.LINK_LABEL }),
    href: z.url({ protocol: /^https?$/, error: PROJECT_FIELD_ERROR.LINK_HREF }),
});

/** 맡은 범위의 영역. 일이 흘러가는 순서다 */
export const PROJECT_SCOPE_AREA = {
    PLANNING: 'planning',
    DESIGN: 'design',
    PUBLISHING: 'publishing',
    DEVELOPMENT: 'development',
} as const;

/** 맡은 범위의 단계. 전담은 혼자 다 했다, 주도는 방향을 정하고 이끌었다, 참여는 일부를 맡았다 */
export const PROJECT_SCOPE_LEVEL = {
    SOLE: 'sole',
    LEAD: 'lead',
    PART: 'part',
} as const;

export const ProjectTeamPartSchema = z.object({
    /** 파트 이름 — 프론트엔드 · 디자이너 */
    part: z.string().trim().min(1, { error: PROJECT_FIELD_ERROR.TEAM_PART }),
    /** 인원. 숫자가 아닌 값(NaN)도 같은 문구로 알린다 */
    count: z
        .number({ error: PROJECT_FIELD_ERROR.TEAM_COUNT })
        .int({ error: PROJECT_FIELD_ERROR.TEAM_COUNT })
        .positive({ error: PROJECT_FIELD_ERROR.TEAM_COUNT }),
});

export const ProjectScopeSchema = z.object({
    area: z.enum(PROJECT_SCOPE_AREA),
    level: z.enum(PROJECT_SCOPE_LEVEL),
});

/** 기간. 끝이 없으면 진행 중이다. 시기는 `2025.06` 꼴이라 글자 그대로 견줘도 앞뒤가 맞는다 */
export const ProjectPeriodSchema = z
    .object({
        start: z.string().min(1, { error: PROJECT_FIELD_ERROR.PERIOD_START }).pipe(YearMonthSchema),
        end: YearMonthSchema.optional(),
    })
    .refine((period) => period.end === undefined || period.end >= period.start, {
        path: ['end'],
        error: PROJECT_FIELD_ERROR.PERIOD_END_BEFORE_START,
    });

/**
 * 관리 화면의 폼이 저장하는 내용. 폼과 서버가 같은 규칙으로 검증한다.
 * 목록의 카드와 상세의 머리에 나오는 기본 항목, 그리고 상세에만 나오는 상세 항목이다.
 * (docs/plan/admin/README.md 「등록 · 수정」)
 */
export const ProjectContentSchema = z.object({
    title: z.string().trim().min(1, { error: PROJECT_FIELD_ERROR.TITLE }),
    /** 정해 둔 분류 가운데 하나 */
    category: z.enum(PROJECT_CATEGORIES, { error: PROJECT_FIELD_ERROR.CATEGORY }),
    summary: z.string().trim().min(1, { error: PROJECT_FIELD_ERROR.SUMMARY }),
    /** 상세 화면 주소. 없으면 프로젝트 상세(`/project/<id>`)를 가리킨다 */
    href: z.string().trim().min(1).optional(),
    /** 썸네일. 없으면 자리표시를 그린다 */
    image: ProjectImageSchema.nullable(),
    /** 공개 화면에 보이는가. 작업 목록과 상세에 나온다 */
    published: z.boolean(),
    /** 홈의 대표 작업에도 보이는가. 공개일 때만 켤 수 있다 */
    featured: z.boolean(),
    /** 팀 구성. 파트와 인원 */
    team: z.array(ProjectTeamPartSchema),
    /** 팀에서의 자리 */
    role: z.string().trim().min(1).optional(),
    /** 맡은 범위. 손댄 영역만 적는다. 한 영역은 한 번만 적는다 */
    scope: z
        .array(ProjectScopeSchema)
        .refine((scope) => new Set(scope.map((item) => item.area)).size === scope.length),
    period: ProjectPeriodSchema.optional(),
    /** 쓴 기술 */
    stack: z.array(z.string().trim().min(1)),
    /** 서비스 · 저장소 같은 외부 주소 */
    links: z.array(ProjectLinkSchema),
    /** 케이스 스터디 본문. Tiptap 에디터가 내는 HTML 이다. 서버가 저장하기 전에 정제한다 */
    body: z.string().optional(),
});

/**
 * 저장소의 프로젝트 1건. 폼이 저장하는 내용에 순서가 붙는다.
 * 목록 항목은 문서에 없어도 빈 목록으로 읽는다
 */
export const ProjectSchema = ProjectContentSchema.extend({
    /** 놓는 차례. 작은 수가 앞이다. 관리 화면의 목록에서 바꾼다 */
    order: z.number().int().nonnegative(),
    /** 저장된 분류는 글자이기만 하면 읽는다. 목록에서 뺀 분류의 프로젝트도 화면에 그려야 한다 */
    category: z.string().min(1),
    team: ProjectContentSchema.shape.team.default([]),
    scope: ProjectContentSchema.shape.scope.default([]),
    stack: ProjectContentSchema.shape.stack.default([]),
    links: ProjectContentSchema.shape.links.default([]),
});

/** 순서를 바꿀 때 받는 id 목록. 놓을 차례대로 적는다 */
export const ProjectOrderSchema = z.array(z.string().min(1));

export type ProjectImageType = z.infer<typeof ProjectImageSchema>;
export type ProjectLinkType = z.infer<typeof ProjectLinkSchema>;
export type ProjectScopeArea = (typeof PROJECT_SCOPE_AREA)[keyof typeof PROJECT_SCOPE_AREA];
export type ProjectScopeLevel = (typeof PROJECT_SCOPE_LEVEL)[keyof typeof PROJECT_SCOPE_LEVEL];
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectContentType = z.infer<typeof ProjectContentSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
