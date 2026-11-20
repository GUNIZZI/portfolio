import { type ReactNode, Suspense, useId } from 'react';

import Panel from '@/shared/ui/panel/Panel';

import { DASHBOARD_MESSAGE } from '../model/dashboard.constants';

interface OwnProps {
    title: string;
    description: string;
    /** 값을 받아 그리는 부분. 받는 동안에는 불러오는 상태를 그린다 */
    children: ReactNode;
}

/**
 * 대시보드의 블록 하나. 제목은 바로 그리고 안쪽만 따로 받아 그린다.
 * 느린 블록이 다른 블록을 막지 않는다.(docs/plan/admin/dashboard/README.md 「접근성 · 성능 고려」)
 */
export default function DashboardBlock({ title, description, children }: OwnProps) {
    const titleId = useId();

    return (
        <section aria-labelledby={titleId}>
            <Panel className="flex flex-col gap-4 p-6">
                <div>
                    <h2 id={titleId} className="text-lead font-bold text-strong">
                        {title}
                    </h2>
                    <p className="mt-1 text-caption text-muted-foreground">{description}</p>
                </div>
                <Suspense
                    fallback={
                        <p role="status" className="text-body text-muted-foreground">
                            {DASHBOARD_MESSAGE.LOADING}
                        </p>
                    }
                >
                    {children}
                </Suspense>
            </Panel>
        </section>
    );
}
