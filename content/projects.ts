/**
 * 작업 원문. entities/project 의 repositories 만 읽는다.
 * 모양은 entities/project/model/project.schemas.ts 가 검증한다.
 */
/**
 * 케이스 스터디 본문의 임시 값. 절의 순서만 잡아 둔 안내 문구다. 사용자가 작업마다 실제 내용으로 바꾼다.
 * 본문은 Tiptap 에디터가 내는 HTML 이다.(docs/plan/work/README.md 「상세」)
 */
const BODY_TEMPLATE = [
    '<h2>개요</h2>',
    '<p>이 작업이 무엇이고 누가 쓰는지 두세 문장으로 적습니다.</p>',
    '<h2>문제</h2>',
    '<p>시작할 때의 상황과 풀어야 했던 문제를 적습니다.</p>',
    '<h2>해결</h2>',
    '<ul><li><p>어떤 선택을 했고 왜 그렇게 했는지 적습니다.</p></li><li><p>구조 · 화면 · 협업 가운데 직접 한 일을 적습니다.</p></li></ul>',
    '<h2>결과</h2>',
    '<p>무엇이 달라졌는지 적습니다. 가능하면 숫자를 씁니다.</p>',
    '<h2>회고</h2>',
    '<p>다시 한다면 다르게 할 것과 배운 것을 적습니다.</p>',
].join('');

export const PROJECTS = [
    {
        slug: 'kozipsa',
        title: 'KOZIPSA 플랫폼 관리 시스템',
        category: 'Enterprise',
        summary: 'Kocom · Admin Platform',
        image: {
            src: '/images/projects/kozipsa.png',
            alt: 'KOZIPSA 관리 시스템 화면',
            width: 438,
            height: 224,
        },
        // team 과 scope 는 화면을 보려고 넣은 임시 값이다. 실제 구성으로 바꾼다
        team: [
            { part: '프론트엔드', count: 2 },
            { part: '디자이너', count: 1 },
            { part: '백엔드', count: 3 },
        ],
        role: '프론트엔드 개발',
        scope: [
            { area: 'design', level: 'part' },
            { area: 'publishing', level: 'sole' },
            { area: 'development', level: 'lead' },
        ],
        period: { start: '2025.06' },
        stack: ['Next.js 15', 'Context', 'Zustand', 'CI/CD'],
        body: BODY_TEMPLATE,
    },
    {
        slug: 'dashboard',
        title: '사내 통합 대시보드',
        category: 'Dashboard',
        summary: 'Next.js · Recharts',
        image: {
            src: '/images/projects/dashboard.png',
            alt: '사내 통합 대시보드 화면',
            width: 436,
            height: 224,
        },
        body: BODY_TEMPLATE,
    },
    {
        slug: 'apartment',
        title: '아파트 관리 시스템',
        category: 'Web App',
        summary: 'React · TypeScript',
        image: {
            src: '/images/projects/apartment.png',
            alt: '아파트 관리 시스템 화면',
            width: 436,
            height: 224,
        },
        body: BODY_TEMPLATE,
    },
    {
        slug: 'fan-space',
        title: '팬을 위한 특별한 공간',
        category: 'Landing Page',
        summary: 'Next.js · Tailwind',
        image: null,
        body: BODY_TEMPLATE,
    },
] as const;
