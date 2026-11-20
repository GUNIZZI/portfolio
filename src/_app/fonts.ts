import { Caveat, Noto_Sans_KR, Permanent_Marker } from 'next/font/google';

import { cn } from '@/shared/util/cn';

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

/**
 * 서체의 CSS 변수를 정의하는 클래스. `<html>` 에 준다.
 * 루트 레이아웃과, 레이아웃을 대신 그리는 `app/global-error.tsx` 가 함께 쓴다
 */
export const FONT_CLASS = cn(notoSansKr.variable, permanentMarker.variable, caveat.variable);
