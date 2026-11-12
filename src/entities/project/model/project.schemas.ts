import { z } from 'zod';

export const ProjectImageSchema = z.object({
    src: z.string().startsWith('/'),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
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
});

export const ProjectListSchema = z.array(ProjectSchema);

export type ProjectImageType = z.infer<typeof ProjectImageSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
