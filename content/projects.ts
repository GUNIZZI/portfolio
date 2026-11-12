/**
 * 작업 원문. entities/project 의 repositories 만 읽는다.
 * 모양은 entities/project/model/project.schemas.ts 가 검증한다.
 */
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
    },
    {
        slug: 'fan-space',
        title: '팬을 위한 특별한 공간',
        category: 'Landing Page',
        summary: 'Next.js · Tailwind',
        image: null,
    },
] as const;
