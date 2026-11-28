import { Button } from '@/shared/ui/button/button';
import Panel from '@/shared/ui/panel/Panel';

import { EDITOR_MESSAGE } from '../model/colophonEditor.constants';

interface OwnProps {
    /** 다시 시도할 때 여는 주소. 이 화면의 주소다 */
    retryHref: string;
}

/** 내용을 읽지 못했을 때(S-02). 섹션을 그리지 않고 다시 시도할 길만 둔다 */
export default function ColophonEditorError({ retryHref }: OwnProps) {
    return (
        <Panel role="alert" className="flex flex-col items-start gap-4 p-6">
            <div>
                <p className="text-lead font-bold text-strong">
                    {EDITOR_MESSAGE.LOAD_FAILED_TITLE}
                </p>
                <p className="mt-1 text-body text-muted-foreground">
                    {EDITOR_MESSAGE.LOAD_FAILED_DESCRIPTION}
                </p>
            </div>
            <Button asChild variant="outline" size="sm" className="items-center">
                <a href={retryHref}>다시 시도</a>
            </Button>
        </Panel>
    );
}
