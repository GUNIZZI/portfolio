/**
 * 분야별 기술 묶음 8개.(docs/plan/about/README.md 「기술」)
 * items 는 경력 태그(content/experiences.json)에서 옮긴 초안이고, usage 는 임시 문구다. 사용자가 고친다.
 */
export const SKILL_GROUPS = [
    {
        name: 'UI · 디자인 시스템',
        usage: 'KOCOM Design System 과 NEWEN AI UI Kit 을 설계하고 문서화했습니다.',
        items: ['Shadcn UI', 'Storybook', 'UI Kit 설계', '컴포넌트 문서화'],
    },
    {
        name: '프레임워크',
        usage: '관리 화면과 대시보드를 React · Vue 양쪽으로 만들어 왔습니다.',
        items: ['React', 'Next.js', 'Vue 2', 'Nuxt 2'],
    },
    {
        name: '언어 · 마크업',
        usage: '2009년부터 마크업과 스크립트를 직접 짜 왔습니다.',
        items: ['TypeScript', 'JavaScript', 'HTML', 'CSS', '웹 표준'],
    },
    {
        name: '상태 · 데이터',
        usage: 'Web Admin 의 화면 상태와 서버 데이터를 나눠 다룹니다.',
        items: ['Zustand', 'Vuex', 'TanStack', 'Context', 'NextAuth'],
    },
    {
        name: '스타일',
        usage: '토큰으로 색과 간격을 정하고 유틸리티 클래스로 씁니다.',
        items: ['Tailwind CSS', 'MUI'],
    },
    {
        name: '모션 · 인터랙션',
        usage: '이 사이트의 모션을 만들었고, 이전에는 Flash 로 인터랙티브 콘텐츠를 만들었습니다.',
        items: ['framer-motion', 'GSAP', 'Flash Timeline'],
    },
    {
        name: '데이터 시각화',
        usage: '운영 대시보드를 여러 개 설계하고 구현했습니다.',
        items: ['D3.js', 'AmChart'],
    },
    {
        name: '구조 · 배포 · 협업',
        usage: 'KOCOM Web Management 를 모노레포로 구성하고 배포 흐름을 만들었습니다.',
        items: ['Monorepo', 'CI/CD', 'SSR · CSR', 'Git', 'Notion', 'AI 협업'],
    },
] as const;
