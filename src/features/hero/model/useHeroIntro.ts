'use client';

import { useEffect, useState } from 'react';

/** 등장 연출을 이미 실행했는가. 페이지를 새로 불러오기 전까지 남는다 */
const intro = { hasPlayed: false };

/**
 * 등장 연출의 시작 상태를 돌려준다.
 * 처음 그릴 때는 'hidden' 에서 시작하고, 다른 페이지에 갔다 돌아오면 false 로 최종 상태를 바로 그린다.
 */
export function useHeroIntro(): 'hidden' | false {
    const [initial] = useState<'hidden' | false>(() => (intro.hasPlayed ? false : 'hidden'));

    useEffect(() => {
        intro.hasPlayed = true;
    }, []);

    return initial;
}
