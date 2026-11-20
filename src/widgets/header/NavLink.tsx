import type { ReactNode } from 'react';
import Link from 'next/link';

/** 페이지 맨 위. 레이아웃의 바깥 틀에 이 id 가 있다 (src/app/(site)/layout.tsx) */
const TOP_HREF = '#top';

interface OwnProps {
    href: string;
    /** 지금 있는 페이지가 속한 메뉴인가. 강조하는 메뉴다 */
    isCurrent: boolean;
    /** 지금 주소가 이 메뉴의 주소와 같은가. 작업 상세는 Projects 에 속하지만 주소는 다르다 */
    isSamePage: boolean;
    className: string;
    children: ReactNode;
}

/**
 * 메뉴 항목 하나. 다른 페이지로는 Link 로 간다.
 * 메뉴의 주소에 이미 있을 때 누르면 다시 불러오지 않고 맨 위로 올라간다.
 * 작업 상세에서 Projects 를 누르면 강조된 메뉴여도 목록의 맨 위로 간다.(2026-11-20 사용자 결정)
 */
export default function NavLink({ href, isCurrent, isSamePage, className, children }: OwnProps) {
    if (isSamePage) {
        return (
            <a href={TOP_HREF} aria-current="page" className={className}>
                {children}
            </a>
        );
    }
    return (
        // 밑줄은 aria-current="page" 인 링크를 찾아 자리를 잡는다 (src/shared/ui/navIndicator/NavIndicator.tsx)
        <Link href={href} aria-current={isCurrent ? 'page' : undefined} className={className}>
            {children}
        </Link>
    );
}
