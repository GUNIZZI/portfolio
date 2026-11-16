import type { ReactNode } from 'react';
import Link from 'next/link';

/** 페이지 맨 위. 페이지마다 바깥 틀에 이 id 가 있다 */
const TOP_HREF = '#top';

interface OwnProps {
    href: string;
    /** 지금 있는 페이지의 메뉴인가 */
    isCurrent: boolean;
    className: string;
    children: ReactNode;
}

/**
 * 메뉴 항목 하나. 다른 페이지로는 Link 로 간다.
 * 지금 있는 페이지의 메뉴를 누르면 다시 불러오지 않고 맨 위로 올라간다
 */
export default function NavLink({ href, isCurrent, className, children }: OwnProps) {
    if (isCurrent) {
        return (
            <a href={TOP_HREF} aria-current="page" className={className}>
                {children}
            </a>
        );
    }
    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}
