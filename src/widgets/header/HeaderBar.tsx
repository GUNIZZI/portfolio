'use client';

import { type MouseEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';

import Icon from '@/shared/ui/icon/Icon';
import Logo from '@/shared/ui/logo/Logo';
import NavIndicator, {
    NAV_INDICATOR_FALLBACK_CLASS,
    NAV_INDICATOR_ROOT_CLASS,
} from '@/shared/ui/navIndicator/NavIndicator';
import ThemeToggle from '@/shared/ui/themeToggle/ThemeToggle';
import { cn } from '@/shared/util/cn';
import { NAV_ITEMS, type NavHref } from '@/config/nav';

import { menuPanelVariants } from './model/header.motions';
import NavLink from './NavLink';

/** 페이지 맨 위. 레이아웃의 바깥 틀에 이 id 가 있다 (src/app/(site)/layout.tsx) */
const TOP_HREF = '#top';

/** 헤더에 메뉴를 펼쳐 놓는 폭. Tailwind 의 md 경계(48rem)와 같아야 한다 */
const WIDE_QUERY = '(min-width: 48rem)';

/**
 * 주소가 속한 메뉴를 찾는다. 작업 상세(/work/<slug>)는 Projects 다.
 * @returns 어느 메뉴에도 속하지 않으면 null
 */
function findCurrentHref(pathname: string): NavHref | null {
    const current = NAV_ITEMS.find((item) =>
        // 홈의 주소는 모든 주소의 앞부분이라 똑같을 때만 고른다
        item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
    return current?.href ?? null;
}

/** 반투명 바탕. 스크롤을 시작한 헤더 막대와 모바일 메뉴 패널이 함께 쓴다 */
const GLASS_CLASS = 'bg-glass backdrop-blur-md';

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
    const currentHref = findCurrentHref(usePathname());
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

    // 열린 패널은 Esc, 패널 밖 누름, 화면이 넓어짐으로 닫힌다
    useEffect(() => {
        if (!isMenuOpen) return;

        function hndlKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;
            setIsMenuOpen(false);
            menuButtonRef.current?.focus();
        }
        function hndlPointerDown(event: PointerEvent) {
            if (event.target instanceof Node && headerRef.current?.contains(event.target)) return;
            setIsMenuOpen(false);
        }
        function hndlWiden(event: MediaQueryListEvent) {
            if (event.matches) setIsMenuOpen(false);
        }

        const wide = window.matchMedia(WIDE_QUERY);
        document.addEventListener('keydown', hndlKeyDown);
        document.addEventListener('pointerdown', hndlPointerDown);
        wide.addEventListener('change', hndlWiden);

        return () => {
            document.removeEventListener('keydown', hndlKeyDown);
            document.removeEventListener('pointerdown', hndlPointerDown);
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
        <header ref={headerRef} className="sticky top-0 z-header">
            {/* 바탕을 header 가 아니라 막대에 준다. 흐림 효과는 겹쳐 쓸 수 없어 패널과 형제로 둔다 */}
            <div
                className={cn(
                    isScrolled && GLASS_CLASS,
                    'transition-colors duration-fast ease-move',
                )}
            >
                <div className="mx-auto flex max-w-page items-center justify-between gap-x-6 px-gutter py-5">
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
                    {/* 테마 버튼은 좁은 화면에서도 막대에 남는다. 메뉴를 열지 않고 바꿀 수 있다 */}
                    <div className="flex items-center gap-x-1 md:gap-x-4">
                        <ThemeToggle className="size-11" />
                        <div className="hidden md:block">{action}</div>
                        <button
                            ref={menuButtonRef}
                            type="button"
                            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                            aria-expanded={isMenuOpen}
                            aria-controls={panelId}
                            onClick={hndlMenuToggle}
                            className="flex size-11 items-center justify-center text-strong md:hidden"
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
                        variants={menuPanelVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        onClick={hndlPanelClick}
                        className={cn(
                            // 배치와 모양. 헤더 바로 아래에 화면 폭으로 펼친다
                            'absolute inset-x-0 top-full z-overlay flex flex-col gap-1 px-gutter pt-2 pb-6 md:hidden',
                            GLASS_CLASS,
                            // 글자
                            'text-body font-medium',
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
                                        'flex min-h-11 items-center',
                                        isCurrent && 'text-primary',
                                    )}
                                >
                                    {item.label}
                                </NavLink>
                            );
                        })}
                        <div className="mt-3 flex">{action}</div>
                    </motion.nav>
                ) : null}
            </AnimatePresence>
        </header>
    );
}
