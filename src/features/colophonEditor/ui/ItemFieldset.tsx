import type { ReactNode } from 'react';

interface OwnProps {
    /** 항목의 이름. 1번째 · 2단계처럼 그 항목의 자리를 가리키는 말이다 */
    legend: string;
    /** 이름 옆에 놓는 버튼. 위 · 아래 · 빼기다 */
    actions: ReactNode;
    children: ReactNode;
}

/** 목록의 항목 하나. 이름과 버튼을 위에 놓고 그 항목의 입력을 묶는다 */
export default function ItemFieldset({ legend, actions, children }: OwnProps) {
    return (
        <fieldset className="flex min-w-0 flex-col gap-2 rounded-xl bg-card p-4">
            {/* legend 는 flex 로 버튼과 나란히 놓을 수 없다. 이름은 legend 로 읽히게 하고, 보이는 글자는 따로 둔다 */}
            <legend className="sr-only">{legend}</legend>
            <div className="flex items-center justify-between gap-2">
                <p aria-hidden="true" className="text-caption text-muted-foreground">
                    {legend}
                </p>
                {actions}
            </div>
            {children}
        </fieldset>
    );
}
