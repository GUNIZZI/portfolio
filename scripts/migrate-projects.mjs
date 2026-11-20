/*
 * 기존 프로젝트를 저장소로 한 번 옮기는 스크립트.(docs/plan/admin/README.md 「기존 프로젝트 이전」)
 * 실행: node --env-file=.env.local scripts/migrate-projects.mjs [--run]
 * --run 이 없으면 무엇을 할지만 적는다.
 *
 * - content/projects.ts 의 프로젝트를 Firestore 의 projects 컬렉션에 등록한다. 모두 공개 · 홈 노출이다
 * - public/images/projects 의 썸네일을 이미지 저장소(Vercel Blob)에 올린다
 * - 경력의 프로젝트 연결에 projectId 를 더한다. workSlug 는 남긴다. 배포된 옛 코드가 그 값을 읽는다
 */
import { readFile } from 'node:fs/promises';
import { put } from '@vercel/blob';
import { cert, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

import { PROJECTS } from '../content/projects.ts';

const isRun = process.argv.includes('--run');

/** 진행 상황을 터미널에 적는다 */
function log(...parts) {
    process.stdout.write(`${parts.map(String).join(' ')}\n`);
}

initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replaceAll('\\n', '\n'),
    }),
});
const db = getFirestore();

const existing = await db.collection('projects').get();
if (!existing.empty) {
    console.error(`projects 컬렉션에 이미 ${existing.size}건이 있다. 옮기지 않는다.`);
    process.exit(1);
}

/** slug → 발급한 id */
const idBySlug = new Map();

for (const [order, project] of PROJECTS.entries()) {
    const { slug, image, ...rest } = project;
    let savedImage = null;
    if (image) {
        const fileName = image.src.split('/').pop();
        if (isRun) {
            const file = await readFile(`public${image.src}`);
            const blob = await put(`projects/${fileName}`, file, {
                access: 'public',
                addRandomSuffix: true,
            });
            savedImage = { ...image, src: blob.url };
        } else {
            savedImage = { ...image, src: `(Blob) projects/${fileName}` };
        }
    }

    const content = JSON.parse(
        JSON.stringify({ ...rest, image: savedImage, published: true, featured: true, order }),
    );
    if (isRun) {
        const now = FieldValue.serverTimestamp();
        const doc = await db
            .collection('projects')
            .add({ ...content, createdAt: now, updatedAt: now });
        idBySlug.set(slug, doc.id);
        log(`등록: ${slug} → ${doc.id} (${savedImage?.src ?? '썸네일 없음'})`);
    } else {
        idBySlug.set(slug, `(발급될 id: ${slug})`);
        log(`등록 예정: ${slug} · order ${order} · ${savedImage?.src ?? '썸네일 없음'}`);
    }
}

const experiences = await db.collection('experiences').get();
for (const doc of experiences.docs) {
    const projects = doc.get('projects') ?? [];
    let changed = 0;
    const next = projects.map((item) => {
        const projectId = item.workSlug ? idBySlug.get(item.workSlug) : undefined;
        if (!projectId || item.projectId) return item;
        changed += 1;
        return { ...item, projectId };
    });
    if (changed === 0) continue;
    log(`경력 ${doc.get('company')}: 연결 ${changed}건${isRun ? ' 바꿈' : ' 바꿀 예정'}`);
    // 저장 시각은 건드리지 않는다. 내용을 고친 것이 아니다
    if (isRun) await doc.ref.update({ projects: next });
}

const orphan = experiences.docs.flatMap((doc) =>
    (doc.get('projects') ?? [])
        .filter((item) => item.workSlug && !idBySlug.has(item.workSlug))
        .map((item) => `${doc.get('company')} / ${item.name} (${item.workSlug})`),
);
if (orphan.length > 0) log('옮길 프로젝트가 없는 연결:', orphan.join(', '));

log(isRun ? '끝.' : '미리보기다. --run 을 붙이면 실행한다.');
