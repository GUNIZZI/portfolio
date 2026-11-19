'use client';

import { type MouseEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { LockKeyhole } from 'lucide-react';

import Icon from '@/shared/ui/icon/Icon';
import Logo from '@/shared/ui/logo/Logo';
import NavIndicator, {
    NAV_INDICATOR_FALLBACK_CLASS,
    NAV_INDICATOR_ROOT_CLASS,
} from '@/shared/ui/navIndicator/NavIndicator';
import ThemeToggle from '@/shared/ui/themeToggle/ThemeToggle';
import { cn } from '@/shared/util/cn';
import { findNavHref, NAV_ITEMS } from '@/config/nav';

import { glassVariants, menuContentVariants } from './model/header.motions';
import NavLink from './NavLink';

/** 페이지 맨 위. 레이아웃의 바깥 틀에 이 id 가 있다 (src/app/(site)/layout.tsx) */
const TOP_HREF = '#top';

/** 관리 화면의 입구. 세션에 따라 로그인이나 대시보드로 보낸다 (src/app/admin/page.tsx) */
const ADMIN_HREF = '/admin';

/** 헤더에 메뉴를 펼쳐 놓는 폭. Tailwind 의 md 경계(48rem)와 같아야 한다 */
const WIDE_QUERY = '(min-width: 48rem)';

/** 반투명 바탕과 뒤 화면 흐림. 헤더 막대와 모바일 메뉴 패널이 함께 쓴다 */
const GLASS_CLASS = 'bg-glass backdrop-blur-xs';

interface OwnProps {
    /** 로고 링크의 이름에 쓴다 */
    name: string;
    action: ReactNode;
}

/**
 * 헤더의 움직이는 부분.
 * 항상 화면 위에 붙어 있고, 지금 있는 페이지의 메뉴를 강조한다.
 * 레이아웃에 있어 페이지를 옮겨도 다시 그려지지 않으므로, 지금 메뉴는 주소에서 직접 읽는다.
 * 좁은 화면에서는 메뉴와 action 을 버튼으로 여닫는 패널에 둔다.
 */
export default function HeaderBar({ name, action }: OwnProps) {
    const currentHref = findNavHref(usePathname());
    const headerRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    /** 패널에서 고른 섹션. 패널이 다 닫힌 뒤에 이동한다 */
    const pendingHrefRef = useRef<string | null>(null);
    const panelId = useId();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 맨 위에서는 바탕 없이 두고, 스크롤을 시작하면 반투명 바탕을 깐다
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 0);
    });
    // 패널이 열리면 맨 위에서도 바탕을 깐다. 막대만 비어 있으면 패널과 끊겨 보인다
    const hasGlass = isScrolled || isMenuOpen;

    // 붙은 헤더가 섹션 제목을 가리지 않게 헤더 높이를 알린다. 섹션의 scroll-mt-header 가 읽는다
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const root = document.documentElement;
        const observer = new ResizeObserver(() => {
            root.style.setProperty('--header-height', `${header.offsetHeight}px`);
        });
        observer.observe(header);

        return () => {
            observer.disconnect();
            root.style.removeProperty('--header-height');
        };
    }, []);

    // 열린 패널은 Esc 와 화면이 넓어짐으로 닫힌다. 패널이 화면을 다 덮어 밖을 누를 자리는 없다
    useEffect(() => {
        if (!isMenuOpen) return;

        function hndlKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;
            setIsMenuOpen(false);
            menuButtonRef.current?.focus();
        }
        function hndlWiden(event: MediaQueryListEvent) {
            if (event.matches) setIsMenuOpen(false);
        }

        const wide = window.matchMedia(WIDE_QUERY);
        document.addEventListener('keydown', hndlKeyDown);
        wide.addEventListener('change', hndlWiden);

        return () => {
            document.removeEventListener('keydown', hndlKeyDown);
            wide.removeEventListener('change', hndlWiden);
        };
    }, [isMenuOpen]);

    function hndlMenuToggle() {
        setIsMenuOpen((isOpen) => !isOpen);
    }

    /** 패널 안의 링크(메뉴 항목과 action)를 누르면 닫고 이동한다 */
    function hndlPanelClick(event: MouseEvent<HTMLElement>) {
        const link = event.target instanceof Element ? event.target.closest('a') : null;
        if (!link) return;

        const href = link.getAttribute('href');
        // 누른 링크가 스크롤 도중에 화면에서 사라지면 브라우저가 이동을 멈춘다. 패널이 닫힌 뒤에 직접 이동한다
        if (href?.startsWith('#')) {
            event.preventDefault();
            pendingHrefRef.current = href;
        }
        setIsMenuOpen(false);
    }

    function hndlPanelExitComplete() {
        const href = pendingHrefRef.current;
        if (!href) return;

        pendingHrefRef.current = null;
        history.pushState(null, '', href);
        document.getElementById(href.slice(1))?.scrollIntoView();
    }

    return (
        <header
            ref={headerRef}
            // 페이지 전환에서 헤더를 본문과 따로 찍어 제자리에 둔다. 이름은 전환하는 동안에만 붙는다 (src/style/viewTransition.css)
            data-view-transition="site-header"
            className="sticky top-0 z-header"
        >
            {/* 바탕을 header 가 아니라 막대에 준다. 흐림 효과는 겹쳐 쓸 수 없어 패널과 형제로 둔다 */}
            <div className="relative">
                {/* 바탕만 따로 깔아 패널의 바탕과 같은 값으로 드러낸다. 막대의 내용은 움직이지 않는다 */}
                <motion.div
                    aria-hidden="true"
                    variants={glassVariants}
                    initial={false}
                    animate={hasGlass ? 'shown' : 'hidden'}
                    className={cn('absolute inset-0', GLASS_CLASS)}
                />
                <div className="relative mx-auto flex max-w-page items-center justify-between gap-x-6 px-gutter py-5">
                    <Logo name={name} href={currentHref === '/' ? TOP_HREF : '/'} />
                    <nav
                        aria-label="주 메뉴"
                        className={cn(
                            NAV_INDICATOR_ROOT_CLASS,
                            'hidden items-center gap-x-[clamp(12px,3vw,36px)] text-sm font-medium md:flex',
                        )}
                    >
                        {NAV_ITEMS.map((item) => {
                            const isCurrent = item.href === currentHref;
                            return (
                                <NavLink
                                    key={item.href}
                                    href={item.href}
                                    isCurrent={isCurrent}
                                    className={cn(
                                        // 배치와 모양. 아래 여백에 밑줄 자리를 미리 잡아 강조가 옮겨 가도 높이가 변하지 않는다
                                        'pt-2 pb-2.5 font-extrabold',
                                        // 상태
                                        isCurrent && 'text-primary',
                                        isCurrent && NAV_INDICATOR_FALLBACK_CLASS,
                                        // hover 상태
                                        !isCurrent && 'hover:text-primary',
                                        // 모션
                                        'transition-colors duration-fast ease-move',
                                    )}
                                >
                                    {item.label}
                                </NavLink>
                            );
                        })}
                        <NavIndicator activeKey={currentHref} />
                    </nav>
                    {/* 넓은 화면의 순서는 Contact · 테마 · 관리, 좁은 화면은 테마 · 관리 · 메뉴 버튼이다 */}
                    <div className="relative flex items-center gap-x-1 md:gap-x-4">
                        <div className="hidden md:block">{action}</div>
                        {/*
                          테마 버튼은 좁은 화면에서도 막대에 남는다. 메뉴를 열지 않고 바꿀 수 있다.
                          본문 폭 바깥에 자리가 남는 화면에서는 Contact 오른쪽 바깥으로 내보내, Contact 가 본문의 오른쪽 끝에 맞는다
                        */}
                        <div className="flex items-center xl:absolute xl:left-full">
                            <ThemeToggle className="size-7" />
                            <Link
                                href={ADMIN_HREF}
                                prefetch={false}
                                aria-label="관리 화면"
                                title="관리 화면"
                                className="flex size-7 items-center justify-center text-muted-foreground hover:text-strong"
                            >
                                <LockKeyhole aria-hidden="true" className="size-4" />
                            </Link>
                        </div>
                        <button
                            ref={menuButtonRef}
                            type="button"
                            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                            aria-expanded={isMenuOpen}
                            aria-controls={panelId}
                            onClick={hndlMenuToggle}
                            className="flex items-center justify-center text-strong md:hidden"
                        >
                            <Icon name={isMenuOpen ? 'close' : 'menu'} size={26} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence onExitComplete={hndlPanelExitComplete}>
                {isMenuOpen ? (
                    <motion.nav
                        id={panelId}
                        aria-label="주 메뉴"
                        variants={glassVariants}
                        initial="hidden"
                        animate="shown"
                        exit="hidden"
                        onClick={hndlPanelClick}
                        className={cn(
                            // 배치와 모양. 헤더 바로 아래에서 화면 끝까지 덮는다. 내용이 넘치면 패널 안에서 스크롤한다
                            'absolute inset-x-0 top-full z-overlay h-below-header overflow-y-auto px-gutter pt-2 pb-6 md:hidden',
                            GLASS_CLASS,
                            // 글자
                            'text-body font-medium',
                        )}
                    >
                        {/* 바탕은 제자리에서 드러나고 내용만 내려온다. 바탕까지 움직이면 헤더 막대와 어긋난다 */}
                        <motion.div
                            variants={menuContentVariants}
                            className="flex h-full flex-col gap-1"
                        >
                            {NAV_ITEMS.map((item) => {
                                const isCurrent = item.href === currentHref;
                                return (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        isCurrent={isCurrent}
                                        className={cn(
                                            'flex min-h-11 items-center',
                                            isCurrent && 'text-primary',
                                        )}
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                            <div className="mt-auto ml-auto flex">{action}</div>
                        </motion.div>
                    </motion.nav>
                ) : null}
            </AnimatePresence>
        </header>
    );
}
