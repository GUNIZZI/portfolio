import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui/button/button';
import { cn } from '@/shared/util/cn';

interface OwnProps {
    /** 줄의 이름. 버튼의 이름 앞에 붙여 어느 줄의 버튼인지 알린다(1단계 위로) */
    name: string;
    index: number;
    /** 목록의 지금 개수 */
    count: number;
    /** 남겨야 하는 최소 개수. 이만큼만 남으면 빼기를 누를 수 없다 */
    min: number;
    /** 줄을 옮긴다. to 는 옮겨 갈 자리다 */
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
    className?: string;
}

const ICON_BUTTON_CLASS = 'flex w-6.5 items-center justify-center p-0';

/** 목록의 줄 하나에 붙는 위 · 아래 · 빼기 버튼. 첫 줄의 위와 끝 줄의 아래는 누를 수 없다 */
export default function RowActions({
    name,
    index,
    count,
    min,
    onMove,
    onRemove,
    className,
}: OwnProps) {
    function hndlUp() {
        onMove(index, index - 1);
    }

    function hndlDown() {
        onMove(index, index + 1);
    }

    function hndlRemove() {
        onRemove(index);
    }

    return (
        <div className={cn('flex shrink-0 gap-1', className)}>
            <Button
                variant="secondary"
                size="2xs"
                aria-label={`${name} 위로`}
                disabled={index === 0}
                onClick={hndlUp}
                className={ICON_BUTTON_CLASS}
            >
                <ArrowUp className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
                variant="secondary"
                size="2xs"
                aria-label={`${name} 아래로`}
                disabled={index === count - 1}
                onClick={hndlDown}
                className={ICON_BUTTON_CLASS}
            >
                <ArrowDown className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
                variant="destructive"
                size="2xs"
                aria-label={`${name} 빼기`}
                disabled={count <= min}
                onClick={hndlRemove}
                className={ICON_BUTTON_CLASS}
            >
                <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
        </div>
    );
}
