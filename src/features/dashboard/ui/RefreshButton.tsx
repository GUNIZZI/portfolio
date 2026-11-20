'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { RotateCw } from 'lucide-react';

import { refreshAnalyticsAction } from '@/entities/analytics/actions/analytics.actions';
import type { AnalyticsPeriodDays } from '@/entities/analytics/model/analytics.constants';
import { ANALYTICS_REFRESH_STATUS } from '@/entities/analytics/model/analytics.types';
import { Button } from '@/shared/ui/button/button';
import { useToast } from '@/shared/ui/toast/ToastProvider';

import { DASHBOARD_MESSAGE } from '../model/dashboard.constants';

interface OwnProps {
    /** 지금 고른 기간. 이 기간의 값만 다시 받는다 */
    days: AnalyticsPeriodDays;
}

/**
 * 새로 고침 버튼. 간직한 값을 버리고 GA 에서 다시 받는다. 받는 동안에는 누른 것을 버린다.
 * 받지 못하면 간직하던 값을 그대로 두고 알린다. 결과는 토스트(role="status")로 알린다.
 * (docs/plan/admin/dashboard/README.md 「갱신」 · 「받지 못했을 때」)
 */
export default function RefreshButton({ days }: OwnProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const toast = useToast();

    function hndlRefresh() {
        startTransition(async () => {
            const status = await refreshAnalyticsAction(days);
            if (status === ANALYTICS_REFRESH_STATUS.FAILED) {
                toast.error(DASHBOARD_MESSAGE.REFRESH_FAILED_TITLE, {
                    description: DASHBOARD_MESSAGE.REFRESH_FAILED_DESCRIPTION,
                });
                return;
            }
            toast.success(DASHBOARD_MESSAGE.REFRESHED);
            router.refresh();
        });
    }

    return (
        <Button
            variant="outline"
            size="xs"
            icon={<RotateCw aria-hidden="true" />}
            isLoading={isPending}
            className="items-center"
            onClick={hndlRefresh}
        >
            새로 고침
        </Button>
    );
}
