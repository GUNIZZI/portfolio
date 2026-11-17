import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminHeader } from '@/widgets/adminHeader';
import { AboutEditor, AboutEditorError } from '@/features/aboutEditor';
import { AdminGuard } from '@/features/adminAuth';
import type { AboutEditorData } from '@/entities/about/model/about.types';
import { getAboutEditor } from '@/entities/about/services/about.services';

export const metadata: Metadata = { title: '소개 관리' };

/** 읽지 못하면 null 을 낸다. 화면은 오류 상태를 그린다 */
async function loadAboutEditor(): Promise<AboutEditorData | null> {
    try {
        return await getAboutEditor();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function AdminAboutPage() {
    const data = await loadAboutEditor();

    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <AdminHeader currentHref="/admin/about" />
                <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
                    <div>
                        <h1 className="text-section font-bold text-strong">소개</h1>
                        <p className="mt-1 text-body text-muted-foreground">
                            소개 페이지와 홈의 소개 섹션에 보이는 내용을 고친다
                        </p>
                    </div>
                    {data ? (
                        <AboutEditor data={data} />
                    ) : (
                        <AboutEditorError retryHref="/admin/about" />
                    )}
                </main>
            </AdminGuard>
        </Suspense>
    );
}
