import { z } from 'zod';

import { ExperienceSchema } from '@/entities/experience/model/experience.schemas';

import { toContent } from './experienceEditor.utils';

/**
 * 경력 폼의 스키마. 폼은 연도와 수를 글자로 갖고 있어 entity 의 스키마에 바로 넣지 못한다.
 * 글자를 저장할 내용으로 바꾼 뒤 ExperienceSchema 에 넘긴다. 규칙과 오류 문구는 그쪽에만 있다.
 * 폼의 항목과 저장할 내용의 이름이 같아, 오류가 난 자리(path)가 그대로 폼의 항목을 가리킨다.
 * 앞 단계는 모양만 본다. 폼이 만든 값이라 여기서 걸리는 일은 없다
 */
export const ExperienceFormSchema = z
    .object({
        company: z.string(),
        startYear: z.string(),
        isCurrent: z.boolean(),
        endYear: z.string(),
        summary: z.string(),
        totalProjects: z.string(),
        projects: z.array(
            z.object({
                name: z.string(),
                date: z.string(),
                tags: z.array(z.string()),
                workSlug: z.string(),
            }),
        ),
    })
    .transform(toContent)
    .pipe(ExperienceSchema);
