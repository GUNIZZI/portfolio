import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard, AdminGuardFallback } from '@/features/adminAuth';
import { ColophonEditor, ColophonEditorError } from '@/features/colophonEditor';
import type { ColophonEditorData } from '@/entities/colophon/model/colophon.types';
import { getColophonEditor } from '@/entities/colophon/services/colophon.services';

export const metadata: Metadata = { title: '제작 과정 관리' };

/** 읽지 못하면 null 을 낸다. 화면은 오류 상태를 그린다 */
async function loadColophonEditor(): Promise<ColophonEditorData | null> {
    try {
        return await getColophonEditor();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function AdminColophonPage() {
    const data = await loadColophonEditor();

    return (
        <Suspense fallback={<AdminGuardFallback />}>
            <AdminGuard>
                <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
                    <div>
                        <h1 className="text-section font-bold text-strong">제작 과정</h1>
                        <p className="mt-1 text-body text-muted-foreground">
                            「제작 과정」 페이지와 홈의 제작 과정 섹션에 보이는 내용을 고친다
                        </p>
                    </div>
                    {data ? (
                        <ColophonEditor data={data} />
                    ) : (
                        <ColophonEditorError retryHref="/admin/colophon" />
                    )}
                </main>
            </AdminGuard>
        </Suspense>
    );
}
