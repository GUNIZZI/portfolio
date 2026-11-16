import 'server-only';

import EXPERIENCES from '@content/experiences.json';

import { ExperienceListSchema } from '../model/experience.schemas';
import type { ExperienceResponse } from '../model/experience.types';

export interface ExperienceRepository {
    /**
     * 경력 원문 전체를 읽고 스키마로 검증한다
     * @returns 원문 순서 그대로의 목록. 최근 회사가 앞이다
     * @see {@link ExperienceResponse}
     */
    getExperienceList(): Promise<ExperienceResponse[]>;
}

export const experienceRepository: ExperienceRepository = {
    getExperienceList() {
        return Promise.resolve(ExperienceListSchema.parse(EXPERIENCES));
    },
};
