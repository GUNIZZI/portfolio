import { z } from 'zod';

export const ExperienceProjectSchema = z.object({
    name: z.string().min(1),
    /** 한 시기. 달을 알면 `2025.06`, 모르면 `2022` */
    date: z.string().regex(/^\d{4}(\.\d{2})?$/),
    /** 쓴 기술과 맡은 일 */
    tags: z.array(z.string().min(1)),
    /** 작업 상세(`/work/<slug>`)가 있는 프로젝트의 slug */
    workSlug: z
        .string()
        .regex(/^[a-z0-9-]+$/)
        .optional(),
});

export const ExperienceSchema = z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    company: z.string().min(1),
    startYear: z.number().int(),
    /** 떠난 해. 재직 중이면 null */
    endYear: z.number().int().nullable(),
    /** 회사에서 맡은 역할과 한 일 한두 줄. 아직 쓰지 않았으면 빈 문자열 */
    summary: z.string(),
    /**
     * 실제로 한 프로젝트 수. 목록에 다 적지 못하고 대표만 적은 회사에 준다.
     * 정확히 세지 못한 최소치라 화면에는 `50개+` 로 적는다. 없으면 목록의 개수를 쓴다
     */
    totalProjects: z.number().int().positive().optional(),
    projects: z.array(ExperienceProjectSchema),
});

export const ExperienceListSchema = z.array(ExperienceSchema);

export type ExperienceProjectType = z.infer<typeof ExperienceProjectSchema>;
export type ExperienceType = z.infer<typeof ExperienceSchema>;
