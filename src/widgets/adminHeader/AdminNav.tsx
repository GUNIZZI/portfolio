'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import NavIndicator, {
    NAV_INDICATOR_FALLBACK_CLASS,
    NAV_INDICATOR_ROOT_CLASS,
} from '@/shared/ui/navIndicator/NavIndicator';
import { cn } from '@/shared/util/cn';
import { ADMIN_NAV_ITEMS } from '@/config/nav';

/**
 * 관리 화면의 메뉴 4개. 지금 주소가 속한 메뉴를 강조하고, 밑줄 하나가 그 메뉴로 옮겨 간다.
 * 머리는 레이아웃에 있어 화면을 옮겨도 다시 그려지지 않으므로, 주소는 여기서 직접 읽는다.
 */
export default function AdminNav() {
    const pathname = usePathname();
    const currentHref =
        ADMIN_NAV_ITEMS.find(
            // 등록 · 수정처럼 메뉴에 없는 화면은 주소가 메뉴의 주소로 시작한다
            (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
        )?.href ?? null;

    return (
        <nav
            aria-label="관리 메뉴"
            // 좁은 화면에서는 메뉴만 아랫줄로 내려 고르게 벌려 놓는다. 윗줄에는 로고와 사이트 보기 · 로그아웃이 남는다
            className={cn(
                NAV_INDICATOR_ROOT_CLASS,
                'order-last flex w-full items-center justify-evenly gap-x-6 text-sm font-medium',
                'md:order-0 md:w-auto md:justify-start',
            )}
        >
            {ADMIN_NAV_ITEMS.map((item) => {
                const isCurrent = item.href === currentHref;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={cn(
                            // 배치와 모양. 아래 여백에 밑줄 자리를 미리 잡아 강조가 옮겨 가도 높이가 변하지 않는다
                            'pt-2 pb-2.5',
                            // 글자
                            'text-muted-foreground hover:text-strong',
                            // 상태
                            isCurrent && 'text-primary hover:text-primary',
                            isCurrent && NAV_INDICATOR_FALLBACK_CLASS,
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
            <NavIndicator activeKey={currentHref} />
        </nav>
    );
}
