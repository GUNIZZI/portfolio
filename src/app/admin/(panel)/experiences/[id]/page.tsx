import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AdminGuard } from '@/features/adminAuth';
import { ExperienceError, ExperienceForm } from '@/features/experienceEditor';
import type { ExperienceEditorData } from '@/entities/experience/model/experience.types';
import { getExperienceEditor } from '@/entities/experience/services/experience.services';
import { getProjectList } from '@/entities/project/services/project.services';

export const metadata: Metadata = { title: '경력 수정' };

const LOAD_FAILED = 'LOAD_FAILED';

/** 읽지 못하면 LOAD_FAILED 를, 그 id 의 경력이 없으면 null 을 낸다 */
async function loadExperienceEditor(
    id: string,
): Promise<ExperienceEditorData | typeof LOAD_FAILED | null> {
    try {
        return await getExperienceEditor(id);
    } catch (error) {
        console.error(error);
        return LOAD_FAILED;
    }
}

/**
 * 주소의 id 를 읽는 부분. params 는 요청마다 달라 Suspense 안에서 읽는다.
 * 세션을 먼저 검사한다. 로그인하지 않은 사람에게는 그 id 의 경력이 있는지도 알리지 않는다
 */
async function ExperienceEditContent({
    params,
}: Pick<PageProps<'/admin/experiences/[id]'>, 'params'>) {
    const { id } = await params;
    const [experience, projects] = await Promise.all([loadExperienceEditor(id), getProjectList()]);
    if (!experience) notFound();

    return (
        <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
            <div>
                <h1 className="text-section font-bold text-strong">경력 수정</h1>
                <p className="mt-1 text-body text-muted-foreground">
                    회사와 그 회사에서 한 프로젝트를 고친다
                </p>
            </div>
            {experience === LOAD_FAILED ? (
                <ExperienceError retryHref={`/admin/experiences/${id}`} />
            ) : (
                <ExperienceForm
                    experience={experience}
                    projects={projects.map(({ slug, title }) => ({ slug, title }))}
                />
            )}
        </main>
    );
}

export default function AdminExperienceEditPage({ params }: PageProps<'/admin/experiences/[id]'>) {
    return (
        <Suspense fallback={null}>
            <AdminGuard>
                <ExperienceEditContent params={params} />
            </AdminGuard>
        </Suspense>
    );
}
