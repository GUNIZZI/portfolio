import type { Metadata } from 'next';

import SiteAnalytics from '@/_app/SiteAnalytics';

export const metadata: Metadata = { title: '이 사이트는 이렇게' };

export default function ColophonPage() {
    return (
        <>
            <main className="mx-auto max-w-page px-gutter py-10">
                <h1 className="text-section font-bold text-strong">이 사이트는 이렇게</h1>
            </main>
            {/* 이 페이지는 (site) 레이아웃 밖에 있어 추적 코드를 따로 둔다 */}
            <SiteAnalytics />
        </>
    );
}
