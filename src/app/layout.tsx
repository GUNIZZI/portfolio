import '@/style/global.css';

import type { Metadata, Viewport } from 'next';
import { Caveat, Noto_Sans_KR, Permanent_Marker } from 'next/font/google';

import Providers from '@/_app/Providers';
import { cn } from '@/shared/util/cn';
import { SITE } from '@/config/site';

// 서체 선택의 근거는 docs/design.md 2절이 갖는다
const notoSansKr = Noto_Sans_KR({
    variable: '--font-noto-sans-kr',
    subsets: ['latin'],
    display: 'swap',
});
const permanentMarker = Permanent_Marker({
    variable: '--font-permanent-marker',
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});
const caveat = Caveat({
    variable: '--font-caveat',
    weight: '700',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: { default: SITE.title, template: `%s — ${SITE.name}` },
    description: SITE.description,
    openGraph: { type: 'website', locale: SITE.locale, siteName: SITE.name },
};

export const viewport: Viewport = {
    colorScheme: 'dark',
    // 브라우저 주소창 색. meta 태그라 CSS 변수를 읽지 못해 토큰 --background 의 값을 그대로 적는다
    themeColor: '#0a0a12',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html
            lang="ko"
            // global.css 가 html 에 scroll-behavior: smooth 를 준다. 이 속성이 있어야 Next 가 페이지를 옮길 때만
            // 부드러운 스크롤을 잠깐 꺼서, 새 페이지가 맨 위에서 바로 열린다. 같은 페이지 안의 이동은 그대로 부드럽다
            data-scroll-behavior="smooth"
            className={cn(notoSansKr.variable, permanentMarker.variable, caveat.variable)}
        >
            {/*
              브라우저 확장 프로그램이 body 에 속성을 덧붙이면(ColorZilla 의 cz-shortcut-listen 등)
              서버가 그린 HTML 과 달라져 개발 중에 하이드레이션 경고가 뜬다. body 한 요소의 속성 차이만 넘긴다.
              자식 요소의 불일치는 그대로 경고한다
            */}
            <body className="min-h-dvh" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
