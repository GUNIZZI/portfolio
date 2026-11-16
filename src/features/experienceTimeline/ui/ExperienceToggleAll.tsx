'use client';

import { useEffect, useState } from 'react';

interface OwnProps {
    /** 회사 목록(details 를 담은 요소)의 id */
    listId: string;
}

function findDetails(listId: string): HTMLDetailsElement[] {
    return [...(document.getElementById(listId)?.querySelectorAll('details') ?? [])];
}

/**
 * 경력의 회사를 한 번에 모두 펼치거나 닫는 버튼.
 * 회사 하나하나는 details 라 스스로 여닫힌다. 이 버튼은 그 상태를 읽고 한꺼번에 바꾸기만 한다.
 */
export default function ExperienceToggleAll({ listId }: OwnProps) {
    // 처음에는 이전 경력이 접혀 있어 모두 펼쳐진 상태가 아니다
    const [isAllOpen, setIsAllOpen] = useState(false);

    // 회사를 하나씩 여닫아도 버튼의 문구가 맞게 따라간다
    useEffect(() => {
        const list = document.getElementById(listId);
        if (!list) return;

        function hndlToggle() {
            setIsAllOpen(findDetails(listId).every((details) => details.open));
        }
        // toggle 이벤트는 위로 올라오지 않아 내려가는 단계에서 듣는다
        list.addEventListener('toggle', hndlToggle, true);
        return () => {
            list.removeEventListener('toggle', hndlToggle, true);
        };
    }, [listId]);

    function hndlClick() {
        const shouldOpen = !isAllOpen;
        for (const details of findDetails(listId)) {
            details.open = shouldOpen;
        }
        setIsAllOpen(shouldOpen);
    }

    return (
        <button
            type="button"
            aria-controls={listId}
            onClick={hndlClick}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-accent"
        >
            {isAllOpen ? '전체 닫기' : '전체 펼치기'}
        </button>
    );
}
