import { z } from 'zod';

export const ProjectImageSchema = z.object({
    src: z.string().startsWith('/'),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
});

/** 한 시기. `2025.06` */
const YearMonthSchema = z.string().regex(/^\d{4}\.\d{2}$/);

export const ProjectLinkSchema = z.object({
    label: z.string().min(1),
    href: z.url(),
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
    part: z.string().min(1),
    count: z.number().int().positive(),
});

export const ProjectScopeSchema = z.object({
    area: z.enum(PROJECT_SCOPE_AREA),
    level: z.enum(PROJECT_SCOPE_LEVEL),
});

export const ProjectSchema = z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    category: z.string().min(1),
    summary: z.string().min(1),
    /** 상세 화면 주소. 없으면 작업 섹션을 가리킨다 */
    href: z.string().optional(),
    /** 썸네일. 없으면 자리표시를 그린다 */
    image: ProjectImageSchema.nullable(),
    /** 팀 구성. 파트와 인원 */
    team: z.array(ProjectTeamPartSchema).default([]),
    /** 팀에서의 자리 */
    role: z.string().min(1).optional(),
    /** 맡은 범위. 손댄 영역만 적는다. 한 영역은 한 번만 적는다 */
    scope: z.array(ProjectScopeSchema).default([]),
    /** 기간. 끝이 없으면 진행 중이다 */
    period: z.object({ start: YearMonthSchema, end: YearMonthSchema.optional() }).optional(),
    /** 쓴 기술 */
    stack: z.array(z.string().min(1)).default([]),
    /** 서비스 · 저장소 같은 외부 주소 */
    links: z.array(ProjectLinkSchema).default([]),
    /** 케이스 스터디 본문. Tiptap 에디터가 내는 HTML 이다 */
    body: z.string().optional(),
});

export const ProjectListSchema = z.array(ProjectSchema);

export type ProjectImageType = z.infer<typeof ProjectImageSchema>;
export type ProjectLinkType = z.infer<typeof ProjectLinkSchema>;
export type ProjectScopeArea = (typeof PROJECT_SCOPE_AREA)[keyof typeof PROJECT_SCOPE_AREA];
export type ProjectScopeLevel = (typeof PROJECT_SCOPE_LEVEL)[keyof typeof PROJECT_SCOPE_LEVEL];
export type ProjectType = z.infer<typeof ProjectSchema>;
