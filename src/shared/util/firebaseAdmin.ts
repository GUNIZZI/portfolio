import 'server-only';

import { type App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';
import { type Firestore, getFirestore } from 'firebase-admin/firestore';

import { getServerEnv } from './serverEnv';

/**
 * Firebase Admin 앱을 돌려준다.
 * 앱은 한 번만 만든다. 개발 서버가 모듈을 다시 불러와도 이미 만든 앱을 그대로 쓴다.
 */
function getFirebaseApp(): App {
    const [app] = getApps();
    if (app) {
        return app;
    }

    const env = getServerEnv();
    return initializeApp({
        credential: cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY,
        }),
    });
}

/** Firebase Admin 의 Auth 를 돌려준다. 세션 쿠키를 발급하고 검증한다 */
export function getFirebaseAuth(): Auth {
    return getAuth(getFirebaseApp());
}

/** Firestore 를 돌려준다. 서버만 읽고 쓴다. 보안 규칙은 모든 접근을 막아 둔다 */
export function getFirestoreDb(): Firestore {
    return getFirestore(getFirebaseApp());
}
