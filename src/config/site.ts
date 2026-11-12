/** 사이트 정보의 단일 출처. 메타데이터 · 헤더 · 푸터 · 연락 섹션이 함께 읽는다. */
export const SITE = {
    name: 'GUNI',
    role: 'Frontend Developer',
    title: 'GUNI — Frontend Developer',
    description: 'I build modern, scalable and delightful web experiences.',
    email: 'h2dlhs@naver.com',
    locale: 'ko_KR',
} as const;

/**
 * 외부 링크. 실제 주소가 정해지기 전까지 페이지 맨 위를 가리킨다.
 * icon 은 shared/ui/icon 의 이름이다.
 */
export const SOCIAL_LINKS = [
    { label: 'GitHub', href: '#top', icon: 'github' },
    { label: 'LinkedIn', href: '#top', icon: 'linkedin' },
    { label: '이메일', href: `mailto:${SITE.email}`, icon: 'mail' },
] as const;
