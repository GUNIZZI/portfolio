'use server';

import { updateTag } from 'next/cache';

import { requireSession } from '@/entities/session/services/session.services';

import { toAnalyticsCacheTag } from '../model/analytics.constants';
import { ANALYTICS_REFRESH_STATUS, type AnalyticsRefreshStatus } from '../model/analytics.types';
import { checkAnalyticsRefresh, parseAnalyticsPeriodDays } from '../services/analytics.services';

/**
 * 고른 기간의 통계를 다시 받게 한다. 세션을 검사하고, GA 에 닿을 때만 그 기간의 캐시를 지운다
 * @param days - 화면이 보낸 기간. 서버에서 다시 읽으므로 타입을 믿지 않는다
 */
export async function refreshAnalyticsAction(days: unknown): Promise<AnalyticsRefreshStatus> {
    await requireSession();

    const period = parseAnalyticsPeriodDays(typeof days === 'number' ? String(days) : undefined);
    const status = await checkAnalyticsRefresh(period);
    if (status === ANALYTICS_REFRESH_STATUS.REFRESHED) {
        updateTag(toAnalyticsCacheTag(period));
    }
    return status;
}
