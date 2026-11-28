import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { toUpdatedAtText } from '@/shared/util/dateText';

import {
    COLOPHON_CACHE_TAG,
    COLOPHON_DEFAULT_CONTENT,
    type ColophonSection,
} from '../model/colophon.constants';
import { COLOPHON_SECTION_SCHEMAS } from '../model/colophon.schemas';
import type {
    ColophonData,
    ColophonEditorData,
    ColophonEditorSectionData,
    ColophonResponse,
    ColophonSectionResponse,
    ColophonTeaserData,
} from '../model/colophon.types';
import { colophonRepository } from '../repositories/colophon.repositories';

/**
 * 저장소의 내용 전체를 읽는다. 결과를 캐시해 공개 화면이 요청마다 저장소를 부르지 않게 한다.
 * 관리 화면에서 저장하면 COLOPHON_CACHE_TAG 의 캐시를 지운다
 */
export async function getColophon(): Promise<ColophonResponse> {
    'use cache';
    cacheTag(COLOPHON_CACHE_TAG);
    cacheLife('days');

    return colophonRepository.getColophon();
}

/** 공개 화면이 그릴 내용. 한 번도 저장하지 않은 섹션은 처음 값으로 채운다 */
export async function getColophonData(): Promise<ColophonData> {
    const colophon = await getColophon();
    return {
        head: colophon.head?.content ?? COLOPHON_DEFAULT_CONTENT.head,
        process: colophon.process?.content ?? COLOPHON_DEFAULT_CONTENT.process,
        design: colophon.design?.content ?? COLOPHON_DEFAULT_CONTENT.design,
        develop: colophon.develop?.content ?? COLOPHON_DEFAULT_CONTENT.develop,
        guards: colophon.guards?.content ?? COLOPHON_DEFAULT_CONTENT.guards,
        human: colophon.human?.content ?? COLOPHON_DEFAULT_CONTENT.human,
        stack: colophon.stack?.content ?? COLOPHON_DEFAULT_CONTENT.stack,
    };
}

/** 홈의 제작 과정 섹션이 그릴 값. 머리의 한 줄 요약과 과정의 단계다 */
export async function getColophonTeaser(): Promise<ColophonTeaserData> {
    const { head, process } = await getColophonData();
    return { summary: head.summary, steps: process.items };
}

/** 섹션 1건을 관리 화면의 모양으로 바꾼다. 저장한 적이 없으면 처음 값을 내고 수정 일시는 비운다 */
function toEditorSection<Content>(
    response: ColophonSectionResponse<Content> | null,
    defaultContent: Content,
): ColophonEditorSectionData<Content> {
    return {
        content: response?.content ?? defaultContent,
        updatedAtText: toUpdatedAtText(response?.updatedAt ?? null),
    };
}

/** 관리 화면이 그릴 내용. 섹션마다 내용과 수정 일시 문구를 낸다 */
export async function getColophonEditor(): Promise<ColophonEditorData> {
    const colophon = await getColophon();
    return {
        head: toEditorSection(colophon.head, COLOPHON_DEFAULT_CONTENT.head),
        process: toEditorSection(colophon.process, COLOPHON_DEFAULT_CONTENT.process),
        design: toEditorSection(colophon.design, COLOPHON_DEFAULT_CONTENT.design),
        develop: toEditorSection(colophon.develop, COLOPHON_DEFAULT_CONTENT.develop),
        guards: toEditorSection(colophon.guards, COLOPHON_DEFAULT_CONTENT.guards),
        human: toEditorSection(colophon.human, COLOPHON_DEFAULT_CONTENT.human),
        stack: toEditorSection(colophon.stack, COLOPHON_DEFAULT_CONTENT.stack),
    };
}

/**
 * 섹션 1건을 검증하고 저장한다
 * @param section - 저장할 섹션
 * @param content - 폼이 보낸 내용
 * @returns 규칙에 맞지 않아 저장하지 않았으면 false
 */
export async function saveColophonSection(
    section: ColophonSection,
    content: unknown,
): Promise<boolean> {
    const parsed = COLOPHON_SECTION_SCHEMAS[section].safeParse(content);
    if (!parsed.success) {
        return false;
    }
    // 섹션마다 스키마가 달라 타입이 하나로 좁혀지지 않는다. 위에서 그 섹션의 스키마로 검증했다
    await colophonRepository.saveSection(section, parsed.data);
    return true;
}
