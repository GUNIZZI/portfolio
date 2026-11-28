/**
 * 「제작 과정」 페이지에서 코드가 갖는 값. 섹션의 구성과 그림, 역할이다.
 * 글과 표의 내용은 entity colophon 이 저장소에서 읽는다.(src/entities/colophon/README.md)
 * 구성은 docs/plan/colophon/README.md 「정책」 을 따른다.
 */

import {
    COLOPHON_SECTION,
    type ColophonFontFace,
    type ColophonRole,
} from '@/entities/colophon/model/colophon.constants';

/** 역할의 점 색. 이름은 entity 가 갖는다. 색만으로 구별하지 않게 이름을 함께 적는다 */
export const COLOPHON_ROLE_DOT_CLASS: Record<ColophonRole, string> = {
    ME: 'bg-primary',
    GPT: 'bg-doodle-sky',
    CLAUDE: 'bg-brand',
};

/**
 * 섹션의 id. 과정의 단계가 이 id 로 스크롤한다.
 * 값을 entity 의 섹션 이름에서 가져와, 저장소에 둔 「이어지는 섹션」 과 어긋나지 않게 한다
 */
export const COLOPHON_SECTION_ID = {
    PROCESS: COLOPHON_SECTION.PROCESS,
    DESIGN: COLOPHON_SECTION.DESIGN,
    DEVELOP: COLOPHON_SECTION.DEVELOP,
    GUARDS: COLOPHON_SECTION.GUARDS,
    HUMAN: COLOPHON_SECTION.HUMAN,
    STACK: COLOPHON_SECTION.STACK,
} as const;

/** 계층. 위 계층이 아래 계층을 가져온다. 순서가 의존 방향이다 */
export const COLOPHON_LAYERS = [
    {
        name: 'app',
        description: 'URL에 연결되는 페이지와 레이아웃',
        examples: ['page', 'layout'],
        arrowClass: 'stroke-doodle-sky',
    },
    {
        name: 'widgets',
        description: '공통 영역이나 여러 기능을 조합한 UI',
        examples: ['header', 'footer', 'contact'],
        arrowClass: 'stroke-doodle-violet',
    },
    {
        name: 'features',
        description: '화면의 주요 섹션과 개별 기능',
        examples: ['hero', 'dashboard', 'colophon'],
        arrowClass: 'stroke-doodle-yellow',
    },
    {
        name: 'entities',
        description: '프로젝트, 경력, 방문 통계 등 사이트에서 다루는 데이터',
        examples: ['project', 'experience', 'analytics'],
        arrowClass: 'stroke-primary',
    },
    {
        name: 'shared',
        description: '여러 곳에서 공통으로 쓰는 UI와 유틸리티',
        examples: ['ui', 'util'],
        // 맨 아래 계층이라 아래로 가는 화살표가 없다
        arrowClass: '',
    },
] as const;

/** 폰트 표의 견본 글꼴을 그리는 클래스. 줄의 이름을 그 글꼴로 적는다 */
export const COLOPHON_FONT_FACE_CLASS: Record<ColophonFontFace, string> = {
    MARKER: 'font-marker',
    HAND: 'font-hand',
    SANS: 'font-sans',
};
