import 'server-only';

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';

import { getServerEnv } from './serverEnv';

/**
 * Firebase Admin 의 Auth 를 돌려준다.
 * 앱은 한 번만 만든다. 개발 서버가 모듈을 다시 불러와도 이미 만든 앱을 그대로 쓴다.
 */
export function getFirebaseAuth(): Auth {
    const [app] = getApps();
    if (app) {
        return getAuth(app);
    }

    const env = getServerEnv();
    return getAuth(
        initializeApp({
            credential: cert({
                projectId: env.FIREBASE_PROJECT_ID,
                clientEmail: env.FIREBASE_CLIENT_EMAIL,
                privateKey: env.FIREBASE_PRIVATE_KEY,
            }),
        }),
    );
}
