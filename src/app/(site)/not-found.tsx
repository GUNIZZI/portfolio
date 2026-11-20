import { Backdrop } from '@/widgets/backdrop';
import { Footer } from '@/widgets/footer';
import { NotFound } from '@/features/statusScreen';

/**
 * 없는 작업처럼 (site) 안의 페이지가 `notFound()` 를 불렀을 때 보이는 화면.
 * (site) 레이아웃 안에 그려져 헤더는 그대로 남는다. 없는 주소는 루트의 `app/not-found.tsx` 가 받는다.
 * 연락 섹션은 두지 않는다.(2026-11-20 사용자 결정)
 */
export default function SiteNotFound() {
    return (
        <>
            <Backdrop />
            <div className="relative z-raised flex flex-1 flex-col">
                <main className="flex-1">
                    <NotFound />
                </main>
                <Footer />
            </div>
        </>
    );
}
