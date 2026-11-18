import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AdminGuard } from '@/features/adminAuth';
import { ExperienceError, ExperienceList } from '@/features/experienceEditor';
import type { ExperienceRowData } from '@/entities/experience/model/experience.types';
import { getExperienceRowList } from '@/entities/experience/services/experience.services';

export const metadata: Metadata = { title: '경력 관리' };

/** 읽지 못하면 null 을 낸다. 화면은 오류 상태를 그린다 */
async function loadExperienceRowList(): Promise<ExperienceRowData[] | null> {
    try {
        return await getExperienceRowList();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function AdminExperienceListPage() {
    const experiences = await loadExperienceRowList();

    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
                    <div>
                        <h1 className="text-section font-bold text-strong">경력</h1>
                        <p className="mt-1 text-body text-muted-foreground">
                            소개 페이지의 경력 타임라인을 관리한다
                        </p>
                    </div>
                    {experiences ? (
                        <ExperienceList experiences={experiences} />
                    ) : (
                        <ExperienceError retryHref="/admin/experiences" />
                    )}
                </main>
            </AdminGuard>
        </Suspense>
    );
}
