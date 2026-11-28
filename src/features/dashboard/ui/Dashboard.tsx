import { Suspense } from 'react';

import {
    getAnalyticsPeriod,
    isAnalyticsConfigured,
    parseAnalyticsPeriodDays,
} from '@/entities/analytics/services/analytics.services';
import Panel from '@/shared/ui/panel/Panel';

import { DASHBOARD_MESSAGE, EXTERNAL_LINKS, toPeriodHref } from '../model/dashboard.constants';
import DashboardBlock from './DashboardBlock';
import DashboardError from './DashboardError';
import PageViews from './PageViews';
import PeriodTabs from './PeriodTabs';
import PlanViews from './PlanViews';
import ProjectViews from './ProjectViews';
import RealtimeVisitors from './RealtimeVisitors';
import RefreshButton from './RefreshButton';
import SummaryCards from './SummaryCards';
import VisitorTrend from './VisitorTrend';

interface OwnProps {
    /** 페이지의 주소 쿼리. 기간(`days`)을 읽는다 */
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * 대시보드(S-01). 사이트의 방문 통계를 읽어 요약한다. 고치는 기능은 없다.
 * 1차 블록 4개와 기획 문서별 조회수, 지금 접속자를 그린다. 블록마다 따로 받아, 하나를 받지 못해도 나머지는 그대로 그린다.
 * 주소 쿼리를 읽으므로 Suspense 안에 둔다.(docs/plan/admin/dashboard/README.md 「구성」)
 */
export default async function Dashboard({ searchParams }: OwnProps) {
    const { days: daysParam } = await searchParams;
    const days = parseAnalyticsPeriodDays(daysParam);
    const period = await getAnalyticsPeriod(days);
    const isConfigured = isAnalyticsConfigured();

    return (
        <main className="mx-auto flex max-w-page flex-col gap-8 px-gutter py-10">
            <div>
                <h1 className="text-section font-bold text-strong">대시보드</h1>
                <p className="mt-1 text-body text-muted-foreground">사이트의 방문 통계를 본다</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <PeriodTabs days={days} />
                        <p className="text-caption text-muted-foreground tabular-nums">
                            {period.rangeText}
                        </p>
                    </div>
                    {isConfigured ? (
                        <div className="flex items-center gap-3">
                            <p className="text-caption text-muted-foreground tabular-nums">
                                기준 {period.fetchedAtText}
                            </p>
                            <RefreshButton days={days} />
                        </div>
                    ) : null}
                </div>
                {isConfigured ? (
                    <Suspense
                        fallback={
                            <p role="status" className="text-caption text-muted-foreground">
                                {DASHBOARD_MESSAGE.LOADING}
                            </p>
                        }
                    >
                        <RealtimeVisitors />
                    </Suspense>
                ) : null}
                <p className="rounded-card border border-border bg-card px-4 py-3 text-caption text-muted-foreground">
                    {DASHBOARD_MESSAGE.NOTICE}
                </p>
            </div>

            {isConfigured ? (
                <>
                    <Suspense
                        fallback={
                            <Panel role="status" className="p-6 text-body text-muted-foreground">
                                {DASHBOARD_MESSAGE.LOADING}
                            </Panel>
                        }
                    >
                        <SummaryCards days={days} />
                    </Suspense>
                    <DashboardBlock title="방문자 추이" description="일별 방문자 수와 조회수">
                        <VisitorTrend days={days} />
                    </DashboardBlock>
                    <DashboardBlock title="페이지별 조회수" description="공개 페이지별 조회수">
                        <PageViews days={days} />
                    </DashboardBlock>
                    <DashboardBlock
                        title="프로젝트별 조회수"
                        description="프로젝트 상세 페이지 조회수"
                    >
                        <ProjectViews days={days} />
                    </DashboardBlock>
                    <DashboardBlock
                        title="기획 문서별 조회수"
                        description="기획 문서 뷰어에서 집계한 조회수"
                    >
                        <PlanViews days={days} />
                    </DashboardBlock>
                </>
            ) : (
                <DashboardError retryHref={toPeriodHref(days)} />
            )}

            <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground">
                <p>전송량은 Vercel 에서 본다</p>
                {EXTERNAL_LINKS.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-strong hover:underline"
                    >
                        {link.label} ↗<span className="sr-only"> (새 탭)</span>
                    </a>
                ))}
            </div>
        </main>
    );
}
