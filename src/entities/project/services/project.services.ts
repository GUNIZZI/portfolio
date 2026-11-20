import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import sanitizeHtml from 'sanitize-html';

import { toUpdatedAtText } from '@/shared/util/dateText';

import {
    PROJECT_CACHE_TAG,
    PROJECT_SCOPE_AREA_LABEL,
    PROJECT_SCOPE_LEVEL_LABEL,
} from '../model/project.constants';
import {
    ProjectContentSchema,
    type ProjectContentType,
    ProjectImageSchema,
    ProjectOrderSchema,
    type ProjectScopeArea,
} from '../model/project.schemas';
import {
    PROJECT_SAVE_STATUS,
    type ProjectData,
    type ProjectDetailData,
    type ProjectEditorContent,
    type ProjectEditorData,
    type ProjectNeighborData,
    type ProjectOptionData,
    type ProjectResponse,
    type ProjectRowData,
    type ProjectSaveStatus,
    type ProjectScopeData,
} from '../model/project.types';
import {
    type ProjectImageUploadResponse,
    projectRepository,
} from '../repositories/project.repositories';

/** 작업 상세의 주소 */
function toDetailHref(id: string): string {
    return `/work/${id}`;
}

export function toProjectData(project: ProjectResponse): ProjectData {
    return {
        id: project.id,
        title: project.title,
        category: project.category,
        summary: project.summary,
        href: project.href ?? toDetailHref(project.id),
        image: project.image,
    };
}

export function toProjectRowData(project: ProjectResponse): ProjectRowData {
    return {
        id: project.id,
        title: project.title,
        category: project.category,
        image: project.image ? { src: project.image.src, alt: project.image.alt } : null,
        isPublished: project.published,
        // 비공개 프로젝트는 홈에 나오지 않는다. 저장소의 값이 어긋나 있어도 화면은 꺼진 것으로 그린다
        isFeatured: project.published && project.featured,
        updatedAtText: toUpdatedAtText(project.updatedAt),
    };
}

/**
 * 순서(order)가 작은 것부터 놓는다. 저장소가 주는 순서는 정해져 있지 않다.
 * 순서가 같으면 제목 순이다. 순서를 한 번이라도 저장하면 겹치지 않는다
 */
export function sortProjectList(list: ProjectResponse[]): ProjectResponse[] {
    return list.toSorted((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/**
 * 프로젝트 전체를 읽어 순서대로 놓는다. 결과를 캐시해 공개 화면이 요청마다 저장소를 부르지 않게 한다.
 * 관리 화면에서 저장하거나 지우면 PROJECT_CACHE_TAG 의 캐시를 지운다
 */
async function getProjectResponseList(): Promise<ProjectResponse[]> {
    'use cache';
    cacheTag(PROJECT_CACHE_TAG);
    cacheLife('days');

    return sortProjectList(await projectRepository.getProjectList());
}

/** 공개한 프로젝트만 순서대로. 공개 화면은 이 목록만 그린다 */
async function getPublishedResponseList(): Promise<ProjectResponse[]> {
    const list = await getProjectResponseList();
    return list.filter((project) => project.published);
}

/** 작업 목록에 그릴 작업. 공개한 것 전부다 */
export async function getProjectList(): Promise<ProjectData[]> {
    const list = await getPublishedResponseList();
    return list.map(toProjectData);
}

/** 홈의 대표 작업에 그릴 작업. 공개한 것 가운데 홈 노출을 켠 것이다 */
export async function getFeaturedProjectList(): Promise<ProjectData[]> {
    const list = await getPublishedResponseList();
    return list.filter((project) => project.featured).map(toProjectData);
}

function toNeighbor(project: ProjectResponse | undefined): ProjectNeighborData | null {
    return project ? { title: project.title, href: toDetailHref(project.id) } : null;
}

const SCOPE_AREA_ORDER = Object.keys(PROJECT_SCOPE_AREA_LABEL) as ProjectScopeArea[];

/** 팀 구성을 한 줄로 적는다. 적지 않았으면 null */
function toTeamText(team: ProjectResponse['team']): string | null {
    if (team.length === 0) return null;
    return team.map((member) => `${member.part} ${member.count}명`).join(' · ');
}

/** 맡은 범위를 일이 흘러가는 순서로 놓고 이름을 붙인다. 원문에 적은 순서와 상관없다 */
function toScope(scope: ProjectResponse['scope']): ProjectScopeData[] {
    return SCOPE_AREA_ORDER.flatMap((area) => {
        const item = scope.find((candidate) => candidate.area === area);
        if (!item) return [];
        return [
            {
                areaLabel: PROJECT_SCOPE_AREA_LABEL[area],
                level: item.level,
                levelLabel: PROJECT_SCOPE_LEVEL_LABEL[item.level],
            },
        ];
    });
}

/** 본문의 앞뒤 공백을 뗀다. 적지 않았거나 비어 있으면 null */
function toBody(body: string | undefined): string | null {
    const trimmed = (body ?? '').trim();
    return trimmed === '' ? null : trimmed;
}

function toPeriodText(period: ProjectResponse['period']): string | null {
    if (!period) return null;
    return `${period.start} – ${period.end ?? '진행 중'}`;
}

/**
 * 목록에서 한 건을 상세 화면용으로 바꾼다. 앞뒤 작업은 목록의 순서를 따른다
 * @param list 공개한 프로젝트 전체. 순서가 화면의 순서다
 * @param index 바꿀 작업의 자리
 */
export function toProjectDetailData(
    list: readonly ProjectResponse[],
    index: number,
): ProjectDetailData | null {
    const project = list[index];
    if (!project) return null;

    return {
        ...toProjectData(project),
        teamText: toTeamText(project.team),
        role: project.role ?? null,
        scope: toScope(project.scope),
        periodText: toPeriodText(project.period),
        stack: project.stack,
        links: project.links,
        body: toBody(project.body),
        prev: toNeighbor(list[index - 1]),
        next: toNeighbor(list[index + 1]),
    };
}

/** 작업 상세 한 건. 없는 id 이거나 비공개면 null */
export async function getProject(id: string): Promise<ProjectDetailData | null> {
    const list = await getPublishedResponseList();
    const index = list.findIndex((project) => project.id === id);
    return index === -1 ? null : toProjectDetailData(list, index);
}

/** 상세 페이지를 미리 그릴 id 전체. 공개한 것만이다 */
export async function getProjectIdList(): Promise<string[]> {
    const list = await getPublishedResponseList();
    return list.map((project) => project.id);
}

/** 관리 화면의 프로젝트 목록. 비공개를 포함한 전체를 순서대로 낸다 */
export async function getProjectRowList(): Promise<ProjectRowData[]> {
    const list = await getProjectResponseList();
    return list.map(toProjectRowData);
}

/** 다른 화면이 프로젝트를 고를 때 쓰는 목록. 비공개를 포함한 전체를 순서대로 낸다 */
export async function getProjectOptionList(): Promise<ProjectOptionData[]> {
    const list = await getProjectResponseList();
    return list.map((project) => ({
        id: project.id,
        title: project.title,
        isPublished: project.published,
    }));
}

/** 저장된 프로젝트에서 폼이 다루는 내용만 고른다. 순서 · 저장 시각처럼 폼이 다루지 않는 것을 뺀다 */
function toContent(project: ProjectResponse): ProjectEditorContent {
    return {
        title: project.title,
        category: project.category,
        summary: project.summary,
        ...(project.href === undefined ? {} : { href: project.href }),
        image: project.image,
        published: project.published,
        featured: project.published && project.featured,
        team: project.team,
        ...(project.role === undefined ? {} : { role: project.role }),
        scope: project.scope,
        ...(project.period === undefined ? {} : { period: project.period }),
        stack: project.stack,
        links: project.links,
        ...(project.body === undefined ? {} : { body: project.body }),
    };
}

/**
 * 본문에 남기는 태그. 관리 화면의 에디터가 내는 서식이다.(src/shared/ui/tiptapEditor/TiptapEditor.tsx)
 * 이 밖의 태그와 속성은 저장하기 전에 걷어 낸다. 읽는 화면은 본문을 정제하지 않고 그대로 그린다.
 * (src/shared/ui/tiptapViewer/TiptapViewer.tsx)
 * 이미지와 표도 남긴다.(2026-11-20 사용자 결정)
 */
const BODY_ALLOWED_TAGS = [
    'h2',
    'h3',
    'p',
    'br',
    'hr',
    'strong',
    'em',
    'u',
    's',
    'code',
    'pre',
    'blockquote',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'table',
    'tbody',
    'tr',
    'th',
    'td',
];

/** 본문의 이미지로 받는 주소인가. 썸네일과 같이 이미지 저장소의 주소만 받는다 */
function isBodyImageSrc(src: string | undefined): boolean {
    return ProjectImageSchema.shape.src.safeParse(src).success;
}

/**
 * 본문에 든 이미지의 주소. 정제한 본문에서 읽는다
 * @param body - 저장된 본문. 없으면 빈 목록을 낸다
 */
export function toBodyImageList(body: string | undefined): string[] {
    if (!body) {
        return [];
    }
    const list: string[] = [];
    sanitizeHtml(body, {
        allowedTags: ['img'],
        allowedAttributes: { img: ['src'] },
        exclusiveFilter: (frame) => {
            const src = frame.attribs['src'];
            if (frame.tag === 'img' && src && isBodyImageSrc(src)) {
                list.push(src);
            }
            return false;
        },
    });
    return [...new Set(list)];
}

/**
 * 본문을 정제한다. 에디터의 서식 태그만 남기고, 링크는 http · https 주소만 남긴다.
 * 이미지는 이미지 저장소의 주소만 남긴다
 * @returns 정제한 HTML. 글자도 구분선도 이미지도 없으면 null. 빈 에디터는 빈 문단 하나를 낸다
 */
export function sanitizeProjectBody(body: string | undefined): string | null {
    if (body === undefined) {
        return null;
    }
    const sanitized = sanitizeHtml(body, {
        allowedTags: BODY_ALLOWED_TAGS,
        allowedAttributes: {
            a: ['href', 'target', 'rel'],
            ol: ['start'],
            img: ['src', 'alt', 'width', 'height'],
            th: ['colspan', 'rowspan'],
            td: ['colspan', 'rowspan'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        exclusiveFilter: (frame) => frame.tag === 'img' && !isBodyImageSrc(frame.attribs['src']),
    }).trim();
    const text = sanitizeHtml(sanitized, { allowedTags: [], allowedAttributes: {} }).trim();
    const hasBlock = sanitized.includes('<hr') || sanitized.includes('<img');
    return text === '' && !hasBlock ? null : sanitized;
}

/**
 * 관리 화면의 수정 폼이 그릴 프로젝트 1건
 * @param id - 프로젝트의 id
 * @returns 그 id 의 프로젝트가 없으면 null
 */
export async function getProjectEditor(id: string): Promise<ProjectEditorData | null> {
    const list = await getProjectResponseList();
    const project = list.find((item) => item.id === id);
    if (!project) {
        return null;
    }
    return {
        id,
        content: toContent(project),
        updatedAtText: toUpdatedAtText(project.updatedAt),
    };
}

/**
 * 폼이 보낸 내용을 검증한다. 값이 없는 선택 항목은 키째로 뺀다. 저장소는 undefined 를 받지 않는다.
 * 비공개면 홈 노출을 끈다.(docs/plan/admin/README.md 「홈 노출」) 본문은 정제하고, 비었으면 뺀다.
 * @returns 규칙에 맞지 않으면 null
 */
function parseContent(content: unknown): ProjectContentType | null {
    const parsed = ProjectContentSchema.safeParse(content);
    if (!parsed.success) {
        return null;
    }
    const { body, ...rest } = parsed.data;
    const sanitizedBody = sanitizeProjectBody(body);
    const normalized = {
        ...rest,
        featured: rest.published && rest.featured,
        ...(sanitizedBody === null ? {} : { body: sanitizedBody }),
    };
    return JSON.parse(JSON.stringify(normalized)) as ProjectContentType;
}

/**
 * 쓰지 않게 된 썸네일 파일을 지운다. 지우지 못해도 던지지 않는다.
 * 문서는 이미 바뀌었고, 남은 파일은 화면에 나오지 않는다
 */
async function removeImage(src: string): Promise<void> {
    try {
        await projectRepository.deleteImage(src);
    } catch (error) {
        console.error(error);
    }
}

/**
 * 프로젝트 1건을 검증하고 등록한다. 맨 뒤에 놓는다
 * @param content - 폼이 보낸 내용
 */
export async function createProject(content: unknown): Promise<ProjectSaveStatus> {
    const parsed = parseContent(content);
    if (!parsed) {
        return PROJECT_SAVE_STATUS.INVALID;
    }
    // 캐시가 아니라 지금의 목록에서 마지막 순서를 읽는다
    const list = await projectRepository.getProjectList();
    const lastOrder = Math.max(-1, ...list.map((project) => project.order));
    await projectRepository.createProject(parsed, lastOrder + 1);
    return PROJECT_SAVE_STATUS.SAVED;
}

/**
 * 프로젝트 1건을 검증하고 고친다. 썸네일을 바꾸거나 지웠으면 이전 파일도 지운다.
 * 본문에서 뺀 이미지의 파일도 지운다
 * @param id - 고칠 프로젝트의 id
 * @param content - 폼이 보낸 내용
 */
export async function updateProject(id: string, content: unknown): Promise<ProjectSaveStatus> {
    const parsed = parseContent(content);
    if (!parsed) {
        return PROJECT_SAVE_STATUS.INVALID;
    }
    const previous = await projectRepository.getProject(id);
    if (!previous) {
        return PROJECT_SAVE_STATUS.NOT_FOUND;
    }
    await projectRepository.updateProject(id, parsed);
    if (previous.image && previous.image.src !== parsed.image?.src) {
        await removeImage(previous.image.src);
    }
    const kept = toBodyImageList(parsed.body);
    const dropped = toBodyImageList(previous.body).filter((src) => !kept.includes(src));
    await Promise.all(dropped.map(removeImage));
    return PROJECT_SAVE_STATUS.SAVED;
}

/**
 * 프로젝트 1건의 공개 여부를 바꾼다. 비공개로 바꾸면 홈 노출도 함께 끈다
 * @param id - 바꿀 프로젝트의 id
 */
export async function setProjectPublished(
    id: string,
    isPublished: boolean,
): Promise<ProjectSaveStatus> {
    const previous = await projectRepository.getProject(id);
    if (!previous) {
        return PROJECT_SAVE_STATUS.NOT_FOUND;
    }
    await projectRepository.updateProjectFlags(id, {
        published: isPublished,
        featured: isPublished && previous.featured,
    });
    return PROJECT_SAVE_STATUS.SAVED;
}

/**
 * 프로젝트 1건의 홈 노출 여부를 바꾼다. 비공개 프로젝트는 켤 수 없다
 * @param id - 바꿀 프로젝트의 id
 */
export async function setProjectFeatured(
    id: string,
    isFeatured: boolean,
): Promise<ProjectSaveStatus> {
    const previous = await projectRepository.getProject(id);
    if (!previous) {
        return PROJECT_SAVE_STATUS.NOT_FOUND;
    }
    if (isFeatured && !previous.published) {
        return PROJECT_SAVE_STATUS.INVALID;
    }
    await projectRepository.updateProjectFlags(id, {
        published: previous.published,
        featured: isFeatured,
    });
    return PROJECT_SAVE_STATUS.SAVED;
}

/**
 * 프로젝트의 순서를 바꾼다
 * @param ids - 놓을 차례대로 적은 id. 지금 있는 프로젝트 전체를 한 번씩 적어야 한다
 */
export async function reorderProjectList(ids: unknown): Promise<ProjectSaveStatus> {
    const parsed = ProjectOrderSchema.safeParse(ids);
    if (!parsed.success) {
        return PROJECT_SAVE_STATUS.INVALID;
    }
    const list = await projectRepository.getProjectList();
    const currentIds = new Set(list.map((project) => project.id));
    const nextIds = new Set(parsed.data);
    // 그사이 프로젝트가 늘거나 줄었으면 화면의 목록이 낡은 것이다. 일부만 옮기지 않는다
    const isSameSet =
        parsed.data.length === nextIds.size &&
        nextIds.size === currentIds.size &&
        parsed.data.every((id) => currentIds.has(id));
    if (!isSameSet) {
        return PROJECT_SAVE_STATUS.INVALID;
    }
    await projectRepository.updateProjectOrder(parsed.data);
    return PROJECT_SAVE_STATUS.SAVED;
}

/**
 * 프로젝트 1건을 지운다. 문서와 썸네일 · 본문 이미지의 파일을 함께 지운다
 * @param id - 지울 프로젝트의 id
 */
export async function deleteProject(id: string): Promise<ProjectSaveStatus> {
    const previous = await projectRepository.getProject(id);
    if (!previous) {
        return PROJECT_SAVE_STATUS.NOT_FOUND;
    }
    await projectRepository.deleteProject(id);
    if (previous.image) {
        await removeImage(previous.image.src);
    }
    await Promise.all(toBodyImageList(previous.body).map(removeImage));
    return PROJECT_SAVE_STATUS.SAVED;
}

/**
 * 브라우저가 이미지 저장소에 썸네일을 바로 올릴 수 있게 토큰을 만든다
 * @param request - 브라우저가 보낸 요청
 * @param body - 요청의 본문
 */
export async function createProjectImageUploadToken(
    request: Request,
    body: unknown,
): Promise<ProjectImageUploadResponse> {
    return projectRepository.createImageUploadToken(request, body);
}

/**
 * 올려 두고 저장하지 않은 썸네일 파일을 지운다. 저장된 프로젝트가 썸네일이나 본문에 쓰는 파일은 지우지 않는다.
 * 그런 파일은 프로젝트를 고치거나 지울 때 함께 지운다
 * @param src - 지울 파일의 주소
 */
export async function discardProjectImage(src: unknown): Promise<ProjectSaveStatus> {
    const parsed = ProjectImageSchema.shape.src.safeParse(src);
    if (!parsed.success) {
        return PROJECT_SAVE_STATUS.INVALID;
    }
    const list = await projectRepository.getProjectList();
    const isUsed = list.some(
        (project) =>
            project.image?.src === parsed.data ||
            toBodyImageList(project.body).includes(parsed.data),
    );
    if (isUsed) {
        return PROJECT_SAVE_STATUS.INVALID;
    }
    await projectRepository.deleteImage(parsed.data);
    return PROJECT_SAVE_STATUS.SAVED;
}
