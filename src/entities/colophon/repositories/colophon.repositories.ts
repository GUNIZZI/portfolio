import 'server-only';

import { FieldValue, Timestamp } from 'firebase-admin/firestore';

import { getFirestoreDb } from '@/shared/util/firebaseAdmin';

import {
    COLOPHON_COLLECTION,
    COLOPHON_SECTION,
    type ColophonSection,
} from '../model/colophon.constants';
import { COLOPHON_SECTION_SCHEMAS } from '../model/colophon.schemas';
import type {
    ColophonResponse,
    ColophonSectionContent,
    ColophonSectionResponse,
} from '../model/colophon.types';

export interface ColophonRepository {
    /**
     * 섹션 7개를 모두 읽고 스키마로 검증한다. 문서가 없는 섹션은 null 로 낸다
     * @throws 섹션 문서가 스키마에 맞지 않을 때
     * @see {@link ColophonResponse}
     */
    getColophon(): Promise<ColophonResponse>;

    /**
     * 섹션 1건을 저장한다. 저장한 시각은 서버가 기록한다
     * @param section - 저장할 섹션
     * @param content - 스키마로 검증을 마친 내용
     */
    saveSection<Section extends ColophonSection>(
        section: Section,
        content: ColophonSectionContent[Section],
    ): Promise<void>;
}

/** 저장한 시각을 직렬화할 수 있는 문자열로 바꾼다. 캐시에는 Timestamp 를 담을 수 없다 */
function toIsoString(value: unknown): string | null {
    return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

/** 섹션 1건을 읽고 검증한다. 문서가 없으면 null */
async function readSection<Section extends ColophonSection>(
    section: Section,
): Promise<ColophonSectionResponse<ColophonSectionContent[Section]> | null> {
    const snapshot = await getFirestoreDb().collection(COLOPHON_COLLECTION).doc(section).get();
    const data = snapshot.data();
    if (!data) {
        return null;
    }
    return {
        // 섹션마다 스키마가 달라 타입이 하나로 좁혀지지 않는다. 섹션과 내용의 짝은 ColophonSectionContent 가 맞춘다
        content: COLOPHON_SECTION_SCHEMAS[section].parse(data) as ColophonSectionContent[Section],
        updatedAt: toIsoString(data['updatedAt']),
    };
}

export const colophonRepository: ColophonRepository = {
    async getColophon() {
        const [head, process, design, develop, guards, human, stack] = await Promise.all([
            readSection(COLOPHON_SECTION.HEAD),
            readSection(COLOPHON_SECTION.PROCESS),
            readSection(COLOPHON_SECTION.DESIGN),
            readSection(COLOPHON_SECTION.DEVELOP),
            readSection(COLOPHON_SECTION.GUARDS),
            readSection(COLOPHON_SECTION.HUMAN),
            readSection(COLOPHON_SECTION.STACK),
        ]);
        return { head, process, design, develop, guards, human, stack };
    },

    async saveSection(section, content) {
        await getFirestoreDb()
            .collection(COLOPHON_COLLECTION)
            .doc(section)
            .set({ ...content, updatedAt: FieldValue.serverTimestamp() });
    },
};
