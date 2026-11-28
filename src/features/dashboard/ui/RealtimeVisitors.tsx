import type { AnalyticsRealtimeData } from '@/entities/analytics/model/analytics.types';
import { getAnalyticsRealtime } from '@/entities/analytics/services/analytics.services';

import { DASHBOARD_MESSAGE } from '../model/dashboard.constants';

/** 받지 못하면 null 을 낸다. 화면은 이 줄만 오류로 그린다 */
async function loadRealtime(): Promise<AnalyticsRealtimeData | null> {
    try {
        return await getAnalyticsRealtime();
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * 지금 접속자. 최근 30분에 사이트를 본 사람 수를 한 줄로 적는다. 기간과 상관없다.
 * 간직하지 않아 화면을 열 때마다 받는다. 접속자가 없으면 0명으로 적는다.
 * (docs/plan/admin/dashboard/README.md 「블록별 규칙」 · 「갱신」)
 */
export default async function RealtimeVisitors() {
    const realtime = await loadRealtime();
    if (!realtime) {
        return (
            <p role="alert" className="text-caption text-muted-foreground">
                {DASHBOARD_MESSAGE.BLOCK_FAILED}
            </p>
        );
    }

    return (
        <p className="flex flex-wrap items-baseline gap-2 text-caption text-muted-foreground">
            <span className="text-body font-semibold text-strong tabular-nums">
                최근 30분 방문자 {realtime.activeUsers.toLocaleString('ko-KR')}명
            </span>
        </p>
    );
}
