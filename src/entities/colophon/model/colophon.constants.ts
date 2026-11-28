import { PLAN_VIEWER_HREF } from '@/config/nav';
import { REPOSITORY_URL } from '@/config/site';

/** 「제작 과정」 의 내용을 나눈 섹션. 값은 Firestore 의 colophon 컬렉션에 있는 문서 이름이다 */
export const COLOPHON_SECTION = {
    HEAD: 'head',
    PROCESS: 'process',
    DESIGN: 'design',
    DEVELOP: 'develop',
    GUARDS: 'guards',
    HUMAN: 'human',
    STACK: 'stack',
} as const;
export type ColophonSection = (typeof COLOPHON_SECTION)[keyof typeof COLOPHON_SECTION];

/** 내용을 두는 Firestore 컬렉션 */
export const COLOPHON_COLLECTION = 'colophon';

/** 내용의 캐시 태그. 저장하면 이 태그의 캐시를 지운다 */
export const COLOPHON_CACHE_TAG = 'colophon';

/** 단계마다 그 일을 한 쪽. 과정의 단계가 하나씩 갖는다 */
export const COLOPHON_ROLE = { ME: 'ME', GPT: 'GPT', CLAUDE: 'CLAUDE' } as const;
export type ColophonRole = (typeof COLOPHON_ROLE)[keyof typeof COLOPHON_ROLE];

/** 역할의 이름. 공개 화면의 표시와 관리 화면의 선택 상자가 함께 쓴다 */
export const COLOPHON_ROLE_NAME = {
    ME: '나',
    GPT: 'GPT',
    CLAUDE: 'Claude',
} as const satisfies Record<ColophonRole, string>;

/**
 * 과정의 단계를 눌렀을 때 내려갈 수 있는 섹션. 페이지에서 과정 아래에 있는 섹션이다.
 * 값은 그 섹션의 id 다.(src/features/colophon/model/colophon.constants.ts 의 COLOPHON_SECTION_ID)
 */
export const COLOPHON_STEP_TARGETS = [
    COLOPHON_SECTION.DESIGN,
    COLOPHON_SECTION.DEVELOP,
    COLOPHON_SECTION.GUARDS,
    COLOPHON_SECTION.HUMAN,
    COLOPHON_SECTION.STACK,
] as const;
export type ColophonStepTarget = (typeof COLOPHON_STEP_TARGETS)[number];

/**
 * 폰트 표의 줄이 견본으로 쓰는 글꼴. 이 사이트가 불러오는 글꼴 3개다.
 * 줄의 이름을 이 글꼴로 적는다. 글꼴을 그리는 클래스는 features/colophon 이 갖는다
 */
export const COLOPHON_FONT_FACE = { MARKER: 'MARKER', HAND: 'HAND', SANS: 'SANS' } as const;
export type ColophonFontFace = (typeof COLOPHON_FONT_FACE)[keyof typeof COLOPHON_FONT_FACE];

/** 글꼴의 이름. 관리 화면의 선택 상자가 쓴다 */
export const COLOPHON_FONT_FACE_NAME = {
    MARKER: 'Permanent Marker',
    HAND: 'Caveat',
    SANS: 'Noto Sans KR',
} as const satisfies Record<ColophonFontFace, string>;

/**
 * 목록마다 남겨야 하는 최소 개수. 목록은 모두 더하고 빼고 순서를 바꿀 수 있다.
 * (docs/plan/admin/colophon/README.md 「목록」)
 */
export const COLOPHON_MIN = {
    /** 숫자 · 과정의 단계 · 디자인 단락 · 개발 단계 · 장치 · 사람이 한 일 · 기술 · 폰트 */
    ITEMS: 1,
    /** 개발 단계마다의 링크. 모두 빼도 된다 */
    LINKS: 0,
} as const;

/**
 * 항목이 규칙에 맞지 않을 때의 오류 문구. 섹션의 스키마가 낸다. 폼은 이 문구를 그대로 그린다.
 * 초안이다.(docs/plan/admin/colophon/README.md 검토 필요 사항의 「문구」)
 */
export const COLOPHON_FIELD_ERROR = {
    SUMMARY: '한 줄 요약을 입력해 주세요.',
    STAT_LABEL: '이름을 입력해 주세요.',
    STAT_VALUE: '값을 입력해 주세요.',
    STATS_DATE: '집계 기준일을 입력해 주세요.',
    STEP_TITLE: '단계의 이름을 입력해 주세요.',
    TITLE: '제목을 입력해 주세요.',
    DESCRIPTION: '설명을 입력해 주세요.',
    WORK: '작업 내용을 입력해 주세요.',
    EXAMPLE: '적용 사례를 입력해 주세요.',
    DEVELOP_EXAMPLE: '적용 사례를 입력해 주세요.',
    LINK_LABEL: '링크 이름을 입력해 주세요.',
    LINK_HREF: '주소는 https:// 나 / 로 시작해야 합니다.',
    GUARD_NAME: '이름을 입력해 주세요.',
    GUARD_COUNT: '개수를 입력해 주세요.',
    GUARD_PREVENTS: '점검 항목을 입력해 주세요.',
    FONT_NAME: '폰트 이름을 입력해 주세요.',
    FONT_USAGE: '사용 위치를 입력해 주세요.',
    FONT_LICENSE: '라이선스를 입력해 주세요.',
} as const;

const REPOSITORY_TREE_URL = `${REPOSITORY_URL}/tree/main`;

/**
 * 섹션의 처음 값. 저장소에 그 섹션의 문서가 없으면 이 값을 그린다.
 * 관리 화면에서 한 번 저장하면 그 뒤로는 저장소의 값을 쓴다.(docs/plan/admin/colophon/README.md 「처음 값」)
 * 개발 과정 · 장치 · 사람이 한 일의 글은 2026-11-28 에 사용자가 준 문구로 바꿨다.
 * 모양은 섹션의 스키마와 같다. 맞는지는 테스트가 본다.(services/__test__/colophon.services.test.ts)
 */
export const COLOPHON_DEFAULT_CONTENT = {
    head: {
        summary: '사이트의 콘셉트는 제가 정했고, GPT가 디자인을, Claude가 개발을 맡았습니다.',
        stats: [
            { label: '시작한 날', value: '2026.11.12' },
            { label: '커밋', value: '113개' },
            { label: '테스트', value: '289개' },
        ],
        statsDate: '2026.11.26',
    },
    process: {
        items: [
            { title: '콘셉트 정하기', role: COLOPHON_ROLE.ME, sectionId: COLOPHON_SECTION.DESIGN },
            {
                title: '참고 이미지 전달하기',
                role: COLOPHON_ROLE.ME,
                sectionId: COLOPHON_SECTION.DESIGN,
            },
            { title: '시안 만들기', role: COLOPHON_ROLE.GPT, sectionId: COLOPHON_SECTION.DESIGN },
            { title: '구현하기', role: COLOPHON_ROLE.CLAUDE, sectionId: COLOPHON_SECTION.DEVELOP },
        ],
    },
    design: {
        items: [
            {
                title: '콘셉트 정하기',
                role: COLOPHON_ROLE.ME,
                description:
                    '평소 좋아하는 스트리트 스타일과 그래피티를 사이트에 담았습니다. 형광 마커, 손글씨, 낙서, 캐릭터 일러스트에 그 취향을 반영했습니다.',
            },
            {
                title: '참고 이미지 모으기',
                role: COLOPHON_ROLE.ME,
                description: '핀터레스트 등에서 마음에 드는 디자인을 모았습니다.',
            },
            {
                title: 'GPT로 시안 만들기',
                role: COLOPHON_ROLE.GPT,
                description:
                    '참고 이미지와 콘셉트, 화면에 들어갈 요소를 GPT에 전달하고 반응형 페이지 시안을 받았습니다.',
            },
            {
                title: '시안을 디자인 토큰으로 정리하기',
                role: COLOPHON_ROLE.CLAUDE,
                description:
                    '시안의 색상, 글자 크기, 모서리 둥글기 값을 디자인 토큰으로 정리했습니다. 시안이 다크 모드로만 제공돼 라이트 모드에 쓸 값은 새로 정했습니다. 배경의 붓 자국 4개에 그래피티 28개를 더했습니다.',
            },
        ],
    },
    develop: {
        items: [
            {
                title: '기획',
                work: '기획 스킬로 요구사항 정의서, 사용자 흐름도, 와이어프레임을 작성했습니다.',
                example: '대시보드 기획 문서 3종',
                links: [
                    { label: '와이어프레임 보기', href: `${PLAN_VIEWER_HREF}#admin/dashboard` },
                    {
                        label: 'docs/plan/admin/dashboard',
                        href: `${REPOSITORY_TREE_URL}/docs/plan/admin/dashboard`,
                    },
                ],
            },
            {
                title: '계획 검토 및 승인',
                work: 'Claude가 ‘검토 필요 사항’으로 정리한 항목을 제가 하나씩 검토하고 결정했습니다.',
                example: '세 차례에 걸쳐 12개 항목을 확정했습니다.',
                links: [],
            },
            {
                title: '구현',
                work: 'Claude가 승인된 범위에서 구현했습니다. 범위를 넘어서는 변경은 제가 방향을 확인한 뒤 승인했습니다.',
                example: '대시보드 화면과 방문 통계 데이터 연동',
                links: [
                    {
                        label: 'src/features/dashboard',
                        href: `${REPOSITORY_TREE_URL}/src/features/dashboard`,
                    },
                    {
                        label: 'src/entities/analytics',
                        href: `${REPOSITORY_TREE_URL}/src/entities/analytics`,
                    },
                ],
            },
            {
                title: '검증',
                work: '타입 검사, 린트, 코드 포맷 검사, 테스트를 실행하고 브라우저에서 화면을 확인했습니다.',
                example: '방문 통계를 가공하는 함수에 테스트를 추가했습니다.',
                links: [],
            },
            {
                title: '커밋',
                work: '커밋 스킬로 변경 사항을 작업 목적별로 나눠 커밋했습니다.',
                example:
                    '11월 20일에 대시보드 블록 4개를, 11월 24일에 현재 접속자 표시를 추가했습니다.',
                links: [],
            },
        ],
    },
    guards: {
        items: [
            {
                name: '규칙 문서',
                count: 'CLAUDE.md 와 9개',
                prevents: '사람과 Claude가 같은 프로젝트 규칙을 참고하는지',
                example: 'CLAUDE.md와 규칙 문서 9개를 함께 참고합니다.',
            },
            {
                name: '훅',
                count: '3개',
                prevents: '디자인 토큰 사용, 코드 포맷, 커밋 절차',
                // 아래 숫자는 화면에 보여 주는 예시 문구다. 모션 값이 아니라 토큰으로 바꾸지 않는다
                example: 'duration: 0.6처럼 값을 직접 쓰면 디자인 토큰을 사용하도록 안내합니다.',
            },
            {
                name: '스킬',
                count: '7개',
                prevents: '반복 작업을 정해진 절차대로 수행하는지',
                example: '커밋은 전용 스킬로 진행하고, 훅에서 해당 절차를 확인합니다.',
            },
            {
                name: '에이전트',
                count: '2개',
                prevents: '자동 검사로 확인하기 어려운 구현 세부 사항',
                example:
                    '애니메이션을 수정하면 운영체제의 동작 줄이기 설정이 반영되는지 확인합니다.',
            },
            {
                name: 'ESLint',
                count: '경계 규칙',
                prevents: '코드가 계층별 의존성 규칙을 따르는지',
                example: 'entities에서 features를 가져오면 ESLint 오류가 발생합니다.',
            },
        ],
    },
    human: {
        items: [
            {
                title: '방향 정하기',
                description:
                    '사이트 콘셉트를 정하고 사용할 디자인 시안을 골랐습니다. 기획 단계의 주요 결정은 날짜와 함께 문서에 남겼습니다.',
            },
            {
                title: '작업 범위 승인하기',
                description:
                    '구현 계획과 작업 범위를 검토했습니다. 범위를 바꿔야 할 때는 변경 방향을 확인하고 승인했습니다.',
            },
            {
                title: '화면 다듬기',
                description:
                    '화면의 세부 요소는 직접 수정하거나, 원하는 방향을 구체적으로 설명해 수정을 요청했습니다.',
            },
        ],
    },
    stack: {
        techs: [
            'Next.js 16',
            'React 19',
            'TypeScript',
            'Tailwind CSS 4',
            'framer-motion',
            'GSAP',
            'Firebase',
            'Vitest',
            'Playwright',
        ],
        // 라이선스는 google/fonts 저장소에서 확인했다(2026-11-26)
        fonts: [
            {
                name: 'Permanent Marker',
                face: COLOPHON_FONT_FACE.MARKER,
                usage: '이름, 섹션 제목',
                license: 'Apache License 2.0',
            },
            {
                name: 'Caveat',
                face: COLOPHON_FONT_FACE.HAND,
                usage: '말풍선, 손글씨 메모',
                license: 'SIL Open Font License 1.1',
            },
            {
                name: 'Noto Sans KR',
                face: COLOPHON_FONT_FACE.SANS,
                usage: '본문과 기타 텍스트',
                license: 'SIL Open Font License 1.1',
            },
        ],
    },
};
