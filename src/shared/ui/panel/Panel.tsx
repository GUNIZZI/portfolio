import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/util/cn';

/** 섹션을 묶는 큰 면. 바탕보다 한 단 밝고 모서리가 둥글다 */
export default function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('rounded-3xl border border-border bg-panel', className)} {...rest} />;
}
