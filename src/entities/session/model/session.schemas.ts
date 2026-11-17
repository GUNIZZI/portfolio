import { z } from 'zod';

/** 로그인 폼의 입력 */
export const LoginFormSchema = z.object({
    email: z.string().trim().min(1),
    password: z.string().min(1),
});
export type LoginFormType = z.infer<typeof LoginFormSchema>;

/** Firebase Auth 가 로그인에 성공했을 때 내는 응답에서 쓰는 항목 */
export const SignInSchema = z.object({
    localId: z.string().min(1),
    idToken: z.string().min(1),
});

/** Firebase Auth 가 로그인을 거절했을 때 내는 응답 */
export const SignInErrorSchema = z.object({
    error: z.object({ message: z.string() }),
});
