/**
 * 소개 문단. 줄마다 한 문단이다.
 * 임시 문구다. 사용자가 실제 소개로 바꾼다.(docs/plan/about/README.md 검토 필요 사항)
 */
export const ABOUT_INTRO_LINES = [
    'Design으로 일을 시작해 Flash Development와 Markup · JS를 거쳐, 지금은 React 와 Next.js 로 제품을 만드는 프론트엔드 개발자입니다.',
    '화면이 어떻게 보이고 어떻게 움직여야 하는지를 직접 그려 본 경험으로, 디자인 시스템과 관리 화면을 설계하고 구현합니다.',
] as const;

/** 성장 경로. 주된 기술이 바뀌어 온 순서다. 기존 소개 페이지의 그림을 한 줄로 옮겼다 */
export const GROWTH_PATH = ['Design', 'Flash', 'Markup · JS', 'Vue', 'React · TS'] as const;

/** 성장 경로 아래에 붙이는 한 줄. 도구를 네 번 옮겨 온 경력을 한 문장으로 말한다 */
export const GROWTH_PATH_NOTE = '도구는 바뀌어도 기준은 가져갑니다.';
