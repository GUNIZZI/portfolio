import 'server-only';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';

import { getFirestoreDb } from '@/shared/util/firebaseAdmin';

import { ABOUT_COLLECTION, ABOUT_SECTION, type AboutSection } from '../model/about.constants';
import {
    AboutHomeSchema,
    AboutIntroSchema,
    AboutPrinciplesSchema,
    AboutSkillGroupsSchema,
} from '../model/about.schemas';
import type { AboutResponse, AboutSectionContent } from '../model/about.types';

export interface AboutRepository {
    /**
     * 소개 내용의 섹션 4개를 모두 읽고 스키마로 검증한다
     * @throws 섹션 문서가 없거나 스키마에 맞지 않을 때
     * @see {@link AboutResponse}
     */
    getAbout(): Promise<AboutResponse>;

    /**
     * 섹션 1건을 저장한다. 저장한 시각은 서버가 기록한다
     * @param section - 저장할 섹션
     * @param content - 스키마로 검증을 마친 내용
     */
    saveSection<Section extends AboutSection>(
        section: Section,
        content: AboutSectionContent[Section],
    ): Promise<void>;
}

/** 저장한 시각을 직렬화할 수 있는 문자열로 바꾼다. 캐시에는 Timestamp 를 담을 수 없다 */
function toIsoString(value: unknown): string | null {
    return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

export const aboutRepository: AboutRepository = {
    async getAbout() {
        const collection = getFirestoreDb().collection(ABOUT_COLLECTION);
        const [intro, principles, skillGroups, home] = await Promise.all(
            [
                ABOUT_SECTION.INTRO,
                ABOUT_SECTION.PRINCIPLES,
                ABOUT_SECTION.SKILL_GROUPS,
                ABOUT_SECTION.HOME,
            ].map(async (section) => {
                const snapshot = await collection.doc(section).get();
                const data = snapshot.data();
                if (!data) {
                    throw new Error(`소개 내용의 ${section} 문서가 저장소에 없다`);
                }
                return data;
            }),
        );

        return {
            intro: {
                content: AboutIntroSchema.parse(intro),
                updatedAt: toIsoString(intro?.['updatedAt']),
            },
            principles: {
                content: AboutPrinciplesSchema.parse(principles),
                updatedAt: toIsoString(principles?.['updatedAt']),
            },
            skillGroups: {
                content: AboutSkillGroupsSchema.parse(skillGroups),
                updatedAt: toIsoString(skillGroups?.['updatedAt']),
            },
            home: {
                content: AboutHomeSchema.parse(home),
                updatedAt: toIsoString(home?.['updatedAt']),
            },
        };
    },

    async saveSection(section, content) {
        await getFirestoreDb()
            .collection(ABOUT_COLLECTION)
            .doc(section)
            .set({ ...content, updatedAt: FieldValue.serverTimestamp() });
    },
};
