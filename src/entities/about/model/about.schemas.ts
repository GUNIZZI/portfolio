import { z } from 'zod';

import { ABOUT_COUNT } from './about.constants';

const TextSchema = z.string().trim().min(1);

/** 인트로. 소개 페이지의 첫 섹션이다 */
export const AboutIntroSchema = z.object({
    /** 소개 문단. 줄마다 한 문단이다 */
    lines: z.array(TextSchema).min(1),
    /** 성장 경로. 주된 기술이 바뀌어 온 순서다 */
    growthPath: z.array(TextSchema).min(ABOUT_COUNT.GROWTH_PATH_MIN),
    /** 성장 경로 아래에 붙이는 한 줄. 비울 수 있다 */
    growthPathNote: z.string().trim(),
});

/** 일하는 방식 4가지 */
export const AboutPrinciplesSchema = z.object({
    items: z
        .array(z.object({ title: TextSchema, description: TextSchema }))
        .length(ABOUT_COUNT.PRINCIPLES),
});

/** 기술 묶음 8개 */
export const AboutSkillGroupsSchema = z.object({
    items: z
        .array(
            z.object({
                name: TextSchema,
                /** 어디에 썼는지 한 줄 */
                usage: TextSchema,
                /** 묶음 안의 기술 이름 */
                items: z.array(TextSchema).min(1),
            }),
        )
        .length(ABOUT_COUNT.SKILL_GROUPS),
});

/** 홈의 소개 섹션 */
export const AboutHomeSchema = z.object({
    /** 소개 문단. 줄마다 한 줄로 그린다 */
    lines: z.array(TextSchema).min(1),
    stats: z
        .array(
            z.object({
                value: z.number().int().nonnegative(),
                /** 숫자 뒤에 붙이는 기호. 비울 수 있다 */
                suffix: z.string().trim(),
                label: TextSchema,
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
