import { House } from 'lucide-react';

import { LogoutButton } from '@/features/adminAuth';
import Logo from '@/shared/ui/logo/Logo';
import ThemeToggle from '@/shared/ui/themeToggle/ThemeToggle';
import { ADMIN_NAV_ITEMS } from '@/config/nav';
import { SITE } from '@/config/site';

import AdminNav from './AdminNav';
import AdminNavProgress from './AdminNavProgress';

/**
 * 관리 화면의 머리. 로그인을 뺀 모든 관리 화면에 같은 모양으로 붙는다.
 * 레이아웃이 한 번 그리고, 화면을 옮겨도 그대로 남는다.(src/app/admin/(panel)/layout.tsx)
 * 로고 · 메뉴 5개 · 테마 버튼 · 사이트 보기 · 로그아웃이 있다. 메뉴의 밑줄이 옮겨 가는 것 말고는 연출을 두지 않는다.
 * 화면을 옮기는 동안에는 아래 테두리에 진행 선이 지나간다.
 */
export default function AdminHeader() {
    return (
        <header className="relative border-b border-line bg-panel">
            <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-10 gap-y-3 px-gutter py-4">
                <Logo name={SITE.name} href={ADMIN_NAV_ITEMS[0].href} size="md" />
                <AdminNav />
                <div className="ml-auto flex items-center gap-3">
                    <ThemeToggle effect="none" />
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-strong"
                        title="사이트 보기 (새 탭)"
                    >
                        <House className="size-4" />
                        <span className="sr-only"> (새 탭)</span>
                    </a>
                    {/* <Separator orientation="vertical" className="h-3! bg-foreground/50" /> */}
                    <LogoutButton />
                </div>
            </div>
            <AdminNavProgress />
        </header>
    );
}
