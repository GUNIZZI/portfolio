'use client';

import { useSearchParams } from 'next/navigation';

import type { ProjectFilterItem } from '../model/projectExplorer.types';
import { CATEGORY_PARAM, toCategoryList, toSelectedCategory } from '../model/projectExplorer.utils';
import ProjectFilterGridView from './ProjectFilterGridView';

interface OwnProps {
    items: ProjectFilterItem[];
}

/**
 * 주소에 남긴 분류로 작업을 거르는 격자. 주소를 넘기면 같은 목록이 열린다.
 * 주소를 읽는 훅(useSearchParams)을 쓰므로 Suspense 안에 둔다. 밖에 두면 페이지를 미리 그려 둘 수 없다.
 */
export default function ProjectFilterGrid({ items }: OwnProps) {
    const categories = toCategoryList(items);
    const selected = toSelectedCategory(useSearchParams().get(CATEGORY_PARAM), categories);

    function hndlSelect(category: string | null) {
        const url = new URL(window.location.href);
        if (category) url.searchParams.set(CATEGORY_PARAM, category);
        else url.searchParams.delete(CATEGORY_PARAM);
        // 페이지를 다시 불러오지 않고 주소만 바꾼다. useSearchParams 가 따라 바뀐다
        window.history.replaceState(null, '', url);
    }

    return (
        <ProjectFilterGridView
            items={items}
            categories={categories}
            selected={selected}
            onSelect={hndlSelect}
        />
    );
}
