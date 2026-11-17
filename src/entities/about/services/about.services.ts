import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { ABOUT_CACHE_TAG, type AboutSection } from '../model/about.constants';
import { ABOUT_SECTION_SCHEMAS } from '../model/about.schemas';
import type {
    AboutEditorData,
    AboutHomeData,
    AboutIntroData,
    AboutPrincipleData,
    AboutResponse,
    AboutSkillGroupData,
} from '../model/about.types';
import { aboutRepository } from '../repositories/about.repositories';

/**
 * 소개 내용 전체를 읽는다. 결과를 캐시해 공개 화면이 요청마다 저장소를 부르지 않게 한다.
 * 관리 화면에서 저장하면 ABOUT_CACHE_TAG 의 캐시를 지운다
 */
export async function getAbout(): Promise<AboutResponse> {
    'use cache';
    cacheTag(ABOUT_CACHE_TAG);
    cacheLife('days');

    return aboutRepository.getAbout();
}

/** 소개 페이지의 인트로 */
export async function getAboutIntro(): Promise<AboutIntroData> {
    return (await getAbout()).intro.content;
}

/** 일하는 방식 4가지 */
export async function getWorkPrincipleList(): Promise<AboutPrincipleData[]> {
    return (await getAbout()).principles.content.items;
}

/** 기술 묶음 8개 */
export async function getSkillGroupList(): Promise<AboutSkillGroupData[]> {
    return (await getAbout()).skillGroups.content.items;
}

/** 홈의 소개 섹션 */
export async function getAboutHome(): Promise<AboutHomeData> {
    return (await getAbout()).home.content;
}

const UPDATED_AT_FORMAT = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

/**
 * 저장한 시각을 관리 화면의 수정 일시 문구로 바꾼다. 한국 시각으로 적는다
 * @param updatedAt - 저장한 시각(ISO 8601). 기록이 없으면 null
 * @returns 2026.11.17 (10:12) 형식의 문구. 기록이 없으면 null
 */
export function toUpdatedAtText(updatedAt: string | null): string | null {
    if (!updatedAt) {
        return null;
    }
    const parts = Object.fromEntries(
        UPDATED_AT_FORMAT.formatToParts(new Date(updatedAt)).map((part) => [part.type, part.value]),
    );
    return `${parts['year']}.${parts['month']}.${parts['day']} (${parts['hour']}:${parts['minute']})`;
}

/** 관리 화면이 그릴 소개 내용. 섹션마다 내용과 수정 일시 문구를 낸다 */
export async function getAboutEditor(): Promise<AboutEditorData> {
    const about = await getAbout();
    return {
        intro: {
            content: about.intro.content,
            updatedAtText: toUpdatedAtText(about.intro.updatedAt),
        },
        principles: {
            content: about.principles.content,
            updatedAtText: toUpdatedAtText(about.principles.updatedAt),
        },
        skillGroups: {
            content: about.skillGroups.content,
            updatedAtText: toUpdatedAtText(about.skillGroups.updatedAt),
        },
        home: {
            content: about.home.content,
            updatedAtText: toUpdatedAtText(about.home.updatedAt),
        },
    };
}

/**
 * 섹션 1건을 검증하고 저장한다
 * @param section - 저장할 섹션
 * @param content - 폼이 보낸 내용
 * @returns 규칙에 맞지 않아 저장하지 않았으면 false
 */
export async function saveAboutSection(section: AboutSection, content: unknown): Promise<boolean> {
    const parsed = ABOUT_SECTION_SCHEMAS[section].safeParse(content);
    if (!parsed.success) {
        return false;
    }
    await aboutRepository.saveSection(section, parsed.data);
    return true;
}
