import { Button } from '@/shared/ui/button/button';
import Panel from '@/shared/ui/panel/Panel';

import { DASHBOARD_MESSAGE } from '../model/dashboard.constants';

interface OwnProps {
    /** 다시 시도할 때 여는 주소. 지금 기간의 대시보드다 */
    retryHref: string;
}

/** GA 에 연결하지 못했을 때(S-03). 블록 대신 그린다. 메뉴와 다른 관리 화면은 그대로 쓸 수 있다 */
export default function DashboardError({ retryHref }: OwnProps) {
    return (
        <Panel role="alert" className="flex flex-col items-start gap-4 p-6">
            <div>
                <p className="text-lead font-bold text-strong">
                    {DASHBOARD_MESSAGE.LOAD_FAILED_TITLE}
                </p>
                <p className="mt-1 text-body text-muted-foreground">
                    {DASHBOARD_MESSAGE.LOAD_FAILED_DESCRIPTION}
                </p>
            </div>
            <Button asChild variant="outline" size="sm" className="items-center">
                <a href={retryHref}>다시 시도</a>
            </Button>
        </Panel>
    );
}
