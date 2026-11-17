import Link from 'next/link';

import Logo from '@/shared/ui/logo/Logo';
import Panel from '@/shared/ui/panel/Panel';
import { SITE } from '@/config/site';

import LoginForm from './LoginForm';

/** 로그인 화면(S-01). 공개 화면의 헤더와 푸터는 그리지 않는다 */
export default function AdminLogin() {
    return (
        <main className="flex min-h-dvh items-center justify-center px-gutter py-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Logo name={SITE.name} href="/" />
                </div>
                <Panel className="p-6">
                    <h1 className="mb-6 text-xl font-bold text-strong">Login</h1>
                    <LoginForm />
                </Panel>
                <Link
                    href="/"
                    className="self-center text-caption text-muted-foreground hover:text-strong"
                >
                    사이트로 돌아가기
                </Link>
            </div>
        </main>
    );
}
