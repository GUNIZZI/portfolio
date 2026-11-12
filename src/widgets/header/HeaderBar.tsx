'use client';

import { type MouseEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';

import Icon from '@/shared/ui/icon/Icon';
import { cn } from '@/shared/util/cn';
import { useSectionSpy } from '@/shared/util/useSectionSpy';
import { NAV_ITEMS } from '@/config/nav';

import { menuPanelVariants } from './model/header.motions';

const TOP_HREF = '#top';

/** 메뉴가 가리키는 섹션의 id. 페이지 맨 위(#top)는 섹션이 아니라서 뺀다 */
const SECTION_IDS = NAV_ITEMS.map((item) => item.href)
    .filter((href) => href !== TOP_HREF)
    .map((href) => href.slice(1));

/** 헤더에 메뉴를 펼쳐 놓는 폭. Tailwind 의 md 경계(48rem)와 같아야 한다 */
const WIDE_QUERY = '(min-width: 48rem)';

/** 반투명 바탕. 스크롤을 시작한 헤더 막대와 모바일 메뉴 패널이 함께 쓴다 */
const GLASS_CLASS = 'bg-glass backdrop-blur-md';

interface OwnProps {
    logo: ReactNode;
    action: ReactNode;
}

/**
 * 헤더의 움직이는 부분.
 * 항상 화면 위에 붙어 있고, 헤더 바로 아래까지 올라온 섹션의 메뉴를 강조한다.
 * 좁은 화면에서는 메뉴와 action 을 버튼으로 여닫는 패널에 둔다.
 */
export default function HeaderBar({ logo, action }: OwnProps) {
    const headerRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    /** 패널에서 고른 섹션. 패널이 다 닫힌 뒤에 이동한다 */
    const pendingHrefRef = useRef<string | null>(null);
    const panelId = useId();
    const { currentId, isPastFirst } = useSectionSpy(SECTION_IDS);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 맨 위에서는 바탕 없이 두고, 스크롤을 시작하면 반투명 바탕을 깐다
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 0);
    });

    // 히어로에서는 Home 을, 마지막 메뉴 섹션이 다 지나간 뒤에는 아무것도 강조하지 않는다
    const fallbackHref = isPastFirst ? null : TOP_HREF;
    const currentHref = currentId ? `#${currentId}` : fallbackHref;

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
                    {logo}
                    <nav
                        aria-label="주 메뉴"
                        className="hidden items-center gap-x-[clamp(12px,3vw,36px)] text-sm font-medium md:flex"
                    >
                        {NAV_ITEMS.map((item) => {
                            const isCurrent = item.href === currentHref;
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isCurrent ? 'location' : undefined}
                                    className={cn(
                                        // 배치와 모양. 밑줄 자리를 미리 잡아 강조가 옮겨 가도 높이가 변하지 않는다
                                        'border-b-2 border-transparent py-2',
                                        // 상태
                                        isCurrent && 'border-accent text-accent',
                                        // 모션
                                        'transition-colors duration-fast ease-move',
                                    )}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                    </nav>
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
                                <a
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isCurrent ? 'location' : undefined}
                                    className={cn(
                                        'flex min-h-11 items-center',
                                        isCurrent && 'text-accent',
                                    )}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                        <div className="mt-3 flex">{action}</div>
                    </motion.nav>
                ) : null}
            </AnimatePresence>
        </header>
    );
}
