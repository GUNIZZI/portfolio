import { z } from 'zod';

import {
    PROJECT_SCOPE_LEVEL,
    ProjectContentSchema,
    ProjectImageSchema,
} from '@/entities/project/model/project.schemas';

import { toContent } from './projectEditor.utils';

/** 영역마다 고른 단계. 고르지 않았으면 빈 문자열이다 */
const ScopeLevelFormSchema = z.union([z.enum(PROJECT_SCOPE_LEVEL), z.literal('')]);

/**
 * 프로젝트 폼의 스키마. 폼은 인원을 글자로, 비운 선택 항목을 빈 문자열로 갖고 있어 entity 의 스키마에 바로 넣지 못한다.
 * 저장할 내용으로 바꾼 뒤 ProjectContentSchema 에 넘긴다. 규칙과 오류 문구는 그쪽에만 있다.
 * 폼의 항목과 저장할 내용의 이름이 같아, 오류가 난 자리(path)가 그대로 폼의 항목을 가리킨다.
 * 앞 단계는 모양만 본다. 썸네일의 대체 텍스트는 뒤 단계가 검사하게 여기서는 글자이기만 하면 받는다
 */
export const ProjectFormSchema = z
    .object({
        title: z.string(),
        category: z.string(),
        summary: z.string(),
        href: z.string(),
        image: ProjectImageSchema.extend({ alt: z.string() }).nullable(),
        published: z.boolean(),
        featured: z.boolean(),
        team: z.array(z.object({ part: z.string(), count: z.string() })),
        role: z.string(),
        scope: z.object({
            planning: ScopeLevelFormSchema,
            design: ScopeLevelFormSchema,
            publishing: ScopeLevelFormSchema,
            development: ScopeLevelFormSchema,
        }),
        period: z.object({ start: z.string(), end: z.string() }),
        isOngoing: z.boolean(),
        stack: z.array(z.string()),
        links: z.array(z.object({ label: z.string(), href: z.string() })),
        body: z.string(),
    })
    .transform(toContent)
    .pipe(ProjectContentSchema);
