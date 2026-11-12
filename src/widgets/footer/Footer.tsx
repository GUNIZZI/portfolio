import Icon from '@/shared/ui/icon/Icon';
import Logo from '@/shared/ui/logo/Logo';
import { FOOTER_NAV_ITEMS } from '@/config/nav';
import { SITE, SOCIAL_LINKS } from '@/config/site';

export default function Footer() {
    return (
        <footer className="border-t border-line">
            <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-8 gap-y-5 px-gutter py-7">
                <Logo name={SITE.name} role={SITE.role} />
                <div className="flex gap-2">
                    {SOCIAL_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            aria-label={link.label}
                            className="flex size-11 items-center justify-center"
                        >
                            <Icon name={link.icon} />
                        </a>
                    ))}
                </div>
                <nav
                    aria-label="하단 메뉴"
                    className="flex flex-wrap gap-x-[clamp(16px,3vw,40px)] gap-y-1 text-sm"
                >
                    {FOOTER_NAV_ITEMS.map((item) => (
                        <a key={item.href} href={item.href} className="py-2">
                            {item.label}
                        </a>
                    ))}
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
