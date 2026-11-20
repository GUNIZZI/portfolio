import 'server-only';

import { del } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

import { getFirestoreDb } from '@/shared/util/firebaseAdmin';

import { PROJECT_COLLECTION, PROJECT_IMAGE } from '../model/project.constants';
import { type ProjectContentType, ProjectSchema } from '../model/project.schemas';
import type { ProjectResponse } from '../model/project.types';

/** 이미지 저장소에 바로 올릴 때 브라우저가 받는 응답. 올리는 권한이 든 토큰이다 */
export type ProjectImageUploadResponse = Awaited<ReturnType<typeof handleUpload>>;

export interface ProjectRepository {
    /**
     * 프로젝트 전체를 읽고 스키마로 검증한다
     * @returns 저장소가 주는 순서의 목록. 정렬하지 않는다
     * @throws 스키마에 맞지 않는 문서가 있을 때
     * @see {@link ProjectResponse}
     */
    getProjectList(): Promise<ProjectResponse[]>;

    /**
     * 프로젝트 1건을 읽고 스키마로 검증한다. 캐시를 거치지 않은 지금 값이다
     * @param id - 읽을 프로젝트의 id
     * @returns 그 id 의 프로젝트가 없으면 null
     */
    getProject(id: string): Promise<ProjectResponse | null>;

    /**
     * 프로젝트 1건을 등록한다. id 는 저장소가 발급하고, 등록 · 저장 시각은 서버가 기록한다
     * @param content - 스키마로 검증을 마친 내용
     * @param order - 놓을 차례
     * @returns 발급한 id
     */
    createProject(content: ProjectContentType, order: number): Promise<string>;

    /**
     * 프로젝트 1건의 내용을 바꾼다. 순서와 등록 시각은 남긴다
     * @param id - 고칠 프로젝트의 id. 저장소에 있어야 한다
     * @param content - 스키마로 검증을 마친 내용
     */
    updateProject(id: string, content: ProjectContentType): Promise<void>;

    /**
     * 프로젝트 1건의 공개 여부와 홈 노출 여부를 바꾼다
     * @param id - 고칠 프로젝트의 id. 저장소에 있어야 한다
     */
    updateProjectFlags(
        id: string,
        flags: Pick<ProjectContentType, 'published' | 'featured'>,
    ): Promise<void>;

    /**
     * 프로젝트의 순서를 한 번에 바꾼다. 저장 시각은 건드리지 않는다
     * @param ids - 놓을 차례대로 적은 id 전체. 모두 저장소에 있어야 한다
     */
    updateProjectOrder(ids: readonly string[]): Promise<void>;

    /**
     * 프로젝트 1건의 문서를 지운다. 썸네일 파일은 지우지 않는다
     * @param id - 지울 프로젝트의 id
     */
    deleteProject(id: string): Promise<void>;

    /**
     * 브라우저가 이미지 저장소에 썸네일을 바로 올릴 수 있게 토큰을 만든다. 형식과 크기의 제한을 토큰에 넣는다
     * @param request - 브라우저가 보낸 요청
     * @param body - 요청의 본문. 올릴 경로가 들어 있다
     * @throws 본문의 모양이 맞지 않을 때
     */
    createImageUploadToken(request: Request, body: unknown): Promise<ProjectImageUploadResponse>;

    /**
     * 이미지 저장소에서 썸네일 파일을 지운다
     * @param src - 지울 파일의 주소
     */
    deleteImage(src: string): Promise<void>;
}

/** 저장한 시각을 직렬화할 수 있는 문자열로 바꾼다. 캐시에는 Timestamp 를 담을 수 없다 */
function toIsoString(value: unknown): string | null {
    return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

function getCollection() {
    return getFirestoreDb().collection(PROJECT_COLLECTION);
}

function toProjectResponse(id: string, data: FirebaseFirestore.DocumentData): ProjectResponse {
    return {
        ...ProjectSchema.parse(data),
        id,
        updatedAt: toIsoString(data['updatedAt']),
    };
}

export const projectRepository: ProjectRepository = {
    async getProjectList() {
        const snapshot = await getCollection().get();
        return snapshot.docs.map((doc) => toProjectResponse(doc.id, doc.data()));
    },

    async getProject(id) {
        const snapshot = await getCollection().doc(id).get();
        const data = snapshot.data();
        return data ? toProjectResponse(snapshot.id, data) : null;
    },

    async createProject(content, order) {
        const now = FieldValue.serverTimestamp();
        const doc = await getCollection().add({
            ...content,
            order,
            createdAt: now,
            updatedAt: now,
        });
        return doc.id;
    },

    async updateProject(id, content) {
        await getCollection()
            .doc(id)
            .update({
                ...content,
                // 비운 선택 항목은 항목째로 지운다. 합쳐 쓰면 저장소에 예전 값이 남는다
                href: content.href ?? FieldValue.delete(),
                role: content.role ?? FieldValue.delete(),
                period: content.period ?? FieldValue.delete(),
                body: content.body ?? FieldValue.delete(),
                updatedAt: FieldValue.serverTimestamp(),
            });
    },

    async updateProjectFlags(id, flags) {
        await getCollection().doc(id).update({
            published: flags.published,
            featured: flags.featured,
            updatedAt: FieldValue.serverTimestamp(),
        });
    },

    async updateProjectOrder(ids) {
        const collection = getCollection();
        const batch = getFirestoreDb().batch();
        ids.forEach((id, order) => {
            batch.update(collection.doc(id), { order });
        });
        await batch.commit();
    },

    async deleteProject(id) {
        await getCollection().doc(id).delete();
    },

    createImageUploadToken(request, body) {
        return handleUpload({
            request,
            // 모양은 handleUpload 가 검사하고, 맞지 않으면 던진다
            body: body as HandleUploadBody,
            onBeforeGenerateToken: () =>
                Promise.resolve({
                    allowedContentTypes: [...PROJECT_IMAGE.CONTENT_TYPES],
                    maximumSizeInBytes: PROJECT_IMAGE.MAX_BYTES,
                    // 같은 이름의 파일을 올려도 앞의 파일을 덮지 않는다
                    addRandomSuffix: true,
                }),
        });
    },

    async deleteImage(src) {
        await del(src);
    },
};
