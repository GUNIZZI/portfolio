import type { Metadata } from 'next';

import { Backdrop } from '@/widgets/backdrop';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

export const metadata: Metadata = { title: '작업' };

/** 연락 섹션이 없는 페이지라 Contact 는 홈의 연락 섹션으로 간다 */
const CONTACT_HREF = '/#contact';

export default function WorkPage() {
    return (
        <div id="top" className="relative min-h-dvh overflow-x-clip">
            <Backdrop />
            <div className="relative z-raised flex min-h-dvh flex-col">
                <Header currentHref="/work" contactHref={CONTACT_HREF} />
                <main className="mx-auto w-full max-w-page flex-1 px-gutter py-10">
                    <h1 className="text-section font-bold text-strong">작업</h1>
                </main>
                <Footer contactHref={CONTACT_HREF} />
            </div>
        </div>
    );
}
