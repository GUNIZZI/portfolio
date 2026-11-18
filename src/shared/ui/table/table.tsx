import type { ComponentProps } from 'react';

import { cn } from '@/shared/util/cn';

/*
 * 표의 뼈대. shadcn 의 Table 을 Kozipsa 가 고쳐 쓰던 것을 가져왔다.(Kozipsa packages/ui 의 ui/table.tsx)
 * 구조와 이름은 그대로다. 아래 4가지만 이 사이트에 맞췄다.
 * - 색을 이 사이트의 토큰으로 바꿨다. 행의 구분선은 line 이다
 * - 색이 바뀌는 연출을 뺐다. 관리 화면에는 연출을 두지 않는다.(docs/plan/admin/README.md 「모션」)
 * - 좁은 화면에서 표를 가로로 스크롤하게 바깥 요소에 overflow-x-auto 를 줬다
 * - 머리 줄의 양 끝을 둥글렸다. 이 사이트의 면은 모서리가 둥글다.(docs/theme.md 2절)
 */

function Table({ className, ...props }: ComponentProps<'table'>) {
    return (
        <div data-slot="table-container" className="relative w-full overflow-x-auto">
            <table
                data-slot="table"
                className={cn('w-full caption-bottom text-sm', className)}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                'text-xs font-semibold',
                '[&_th]:bg-muted [&_th]:py-3 [&_th]:text-muted-foreground',
                // 머리 줄의 양 끝을 둥글린다
                '[&_th:first-child]:rounded-l-lg [&_th:last-child]:rounded-r-lg',
                className,
            )}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
    return (
        <tbody
            data-slot="table-body"
            className={cn('text-sm [&_td]:py-4 [&_tr:last-child>*]:border-b-0', className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn('border-t border-line bg-muted/50 font-medium', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'hover:bg-state-hover data-[state=selected]:bg-state-selected',
                '[&>*]:border-b [&>*]:border-line',
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-10 px-2 text-left align-middle font-semibold whitespace-nowrap',
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
    return (
        <td
            data-slot="table-cell"
            className={cn('p-2 align-middle whitespace-nowrap', className)}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
    return (
        <caption
            data-slot="table-caption"
            className={cn('mt-4 text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
