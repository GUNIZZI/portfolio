import 'server-only';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';

import { getFirestoreDb } from '@/shared/util/firebaseAdmin';

import { EXPERIENCE_COLLECTION } from '../model/experience.constants';
import { ExperienceSchema, type ExperienceType } from '../model/experience.schemas';
import type { ExperienceResponse } from '../model/experience.types';

export interface ExperienceRepository {
    /**
     * 경력 전체를 읽고 스키마로 검증한다
     * @returns 저장소가 주는 순서의 목록. 정렬하지 않는다
     * @throws 스키마에 맞지 않는 문서가 있을 때
     * @see {@link ExperienceResponse}
     */
    getExperienceList(): Promise<ExperienceResponse[]>;

    /**
     * 경력 1건을 등록한다. id 는 저장소가 발급하고, 등록 · 저장 시각은 서버가 기록한다
     * @param content - 스키마로 검증을 마친 내용
     * @returns 발급한 id
     */
    createExperience(content: ExperienceType): Promise<string>;

    /**
     * 경력 1건의 내용을 통째로 바꾼다. 등록 시각은 남기고 저장 시각은 서버가 기록한다
     * @param id - 고칠 경력의 id
     * @param content - 스키마로 검증을 마친 내용
     * @returns 그 id 의 경력이 없어 고치지 않았으면 false
     */
    updateExperience(id: string, content: ExperienceType): Promise<boolean>;

    /**
     * 경력 1건을 지운다. 회사와 그 안의 프로젝트 목록이 함께 없어진다
     * @param id - 지울 경력의 id
     * @returns 그 id 의 경력이 없어 지우지 않았으면 false
     */
    deleteExperience(id: string): Promise<boolean>;
}

/** 저장한 시각을 직렬화할 수 있는 문자열로 바꾼다. 캐시에는 Timestamp 를 담을 수 없다 */
function toIsoString(value: unknown): string | null {
    return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

function getCollection() {
    return getFirestoreDb().collection(EXPERIENCE_COLLECTION);
}

export const experienceRepository: ExperienceRepository = {
    async getExperienceList() {
        const snapshot = await getCollection().get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...ExperienceSchema.parse(data),
                id: doc.id,
                updatedAt: toIsoString(data['updatedAt']),
            };
        });
    },

    async createExperience(content) {
        const now = FieldValue.serverTimestamp();
        const doc = await getCollection().add({ ...content, createdAt: now, updatedAt: now });
        return doc.id;
    },

    async updateExperience(id, content) {
        const doc = getCollection().doc(id);
        const snapshot = await doc.get();
        if (!snapshot.exists) {
            return false;
        }
        // 통째로 바꾼다. 합치면 비운 선택 항목(totalProjects 등)이 저장소에 남는다
        const createdAt: unknown = snapshot.get('createdAt');
        await doc.set({
            ...content,
            createdAt: createdAt ?? FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        return true;
    },

    async deleteExperience(id) {
        const doc = getCollection().doc(id);
        const snapshot = await doc.get();
        if (!snapshot.exists) {
            return false;
        }
        await doc.delete();
        return true;
    },
};
