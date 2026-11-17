import 'server-only';

import { z } from 'zod';

const ServerEnvSchema = z.object({
    FIREBASE_PROJECT_ID: z.string().min(1),
    // 서비스 계정의 주소다. 로그인에 쓰는 관리자 메일을 넣으면 Firebase 가 계정을 찾지 못한다
    FIREBASE_CLIENT_EMAIL: z.string().endsWith('.gserviceaccount.com'),
    // .env 에는 줄바꿈을 \n 글자로 적는다. 키로 쓰려면 실제 줄바꿈으로 되돌려야 한다
    FIREBASE_PRIVATE_KEY: z
        .string()
        .min(1)
        .transform((key) => key.replaceAll('\\n', '\n')),
    FIREBASE_WEB_API_KEY: z.string().min(1),
    ADMIN_UID: z.string().min(1),
});

export type ServerEnvType = z.infer<typeof ServerEnvSchema>;

let cached: ServerEnvType | null = null;

/**
 * 서버 전용 환경 변수를 검증해 돌려준다.
 * 처음 부를 때 읽는다. 모듈을 불러올 때 읽으면 환경 변수가 없는 곳에서 빌드가 실패한다.
 */
export function getServerEnv(): ServerEnvType {
    cached ??= ServerEnvSchema.parse(process.env);
    return cached;
}
