'use client';

import { useState } from 'react';

import { motion, type Variants } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/shared/util/cn';
import { DURATION, EASE } from '@/style/tokens/motion';

/** 새 아이콘이 아래에서 올라오며 나타난다 */
const fadeSlideUpVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    shown: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.enter } },
};

interface OwnProps {
    /**
     * 테마를 바꿀 때의 연출. 기본은 fadeSlideUp 이다.
     * none 이면 아이콘이 바로 바뀐다. 연출을 두지 않는 관리 화면이 쓴다
     */
    effect?: 'fadeSlideUp' | 'none';
    className?: string;
}

/**
 * 다크 · 라이트를 바꾸는 버튼. 지금 테마가 아닌 쪽의 아이콘을 보여 준다(다크에서는 해, 라이트에서는 달).
 * 고른 테마는 next-themes 가 localStorage 에 저장한다 (src/_app/Providers.tsx).
 *
 * 아이콘은 둘 다 그려 두고 CSS 로 하나만 보인다.
 * 서버는 방문자가 고른 테마를 알지 못한다. 테마를 읽어 아이콘을 고르면 서버가 그린 HTML 과 달라진다
 */
export default function ThemeToggle({ effect = 'fadeSlideUp', className }: OwnProps) {
    const { resolvedTheme, setTheme } = useTheme();
    /** 누른 횟수. 누를 때마다 아이콘을 새로 그려 연출을 다시 실행한다 */
    const [switchCount, setSwitchCount] = useState(0);

    function hndlClick() {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
        setSwitchCount((count) => count + 1);
    }

    const icons = (
        <>
            <Sun aria-hidden="true" className="size-4 theme-light:hidden" />
            <Moon aria-hidden="true" className="hidden size-4 theme-light:block" />
        </>
    );

    return (
        <button
            type="button"
            aria-label="테마 바꾸기"
            title="테마 바꾸기"
            onClick={hndlClick}
            className={cn(
                'flex cursor-pointer items-center justify-center text-muted-foreground hover:text-strong',
                className,
            )}
        >
            {effect === 'none' ? (
                icons
            ) : (
                <motion.span
                    key={switchCount}
                    variants={fadeSlideUpVariants}
                    // 페이지를 처음 그릴 때는 움직이지 않는다. 누른 뒤에만 실행한다
                    initial={switchCount === 0 ? false : 'hidden'}
                    animate="shown"
                    className="flex"
                >
                    {icons}
                </motion.span>
            )}
        </button>
    );
}
