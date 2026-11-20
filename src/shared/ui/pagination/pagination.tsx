'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/shared/util/cn';

import { getPageNumbers, getTotalPages } from './pagination.utils';

/*
 * 페이지 번호줄. Kozipsa 의 Pagination 을 가져왔다.(Kozipsa packages/ui 의 custom/pagination)
 * 받는 값과 번호 창이 움직이는 방식은 그대로다. 아래 3가지만 이 사이트에 맞췄다.
 * - 번호와 화살표를 주소 없는 링크(href="#") 대신 button 으로 그린다. 페이지를 옮기는 것은 바깥이라 갈 주소가 없다
 * - 색을 이 사이트의 토큰으로 바꿨다. 지금 페이지의 밑줄은 primary 다
 * - 밑줄이 바뀌는 연출을 뺐다. 관리 화면에는 연출을 두지 않는다.(docs/plan/admin/README.md 「모션」)
 */

const ARROW_CLASS = cn(
    'inline-flex h-7 cursor-pointer items-center px-1 text-strong',
    'disabled:pointer-events-none disabled:opacity-disabled',
);

interface OwnProps {
    /** 전체 건수 */
    totalCount: number;
    /** 지금 페이지. 1부터 센다 */
    page: number;
    /** 한 페이지 건수 */
    pageSize: number;
    /** 한 번에 늘어놓을 번호의 개수 */
    visiblePages?: number;
    /** 번호나 화살표를 눌렀을 때. 주지 않으면 눌러도 넘어가지 않는다 */
    onPageChange?: (page: number) => void;
    className?: string;
}

/**
 * 여러 페이지로 잘린 목록의 번호줄. 값을 스스로 갖지 않고, 누른 번호를 바깥에 알린다.
 * 건수가 0이면 그리지 않는다.
 */
function Pagination({
    totalCount,
    page,
    pageSize,
    visiblePages = 5,
    onPageChange,
    className,
}: OwnProps) {
    const totalPages = getTotalPages(totalCount, pageSize);

    function hndlPageChange(nextPage: number) {
        if (nextPage >= 1 && nextPage <= totalPages) {
            onPageChange?.(nextPage);
        }
    }

    if (totalCount === 0) {
        return null;
    }

    return (
        <nav
            aria-label="페이지"
            data-slot="pagination"
            className={cn('mx-auto flex w-full items-center justify-center', className)}
        >
            <ul data-slot="pagination-content" className="flex flex-row items-center">
                <li className="flex">
                    <button
                        type="button"
                        aria-label="이전 페이지"
                        disabled={page <= 1}
                        onClick={() => {
                            hndlPageChange(page - 1);
                        }}
                        className={ARROW_CLASS}
                    >
                        <ChevronLeftIcon className="size-5" aria-hidden="true" />
                    </button>
                </li>
                {getPageNumbers(page, totalPages, visiblePages).map((pageNumber) => {
                    const isActive = pageNumber === page;
                    return (
                        <li key={pageNumber} className="flex">
                            <button
                                type="button"
                                aria-current={isActive ? 'page' : undefined}
                                onClick={() => {
                                    hndlPageChange(pageNumber);
                                }}
                                className={cn(
                                    // 배치와 모양
                                    'relative inline-flex h-7 min-w-10 cursor-pointer items-center justify-center px-2',
                                    // 글자
                                    'text-xs font-medium text-strong tabular-nums',
                                    // 밑줄. 지금 페이지는 강조색, hover 는 테두리색으로 긋는다
                                    'after:absolute after:bottom-px after:left-1/2 after:h-0.75 after:w-3/5 after:-translate-x-1/2',
                                    isActive ? 'after:bg-primary' : 'hover:after:bg-border',
                                )}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    );
                })}
                <li className="flex">
                    <button
                        type="button"
                        aria-label="다음 페이지"
                        disabled={page >= totalPages}
                        onClick={() => {
                            hndlPageChange(page + 1);
                        }}
                        className={ARROW_CLASS}
                    >
                        <ChevronRightIcon className="size-5" aria-hidden="true" />
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export { Pagination };
