import { z } from 'zod';

import {
    COLOPHON_FIELD_ERROR,
    COLOPHON_FONT_FACE,
    COLOPHON_MIN,
    COLOPHON_ROLE,
    COLOPHON_STEP_TARGETS,
} from './colophon.constants';

/*
 * 규칙과 오류 문구를 함께 둔다. 폼은 따로 검사하지 않고 이 스키마가 낸 문구를 그린다.
 * (docs/architecture.md 4.3절)
 */

/** 칩으로 넣는 짧은 이름. 화면이 빈 값을 넣지 못하게 막아 문구를 두지 않는다 */
const TextSchema = z.string().trim().min(1);

/** 비울 수 없는 글 입력 */
function requiredText(error: string) {
    return z.string().trim().min(1, { error });
}

/** 링크의 주소. 바깥 주소(https://)나 이 사이트 안의 경로(/)만 받는다 */
const HrefSchema = z
    .string()
    .trim()
    .regex(/^(https:\/\/|\/)\S+$/, { error: COLOPHON_FIELD_ERROR.LINK_HREF });

/** 머리. 한 줄 요약은 홈의 제작 과정 섹션도 읽는다 */
export const ColophonHeadSchema = z.object({
    summary: requiredText(COLOPHON_FIELD_ERROR.SUMMARY),
    /** 머리의 숫자. 값은 단위까지 적은 글이다(113개) */
    stats: z
        .array(
            z.object({
                label: requiredText(COLOPHON_FIELD_ERROR.STAT_LABEL),
                value: requiredText(COLOPHON_FIELD_ERROR.STAT_VALUE),
            }),
        )
        .min(COLOPHON_MIN.ITEMS),
    /** 숫자를 센 날. 2026.11.26 처럼 적는다 */
    statsDate: requiredText(COLOPHON_FIELD_ERROR.STATS_DATE),
});

/** 만든 과정의 단계. 홈의 제작 과정 섹션도 읽는다 */
export const ColophonProcessSchema = z.object({
    items: z
        .array(
            z.object({
                title: requiredText(COLOPHON_FIELD_ERROR.STEP_TITLE),
                /** 그 단계를 한 쪽. 선택 상자로 고르므로 문구를 두지 않는다 */
                role: z.enum(COLOPHON_ROLE),
                /** 페이지에서 단계를 누르면 내려가는 섹션 */
                sectionId: z.enum(COLOPHON_STEP_TARGETS),
            }),
        )
        .min(COLOPHON_MIN.ITEMS),
});

/** 디자인 섹션의 단락 */
export const ColophonDesignSchema = z.object({
    items: z
        .array(
            z.object({
                title: requiredText(COLOPHON_FIELD_ERROR.TITLE),
                /** 그 단락의 일을 한 쪽 */
                role: z.enum(COLOPHON_ROLE),
                description: requiredText(COLOPHON_FIELD_ERROR.DESCRIPTION),
            }),
        )
        .min(COLOPHON_MIN.ITEMS),
});

/** 개발 과정의 단계. 단계마다 링크를 0개 이상 둔다 */
export const ColophonDevelopSchema = z.object({
    items: z
        .array(
            z.object({
                title: requiredText(COLOPHON_FIELD_ERROR.TITLE),
                work: requiredText(COLOPHON_FIELD_ERROR.WORK),
                example: requiredText(COLOPHON_FIELD_ERROR.DEVELOP_EXAMPLE),
                links: z
                    .array(
                        z.object({
                            label: requiredText(COLOPHON_FIELD_ERROR.LINK_LABEL),
                            href: HrefSchema,
                        }),
                    )
                    .min(COLOPHON_MIN.LINKS),
            }),
        )
        .min(COLOPHON_MIN.ITEMS),
});

/** 개발 규칙과 자동 검사. 장치마다 점검 항목(prevents)과 적용 예(example)를 둔다 */
export const ColophonGuardsSchema = z.object({
    items: z
        .array(
            z.object({
                name: requiredText(COLOPHON_FIELD_ERROR.GUARD_NAME),
                count: requiredText(COLOPHON_FIELD_ERROR.GUARD_COUNT),
                prevents: requiredText(COLOPHON_FIELD_ERROR.GUARD_PREVENTS),
                example: requiredText(COLOPHON_FIELD_ERROR.EXAMPLE),
            }),
        )
        .min(COLOPHON_MIN.ITEMS),
});

/** 사람이 한 일 */
export const ColophonHumanSchema = z.object({
    items: z
        .array(
            z.object({
                title: requiredText(COLOPHON_FIELD_ERROR.TITLE),
                description: requiredText(COLOPHON_FIELD_ERROR.DESCRIPTION),
            }),
        )
        .min(COLOPHON_MIN.ITEMS),
});

/** 기술과 폰트 */
export const ColophonStackSchema = z.object({
    techs: z.array(TextSchema).min(COLOPHON_MIN.ITEMS),
    fonts: z
        .array(
            z.object({
                name: requiredText(COLOPHON_FIELD_ERROR.FONT_NAME),
                /** 이름을 적을 견본 글꼴. 이 사이트가 불러오는 글꼴 가운데 고른다 */
                face: z.enum(COLOPHON_FONT_FACE),
                usage: requiredText(COLOPHON_FIELD_ERROR.FONT_USAGE),
                license: requiredText(COLOPHON_FIELD_ERROR.FONT_LICENSE),
            }),
        )
        .min(COLOPHON_MIN.ITEMS),
});

export type ColophonHeadType = z.infer<typeof ColophonHeadSchema>;
export type ColophonProcessType = z.infer<typeof ColophonProcessSchema>;
export type ColophonDesignType = z.infer<typeof ColophonDesignSchema>;
export type ColophonDevelopType = z.infer<typeof ColophonDevelopSchema>;
export type ColophonGuardsType = z.infer<typeof ColophonGuardsSchema>;
export type ColophonHumanType = z.infer<typeof ColophonHumanSchema>;
export type ColophonStackType = z.infer<typeof ColophonStackSchema>;

/** 섹션마다의 스키마. 폼과 서버가 같은 규칙으로 검증한다 */
export const COLOPHON_SECTION_SCHEMAS = {
    head: ColophonHeadSchema,
    process: ColophonProcessSchema,
    design: ColophonDesignSchema,
    develop: ColophonDevelopSchema,
    guards: ColophonGuardsSchema,
    human: ColophonHumanSchema,
    stack: ColophonStackSchema,
} as const;
