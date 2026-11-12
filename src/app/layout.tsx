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
    <html lang="ko" className={cn(notoSansKr.variable, permanentMarker.variable, caveat.variable)}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
