import { Button } from '@/shared/ui/button/button';

import { DASHBOARD_MESSAGE } from '../model/dashboard.constants';

interface OwnProps {
    /** 다시 시도할 때 여는 주소. 지금 기간의 대시보드다 */
    retryHref: string;
}

/**
 * 블록 하나만 받지 못했을 때(S-03). 그 블록의 자리에만 그리고 나머지 블록은 그대로 둔다.
 * 받지 못한 값은 간직하지 않아, 화면을 다시 열면 그 블록만 다시 받는다.
 */
export default function BlockError({ retryHref }: OwnProps) {
    return (
        <div role="alert" className="flex flex-col items-start gap-3">
            <p className="text-body text-muted-foreground">{DASHBOARD_MESSAGE.BLOCK_FAILED}</p>
            <Button asChild variant="outline" size="sm" className="items-center">
                <a href={retryHref}>다시 시도</a>
            </Button>
        </div>
    );
}
