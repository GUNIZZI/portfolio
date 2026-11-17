import Link from 'next/link';

import { LogoutButton } from '@/features/adminAuth';
import Logo from '@/shared/ui/logo/Logo';
import { cn } from '@/shared/util/cn';
import { ADMIN_NAV_ITEMS, type AdminNavHref } from '@/config/nav';
import { SITE } from '@/config/site';

interface OwnProps {
    /**
     * 이 페이지의 메뉴. 강조해서 보여 준다.
     * 등록 · 수정처럼 메뉴에 없는 페이지는 자기가 속한 메뉴를 알려 준다
     */
    currentHref: AdminNavHref;
}

/**
 * 관리 화면의 머리. 로그인을 뺀 모든 관리 화면에 같은 모양으로 붙는다.
 * 로고 · 메뉴 4개 · 사이트 보기 · 로그아웃이 있다. 연출은 두지 않는다.
 */
export default function AdminHeader({ currentHref }: OwnProps) {
    return (
        <header className="border-b border-line bg-panel">
            <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-8 gap-y-3 px-gutter py-4">
                <Logo name={SITE.name} href={ADMIN_NAV_ITEMS[0].href} />
                <nav
                    aria-label="관리 메뉴"
                    className="flex items-center gap-x-6 text-sm font-medium"
                >
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const isCurrent = item.href === currentHref;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={cn(
                                    // 배치와 모양. 밑줄 자리를 미리 잡아 강조가 옮겨 가도 높이가 변하지 않는다
                                    'border-b-2 border-transparent py-2',
                                    // 글자
                                    'text-muted hover:text-strong',
                                    // 상태
                                    isCurrent && 'border-accent text-accent hover:text-accent',
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="ml-auto flex items-center gap-x-5">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted hover:text-strong"
                    >
                        사이트 보기
                        <span aria-hidden="true"> ↗</span>
                        <span className="sr-only"> (새 탭)</span>
                    </a>
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}
