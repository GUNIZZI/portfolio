import { PROJECT_FIELD_ERROR, PROJECT_IMAGE } from '@/entities/project/model/project.constants';
import {
    PROJECT_SCOPE_AREA,
    type ProjectCategory,
    type ProjectContentType,
} from '@/entities/project/model/project.schemas';
import type { ProjectEditorContent, ProjectRowData } from '@/entities/project/model/project.types';

import { BODY_TEMPLATE } from './projectEditor.constants';
import type {
    LinkFormValue,
    ProjectCounts,
    ProjectFormValue,
    ScopeFormValue,
    TeamFormValue,
} from './projectEditor.types';

/** 맡은 범위의 영역. 일이 흘러가는 순서이고, 폼도 이 순서로 그린다 */
export const SCOPE_AREAS = Object.values(PROJECT_SCOPE_AREA);

/** 빈 팀 1줄 */
export function createEmptyTeamPart(): TeamFormValue {
    return { part: '', count: '' };
}

/** 빈 링크 1줄 */
export function createEmptyLink(): LinkFormValue {
    return { label: '', href: '' };
}

/** 저장된 맡은 범위를 영역마다의 선택으로 바꾼다. 적지 않은 영역은 빈 문자열이다 */
function toScopeFormValue(scope: ProjectContentType['scope']): ScopeFormValue {
    return Object.fromEntries(
        SCOPE_AREAS.map((area) => [area, scope.find((item) => item.area === area)?.level ?? '']),
    ) as ScopeFormValue;
}

/**
 * 저장된 프로젝트를 폼의 값으로 바꾼다
 * @param content - 저장된 내용. 등록 화면이면 null
 * @returns 폼의 처음 값. 등록 화면이면 비공개이고, 본문에 템플릿이 들어 있다
 */
export function toFormValue(content: ProjectEditorContent | null): ProjectFormValue {
    if (!content) {
        return {
            title: '',
            category: '',
            summary: '',
            href: '',
            image: null,
            // 새 프로젝트는 비공개로 시작한다.(docs/plan/admin/README.md 「등록 · 수정」)
            published: false,
            featured: false,
            team: [],
            role: '',
            scope: toScopeFormValue([]),
            period: { start: '', end: '' },
            isOngoing: false,
            stack: [],
            links: [],
            body: BODY_TEMPLATE,
        };
    }
    return {
        title: content.title,
        category: content.category,
        summary: content.summary,
        href: content.href ?? '',
        image: content.image,
        published: content.published,
        featured: content.published && content.featured,
        team: content.team.map((member) => ({ part: member.part, count: String(member.count) })),
        role: content.role ?? '',
        scope: toScopeFormValue(content.scope),
        period: { start: content.period?.start ?? '', end: content.period?.end ?? '' },
        // 시작만 적혀 있으면 진행 중이다
        isOngoing: content.period !== undefined && content.period.end === undefined,
        stack: content.stack,
        links: content.links,
        body: content.body ?? '',
    };
}

/** 숫자만 적은 글자를 숫자로 바꾼다. 그 밖의 글자는 NaN 이라 스키마가 걸러 낸다 */
function toNumber(text: string): number {
    const trimmed = text.trim();
    return /^\d+$/.test(trimmed) ? Number(trimmed) : Number.NaN;
}

/**
 * 폼의 기간을 저장할 기간으로 바꾼다
 * @returns 시작과 끝을 모두 비웠으면 undefined. 진행 중이면 끝을 뺀다
 */
function toPeriod(value: ProjectFormValue): ProjectContentType['period'] {
    const start = value.period.start.trim();
    const end = value.isOngoing ? '' : value.period.end.trim();
    if (start === '' && end === '') {
        return undefined;
    }
    return { start, ...(end === '' ? {} : { end }) };
}

/**
 * 폼의 값을 저장할 내용으로 바꾼다. 비운 선택 항목은 키째로 뺀다. 비공개면 홈 노출을 끈다
 * @returns 스키마로 검증하기 전의 내용. 규칙에 맞는지는 ProjectContentSchema 가 본다
 */
export function toContent(value: ProjectFormValue): ProjectContentType {
    const href = value.href.trim();
    const role = value.role.trim();
    const period = toPeriod(value);
    return {
        title: value.title,
        // 고르지 않았으면 빈 문자열이고, 목록에서 뺀 분류일 수도 있다. 목록에 있는지는 스키마가 본다
        category: value.category as ProjectCategory,
        summary: value.summary,
        ...(href === '' ? {} : { href }),
        image: value.image,
        published: value.published,
        featured: value.published && value.featured,
        team: value.team.map((member) => ({ part: member.part, count: toNumber(member.count) })),
        ...(role === '' ? {} : { role }),
        // 고르지 않은 영역은 저장하지 않는다
        scope: SCOPE_AREAS.flatMap((area) => {
            const level = value.scope[area];
            return level === '' ? [] : [{ area, level }];
        }),
        ...(period === undefined ? {} : { period }),
        stack: value.stack,
        links: value.links.map((link) => ({ label: link.label, href: link.href.trim() })),
        ...(value.body === '' ? {} : { body: value.body }),
    };
}

/** 목록의 전체 · 공개 · 홈 노출 건수를 센다 */
export function toProjectCounts(rows: readonly ProjectRowData[]): ProjectCounts {
    return {
        total: rows.length,
        published: rows.filter((row) => row.isPublished).length,
        featured: rows.filter((row) => row.isFeatured).length,
    };
}

/**
 * 한 줄의 공개 여부를 바꾼 새 목록. 비공개로 바꾸면 홈 노출도 함께 끈다.
 * 서버가 저장하는 것과 같은 규칙으로 화면을 먼저 바꿔 둔다.(docs/plan/admin/README.md 「홈 노출」)
 */
export function withPublished(
    rows: readonly ProjectRowData[],
    id: string,
    isPublished: boolean,
): ProjectRowData[] {
    return rows.map((row) =>
        row.id === id ? { ...row, isPublished, isFeatured: isPublished && row.isFeatured } : row,
    );
}

/** 한 줄의 홈 노출 여부를 바꾼 새 목록. 비공개인 줄은 켜지지 않는다 */
export function withFeatured(
    rows: readonly ProjectRowData[],
    id: string,
    isFeatured: boolean,
): ProjectRowData[] {
    return rows.map((row) =>
        row.id === id ? { ...row, isFeatured: row.isPublished && isFeatured } : row,
    );
}

/**
 * 고른 파일이 썸네일의 제한에 맞는지 본다
 * @returns 맞지 않으면 보여 줄 오류 문구, 맞으면 null
 */
export function toImageFileError(file: Pick<File, 'type' | 'size'>): string | null {
    const types: readonly string[] = PROJECT_IMAGE.CONTENT_TYPES;
    if (!types.includes(file.type)) {
        return PROJECT_FIELD_ERROR.IMAGE_TYPE;
    }
    if (file.size > PROJECT_IMAGE.MAX_BYTES) {
        return PROJECT_FIELD_ERROR.IMAGE_SIZE;
    }
    return null;
}

/**
 * 긴 변이 제한을 넘지 않게 줄인 크기를 낸다. 비율은 그대로다.(docs/plan/admin/README.md 요구사항 31)
 * @returns 줄인 가로 · 세로. 제한보다 작으면 원래 크기 그대로다
 */
export function toResizedSize(width: number, height: number): { width: number; height: number } {
    const scale = Math.min(1, PROJECT_IMAGE.MAX_SIDE / Math.max(width, height));
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}

/** 이미지 형식에 맞는 확장자 */
const IMAGE_EXTENSION: Record<string, string> = {
    'image/webp': 'webp',
    'image/png': 'png',
    'image/jpeg': 'jpg',
};

/**
 * 이미지 저장소에 올릴 경로를 만든다. 영문 · 숫자 · 줄표 · 밑줄이 아닌 글자는 줄표로 바꾼다.
 * 확장자는 올리는 형식을 따른다. 크기를 줄이면서 형식이 바뀌기 때문이다.
 * 같은 이름이 겹치지 않게 하는 것은 저장소가 한다.(entities/project 의 createImageUploadToken)
 * @param fileName - 고른 파일의 이름
 * @param contentType - 올리는 파일의 형식
 */
export function toImagePathname(fileName: string, contentType: string): string {
    const baseName = fileName.replace(/\.[^.]*$/, '').replace(/[^A-Za-z0-9_-]+/g, '-');
    const extension = IMAGE_EXTENSION[contentType] ?? 'png';
    return `${PROJECT_IMAGE.FOLDER}/${baseName}.${extension}`;
}
