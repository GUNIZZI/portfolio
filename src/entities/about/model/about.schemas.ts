import { z } from 'zod';

import { ABOUT_COUNT, ABOUT_FIELD_ERROR } from './about.constants';

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

/** 소개 문단 1줄 */
const LineSchema = requiredText(ABOUT_FIELD_ERROR.LINE);

/** 인트로. 소개 페이지의 첫 섹션이다 */
export const AboutIntroSchema = z.object({
    /** 소개 문단. 줄마다 한 문단이다 */
    lines: z.array(LineSchema).min(1),
    /** 성장 경로. 주된 기술이 바뀌어 온 순서다 */
    growthPath: z.array(TextSchema).min(ABOUT_COUNT.GROWTH_PATH_MIN),
    /** 성장 경로 아래에 붙이는 한 줄. 비울 수 있다 */
    growthPathNote: z.string().trim(),
});

/** 일하는 방식 4가지 */
export const AboutPrinciplesSchema = z.object({
    items: z
        .array(
            z.object({
                title: requiredText(ABOUT_FIELD_ERROR.PRINCIPLE_TITLE),
                description: requiredText(ABOUT_FIELD_ERROR.PRINCIPLE_DESCRIPTION),
            }),
        )
        .length(ABOUT_COUNT.PRINCIPLES),
});

/** 기술 묶음 8개 */
export const AboutSkillGroupsSchema = z.object({
    items: z
        .array(
            z.object({
                name: requiredText(ABOUT_FIELD_ERROR.SKILL_NAME),
                /** 어디에 썼는지 한 줄 */
                usage: requiredText(ABOUT_FIELD_ERROR.SKILL_USAGE),
                /** 묶음 안의 기술 이름 */
                items: z.array(TextSchema).min(1),
            }),
        )
        .length(ABOUT_COUNT.SKILL_GROUPS),
});

/** 홈의 소개 섹션 */
export const AboutHomeSchema = z.object({
    /** 소개 문단. 줄마다 한 줄로 그린다 */
    lines: z.array(LineSchema).min(1),
    stats: z
        .array(
            z.object({
                // 비운 입력(NaN)도 같은 문구로 알린다
                value: z
                    .number({ error: ABOUT_FIELD_ERROR.STAT_VALUE })
                    .int({ error: ABOUT_FIELD_ERROR.STAT_VALUE })
                    .nonnegative({ error: ABOUT_FIELD_ERROR.STAT_VALUE }),
                /** 숫자 뒤에 붙이는 기호. 비울 수 있다 */
                suffix: z.string().trim(),
                label: requiredText(ABOUT_FIELD_ERROR.STAT_LABEL),
            }),
        )
        .length(ABOUT_COUNT.STATS),
});

export type AboutIntroType = z.infer<typeof AboutIntroSchema>;
export type AboutPrinciplesType = z.infer<typeof AboutPrinciplesSchema>;
export type AboutSkillGroupsType = z.infer<typeof AboutSkillGroupsSchema>;
export type AboutHomeType = z.infer<typeof AboutHomeSchema>;

/** 섹션마다의 스키마. 폼과 서버가 같은 규칙으로 검증한다 */
export const ABOUT_SECTION_SCHEMAS = {
    intro: AboutIntroSchema,
    principles: AboutPrinciplesSchema,
    skillGroups: AboutSkillGroupsSchema,
    home: AboutHomeSchema,
} as const;
