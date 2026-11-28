import {
    COLOPHON_ROLE_NAME,
    type ColophonRole,
} from '@/entities/colophon/model/colophon.constants';
import { cn } from '@/shared/util/cn';

import { COLOPHON_ROLE_DOT_CLASS } from '../model/colophon.constants';

interface OwnProps {
    role: ColophonRole;
}

/** 그 일을 한 쪽을 적는 표시. 점의 색은 장식이고, 누구인지는 글자가 알린다 */
export default function RoleBadge({ role }: OwnProps) {
    return (
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-chip px-2.5 py-1 text-2xs font-semibold text-foreground">
            <span
                aria-hidden="true"
                className={cn('size-1.5 rounded-full', COLOPHON_ROLE_DOT_CLASS[role])}
            />
            {COLOPHON_ROLE_NAME[role]}
        </span>
    );
}
