import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/util/cn';

/** 로고의 높이. 폭은 그림의 비율(1312:364)을 따른다 */
const LOGO_SIZE_CLASS = {
    /** 28px */
    sm: 'h-7',
    /** 40px. 헤더와 푸터 */
    md: 'h-10',
    /** 48px */
    lg: 'h-12',
} as const;

/** 테마별 그림. 다크는 흰 글자, 라이트는 짙은 글자다 */
const LOGO_IMAGES = [
    { src: '/images/logo/logo.svg', className: 'theme-light:hidden' },
    { src: '/images/logo/logo-light.svg', className: 'hidden theme-light:block' },
] as const;

interface OwnProps {
    /** 링크의 이름에 쓴다. 로고 그림 안의 글자는 스크린 리더가 읽지 못한다 */
    name: string;
    /** 누르면 가는 곳. 홈에서는 페이지 맨 위(#top), 다른 페이지에서는 홈(/) */
    href?: string;
    /** 로고의 높이 단계 */
    size?: keyof typeof LOGO_SIZE_CLASS;
}

/**
 * 가로형 로고. G 심볼 · 이름 · 직함이 그림 한 장(public/images/logo/)에 들어 있다.
 * 헤더와 푸터가 함께 쓴다.
 */
export default function Logo({ name, href = '#top', size = 'md' }: OwnProps) {
    // 글자색이 그림에 박혀 있어 테마마다 그림을 따로 둔다. 둘 다 그려 두고 CSS 로 하나만 보인다
    const image = LOGO_IMAGES.map((logo) => (
        // SVG 는 이미지 최적화를 거치지 않는다. 벡터라 크기를 줄여 내려 줄 것이 없다
        <Image
            key={logo.src}
            src={logo.src}
            alt=""
            width={144}
            height={40}
            unoptimized
            loading="eager"
            className={cn(LOGO_SIZE_CLASS[size], 'w-auto', logo.className)}
        />
    ));
    const label = `${name} 홈으로`;
    const className = 'flex shrink-0 items-center';

    // 같은 페이지 안의 이동은 a, 다른 페이지로 가는 이동은 Link 를 쓴다
    if (href.startsWith('#')) {
        return (
            <a href={href} aria-label={label} className={className}>
                {image}
            </a>
        );
    }
    return (
        <Link href={href} aria-label={label} className={className}>
            {image}
        </Link>
    );
}
