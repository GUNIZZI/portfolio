import Link from 'next/link';

import Icon from '@/shared/ui/icon/Icon';
import Logo from '@/shared/ui/logo/Logo';
import { FOOTER_NAV_ITEMS } from '@/config/nav';
import { SITE, SOCIAL_LINKS } from '@/config/site';

interface OwnProps {
    /** 홈인가. 홈에서는 로고와 Home 이 페이지 맨 위로 간다 */
    isHome?: boolean;
    /** Contact 가 가는 곳. 연락 섹션이 없는 페이지에서는 홈의 연락 섹션(/#contact)을 준다 */
    contactHref?: string;
}

const LINK_CLASS = 'py-2';

export default function Footer({ isHome = false, contactHref = '#contact' }: OwnProps) {
    return (
        <footer className="border-t border-line">
            <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-8 gap-y-5 px-gutter py-7">
                <Logo name={SITE.name} href={isHome ? '#top' : '/'} />
                <div className="flex gap-2">
                    {SOCIAL_LINKS.map((link) => {
                        // 외부 프로필은 새 탭에서 연다. mailto 는 해당하지 않는다
                        const isExternal = link.href.startsWith('http');
                        return (
                            <a
                                key={link.label}
                                href={link.href}
                                aria-label={isExternal ? `${link.label} (새 탭)` : link.label}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="flex size-11 items-center justify-center"
                            >
                                <Icon name={link.icon} />
                            </a>
                        );
                    })}
                </div>
                <nav
                    aria-label="하단 메뉴"
                    className="flex flex-wrap gap-x-[clamp(16px,3vw,40px)] gap-y-1 text-sm"
                >
                    {FOOTER_NAV_ITEMS.map((item) =>
                        // 홈에서 Home 을 누르면 다시 불러오지 않고 맨 위로 올라간다
                        isHome && item.href === '/' ? (
                            <a key={item.href} href="#top" className={LINK_CLASS}>
                                {item.label}
                            </a>
                        ) : (
                            <Link key={item.href} href={item.href} className={LINK_CLASS}>
                                {item.label}
                            </Link>
                        ),
                    )}
                    {contactHref.startsWith('#') ? (
                        <a href={contactHref} className={LINK_CLASS}>
                            Contact
                        </a>
                    ) : (
                        <Link href={contactHref} className={LINK_CLASS}>
                            Contact
                        </Link>
                    )}
                </nav>
            </div>
            <div className="mx-auto flex max-w-page flex-wrap justify-between gap-2 border-t border-line px-gutter pt-4 pb-7 text-caption text-muted">
                <span>© 2026 {SITE.name}. All rights reserved.</span>
                <span className="flex items-center gap-2">
                    Make better web, for a brighter tomorrow.
                    <Icon name="heart" size={18} className="text-strong" />
                </span>
            </div>
        </footer>
    );
}
