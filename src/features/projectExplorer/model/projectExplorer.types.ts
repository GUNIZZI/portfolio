import type { ReactNode } from 'react';

/** 격자에 놓을 작업 한 건 */
export interface ProjectFilterItem {
    /** 프로젝트의 id. 격자가 카드를 구분할 때 쓴다 */
    id: string;
    /** 거르는 기준 */
    category: string;
    /** 서버에서 그린 작업 카드 */
    card: ReactNode;
}
