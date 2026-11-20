'use client';

import { Backdrop } from '@/widgets/backdrop';
import { Contact } from '@/widgets/contact';
import { Footer } from '@/widgets/footer';
import { ServerError } from '@/features/statusScreen';

interface OwnProps {
    error: unknown;
    /** 에러가 난 구간을 다시 불러와 그린다 (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md) */
    retry: () => void;
}

/**
 * 공개 화면의 페이지를 그리다 에러가 났을 때 보이는 화면. (site) 레이아웃 안에 그려져 헤더는 그대로 남는다.
 * (site) 밖의 페이지는 `app/error.tsx` 가, 루트 레이아웃은 `app/global-error.tsx` 가 받는다.
 * 일부만 대신 그리려면 그 부분을 `shared/ui/errorBoundary` 로 감싼다
 */
export default function SiteError({ retry }: OwnProps) {
    return (
        <>
            <Backdrop />
            <div className="relative z-raised flex flex-1 flex-col">
                <main className="flex-1">
                    <ServerError onRetry={retry} />
                    <Contact />
                </main>
                <Footer />
            </div>
        </>
    );
}
