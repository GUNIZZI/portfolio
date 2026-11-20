import { z } from 'zod';

import { EXPERIENCE_FIELD_ERROR } from './experience.constants';

/*
 * 규칙과 오류 문구를 함께 둔다. 폼은 따로 검사하지 않고 이 스키마가 낸 문구를 그린다.
 * (Kozipsa docs/form.md, 2026-11-18 사용자 결정)
 */

/** 연도 4자리. 숫자가 아닌 값(NaN)도 같은 문구로 알린다 */
const YearSchema = z
    .number({ error: EXPERIENCE_FIELD_ERROR.YEAR })
    .int({ error: EXPERIENCE_FIELD_ERROR.YEAR })
    .min(1000, { error: EXPERIENCE_FIELD_ERROR.YEAR })
    .max(9999, { error: EXPERIENCE_FIELD_ERROR.YEAR });

export const ExperienceProjectSchema = z.object({
    name: z.string().trim().min(1, { error: EXPERIENCE_FIELD_ERROR.PROJECT_NAME }),
    /** 한 시기. 달을 알면 `2025.06`, 모르면 `2022` */
    date: z.string().regex(/^\d{4}(\.\d{2})?$/, { error: EXPERIENCE_FIELD_ERROR.PROJECT_DATE }),
    /** 쓴 기술과 맡은 일 */
    tags: z.array(z.string().trim().min(1)),
    /**
     * 이은 프로젝트(entity project)의 id. 그 프로젝트의 상세(`/work/<id>`)로 간다.
     * (docs/plan/admin/experiences/README.md 「등록 · 수정」)
     */
    projectId: z.string().min(1).optional(),
});

/** 경력 한 건(회사 하나)의 내용. 폼과 서버가 같은 규칙으로 검증한다 */
export const ExperienceSchema = z
    .object({
        company: z.string().trim().min(1, { error: EXPERIENCE_FIELD_ERROR.COMPANY }),
        startYear: YearSchema,
        /** 떠난 해. 재직 중이면 null */
        endYear: YearSchema.nullable(),
        /** 회사에서 맡은 역할과 한 일 한두 줄. 아직 쓰지 않았으면 빈 문자열 */
        summary: z.string().trim(),
        /**
         * 실제로 한 프로젝트 수. 목록에 다 적지 못하고 대표만 적은 회사에 준다.
         * 정확히 세지 못한 최소치라 화면에는 `50개+` 로 적는다. 없으면 목록의 개수를 쓴다
         */
        totalProjects: z
            .number({ error: EXPERIENCE_FIELD_ERROR.TOTAL_PROJECTS })
            .int({ error: EXPERIENCE_FIELD_ERROR.TOTAL_PROJECTS })
            .positive({ error: EXPERIENCE_FIELD_ERROR.TOTAL_PROJECTS })
            .optional(),
        projects: z.array(ExperienceProjectSchema),
    })
    // 떠난 해는 들어간 해보다 앞설 수 없다
    .refine((value) => value.endYear === null || value.endYear >= value.startYear, {
        path: ['endYear'],
        error: EXPERIENCE_FIELD_ERROR.END_BEFORE_START,
    });

export type ExperienceProjectType = z.infer<typeof ExperienceProjectSchema>;
export type ExperienceType = z.infer<typeof ExperienceSchema>;
