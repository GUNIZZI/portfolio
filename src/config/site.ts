/** 사이트 정보의 단일 출처. 메타데이터 · 헤더 · 푸터 · 연락 섹션이 함께 읽는다. */
export const SITE = {
    name: 'GUNI',
    role: 'Web Frontend Developer',
    title: 'GUNI — Web Frontend Developer',
    description: '쓰는 재미가 있고, 기능을 하나씩 더해 가기 좋은 웹사이트를 만듭니다.',
    email: 'h2dlhs@naver.com',
    locale: 'ko_KR',
} as const;

/** 이 사이트의 공개 저장소. 「제작 과정」 페이지가 연다 */
export const REPOSITORY_URL = 'https://github.com/GUNIZZI/portfolio';

/**
 * 외부 링크. http 로 시작하는 주소는 푸터가 새 탭으로 연다.
 * icon 은 shared/ui/icon 의 이름이다.
 */
export const SOCIAL_LINKS = [
    { label: 'GitHub', href: 'https://github.com/GUNIZZI', icon: 'github' },
    { label: '이메일', href: `mailto:${SITE.email}`, icon: 'mail' },
] as const;
