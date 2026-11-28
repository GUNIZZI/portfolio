import { PROJECT_FIELD_ERROR } from '@/entities/project/model/project.constants';
import type { ProjectRowData } from '@/entities/project/model/project.types';

import { ProjectFormSchema } from '../projectEditor.schemas';
import type { ProjectFormValue } from '../projectEditor.types';
import {
    toContent,
    toFormValue,
    toImageFileError,
    toImagePathname,
    toProjectCounts,
    toResizedSize,
    withFeatured,
    withPublished,
} from '../projectEditor.utils';

const IMAGE = {
    src: 'https://store.public.blob.vercel-storage.com/projects/a.png',
    alt: 'A 화면',
    width: 400,
    height: 200,
};

const VALUE: ProjectFormValue = {
    title: 'A',
    category: 'Admin',
    summary: 'React',
    href: '',
    image: null,
    published: true,
    featured: true,
    team: [],
    role: '',
    scope: { planning: '', design: '', publishing: '', development: '' },
    period: { start: '', end: '' },
    isOngoing: false,
    stack: [],
    links: [],
    body: '',
};

/** 저장된 내용. 상세 항목을 모두 비운 것 */
const CONTENT = {
    title: 'A',
    category: 'Admin',
    summary: 'React',
    image: null,
    published: true,
    featured: false,
    team: [],
    scope: [],
    stack: [],
    links: [],
};

const ROW: ProjectRowData = {
    id: 'a',
    title: 'A',
    category: 'Admin',
    image: null,
    isPublished: true,
    isFeatured: true,
    updatedAtText: null,
};

describe('toFormValue', () => {
    it('등록 화면이면 모두 빈 값이고 비공개로 시작한다', () => {
        const value = toFormValue(null);
        expect(value.title).toBe('');
        expect(value.image).toBeNull();
        expect(value.published).toBe(false);
        expect(value.featured).toBe(false);
        expect(value.team).toEqual([]);
        expect(value.scope).toEqual({ planning: '', design: '', publishing: '', development: '' });
    });

    it('등록 화면의 본문에는 절 제목 5개가 템플릿으로 들어 있다', () => {
        expect(toFormValue(null).body).toBe(
            '<h2>프로젝트 소개</h2><p></p><h2>해결해야 했던 문제</h2><p></p><h2>해결 과정</h2><p></p><h2>결과</h2><p></p><h2>배운 점</h2><p></p>',
        );
        expect(toFormValue(CONTENT).body).toBe('');
    });

    it('저장된 상세 항목을 폼의 값으로 바꾼다', () => {
        const value = toFormValue({
            ...CONTENT,
            team: [{ part: '프론트엔드', count: 2 }],
            role: '프론트엔드 개발',
            scope: [
                { area: 'development', level: 'lead' },
                { area: 'design', level: 'part' },
            ],
            period: { start: '2025.06' },
            body: '<p>본문</p>',
        });
        expect(value.team).toEqual([{ part: '프론트엔드', count: '2' }]);
        expect(value.role).toBe('프론트엔드 개발');
        expect(value.scope).toEqual({
            planning: '',
            design: 'part',
            publishing: '',
            development: 'lead',
        });
        // 시작만 있으면 진행 중이다
        expect(value.period).toEqual({ start: '2025.06', end: '' });
        expect(value.isOngoing).toBe(true);
        expect(value.body).toBe('<p>본문</p>');
    });

    it('기간이 없으면 진행 중을 켜지 않는다', () => {
        expect(toFormValue(CONTENT).isOngoing).toBe(false);
    });

    it('상세 주소가 없으면 빈 문자열로 둔다', () => {
        const value = toFormValue({ ...CONTENT, image: IMAGE });
        expect(value.href).toBe('');
        expect(value.image).toEqual(IMAGE);
    });
});

describe('toContent', () => {
    it('비운 상세 주소는 키째로 뺀다', () => {
        expect(toContent(VALUE)).not.toHaveProperty('href');
        expect(toContent({ ...VALUE, href: '  ' })).not.toHaveProperty('href');
        expect(toContent({ ...VALUE, href: ' https://example.com ' }).href).toBe(
            'https://example.com',
        );
    });

    it('비공개면 홈 노출을 끈다', () => {
        expect(toContent({ ...VALUE, published: false, featured: true }).featured).toBe(false);
        expect(toContent(VALUE).featured).toBe(true);
    });

    it('비운 역할 · 기간 · 본문은 키째로 뺀다', () => {
        const content = toContent(VALUE);
        expect(content).not.toHaveProperty('role');
        expect(content).not.toHaveProperty('period');
        expect(content).not.toHaveProperty('body');
    });

    it('글자로 적은 인원을 숫자로 바꾼다', () => {
        const content = toContent({ ...VALUE, team: [{ part: '프론트엔드', count: ' 2 ' }] });
        expect(content.team).toEqual([{ part: '프론트엔드', count: 2 }]);
        expect(
            toContent({ ...VALUE, team: [{ part: 'A', count: '두 명' }] }).team[0]?.count,
        ).toBeNaN();
    });

    it('맡은 범위는 고른 영역만 일이 흘러가는 순서로 낸다', () => {
        const content = toContent({
            ...VALUE,
            scope: { planning: '', design: 'part', publishing: '', development: 'lead' },
        });
        expect(content.scope).toEqual([
            { area: 'design', level: 'part' },
            { area: 'development', level: 'lead' },
        ]);
    });

    it('진행 중이면 끝에 적은 값이 있어도 뺀다', () => {
        const period = { start: '2025.06', end: '2026.01' };
        expect(toContent({ ...VALUE, period }).period).toEqual(period);
        expect(toContent({ ...VALUE, period, isOngoing: true }).period).toEqual({
            start: '2025.06',
        });
    });
});

describe('ProjectFormSchema', () => {
    it('필수 항목이 비면 항목마다 오류 문구를 낸다', () => {
        const result = ProjectFormSchema.safeParse({ ...VALUE, title: ' ', summary: '' });
        const messages = result.error?.issues.map((issue) => [issue.path.join('.'), issue.message]);
        expect(messages).toEqual([
            ['title', PROJECT_FIELD_ERROR.TITLE],
            ['summary', PROJECT_FIELD_ERROR.SUMMARY],
        ]);
    });

    it('분류는 정해 둔 목록의 값이어야 한다', () => {
        for (const category of ['', 'Etc']) {
            const result = ProjectFormSchema.safeParse({ ...VALUE, category });
            expect(result.error?.issues[0]?.path).toEqual(['category']);
            expect(result.error?.issues[0]?.message).toBe(PROJECT_FIELD_ERROR.CATEGORY);
        }
    });

    it('썸네일이 있으면 대체 텍스트가 필수다', () => {
        const result = ProjectFormSchema.safeParse({ ...VALUE, image: { ...IMAGE, alt: '' } });
        expect(result.error?.issues[0]?.path).toEqual(['image', 'alt']);
        expect(result.error?.issues[0]?.message).toBe(PROJECT_FIELD_ERROR.IMAGE_ALT);
        expect(ProjectFormSchema.safeParse({ ...VALUE, image: IMAGE }).success).toBe(true);
    });

    it('썸네일이 없으면 대체 텍스트 없이 통과한다', () => {
        expect(ProjectFormSchema.safeParse(VALUE).success).toBe(true);
    });

    /** 오류가 난 자리와 문구 */
    function toIssues(value: ProjectFormValue) {
        const result = ProjectFormSchema.safeParse(value);
        return result.error?.issues.map((issue) => [issue.path.join('.'), issue.message]);
    }

    it('팀의 줄마다 파트 이름과 1 이상의 인원이 필요하다', () => {
        expect(toIssues({ ...VALUE, team: [{ part: '', count: '0' }] })).toEqual([
            ['team.0.part', PROJECT_FIELD_ERROR.TEAM_PART],
            ['team.0.count', PROJECT_FIELD_ERROR.TEAM_COUNT],
        ]);
    });

    it('기간은 2025.06 꼴이어야 하고, 끝만 적을 수 없고, 끝이 시작보다 앞설 수 없다', () => {
        expect(toIssues({ ...VALUE, period: { start: '2025', end: '' } })).toEqual([
            ['period.start', PROJECT_FIELD_ERROR.PERIOD_FORMAT],
        ]);
        expect(toIssues({ ...VALUE, period: { start: '', end: '2026.01' } })).toEqual([
            ['period.start', PROJECT_FIELD_ERROR.PERIOD_START],
        ]);
        expect(toIssues({ ...VALUE, period: { start: '2025.06', end: '2025.01' } })).toEqual([
            ['period.end', PROJECT_FIELD_ERROR.PERIOD_END_BEFORE_START],
        ]);
        expect(
            toIssues({ ...VALUE, period: { start: '2025.06', end: '2025.06' } }),
        ).toBeUndefined();
    });

    it('링크의 줄마다 이름과 주소가 필요하다', () => {
        expect(toIssues({ ...VALUE, links: [{ label: '', href: 'example.com' }] })).toEqual([
            ['links.0.label', PROJECT_FIELD_ERROR.LINK_LABEL],
            ['links.0.href', PROJECT_FIELD_ERROR.LINK_HREF],
        ]);
        expect(
            toIssues({ ...VALUE, links: [{ label: '서비스', href: 'https://example.com' }] }),
        ).toBeUndefined();
    });
});

describe('toProjectCounts', () => {
    it('전체 · 공개 · 홈 노출 건수를 센다', () => {
        const rows = [
            ROW,
            { ...ROW, id: 'b', isFeatured: false },
            { ...ROW, id: 'c', isPublished: false, isFeatured: false },
        ];
        expect(toProjectCounts(rows)).toEqual({ total: 3, published: 2, featured: 1 });
        expect(toProjectCounts([])).toEqual({ total: 0, published: 0, featured: 0 });
    });
});

describe('withPublished · withFeatured', () => {
    const rows = [ROW, { ...ROW, id: 'b' }];

    it('비공개로 바꾸면 그 줄의 홈 노출도 함께 꺼진다', () => {
        const [first, second] = withPublished(rows, 'a', false);
        expect(first).toMatchObject({ isPublished: false, isFeatured: false });
        expect(second).toMatchObject({ isPublished: true, isFeatured: true });
    });

    it('다시 공개해도 홈 노출은 꺼져 있다', () => {
        const hidden = withPublished(rows, 'a', false);
        expect(withPublished(hidden, 'a', true)[0]).toMatchObject({
            isPublished: true,
            isFeatured: false,
        });
    });

    it('비공개인 줄은 홈 노출이 켜지지 않는다', () => {
        const hidden = withPublished(rows, 'a', false);
        expect(withFeatured(hidden, 'a', true)[0]?.isFeatured).toBe(false);
        expect(withFeatured(rows, 'b', false)[1]?.isFeatured).toBe(false);
    });
});

describe('toImageFileError', () => {
    it('PNG · JPG · WebP 가 아니면 형식 오류를 낸다', () => {
        expect(toImageFileError({ type: 'image/gif', size: 10 })).toBe(
            PROJECT_FIELD_ERROR.IMAGE_TYPE,
        );
        expect(toImageFileError({ type: 'image/webp', size: 10 })).toBeNull();
    });

    it('5MB 를 넘으면 크기 오류를 낸다', () => {
        const limit = 5 * 1024 * 1024;
        expect(toImageFileError({ type: 'image/png', size: limit })).toBeNull();
        expect(toImageFileError({ type: 'image/png', size: limit + 1 })).toBe(
            PROJECT_FIELD_ERROR.IMAGE_SIZE,
        );
    });
});

describe('toResizedSize', () => {
    it('긴 변이 1000px 을 넘으면 비율을 지키며 1000px 에 맞춘다', () => {
        expect(toResizedSize(4000, 2000)).toEqual({ width: 1000, height: 500 });
        expect(toResizedSize(1500, 3000)).toEqual({ width: 500, height: 1000 });
    });

    it('1000px 이하면 크기를 그대로 둔다', () => {
        expect(toResizedSize(1000, 400)).toEqual({ width: 1000, height: 400 });
        expect(toResizedSize(438, 224)).toEqual({ width: 438, height: 224 });
    });
});

describe('toImagePathname', () => {
    it('썸네일 폴더 아래에 두고, 확장자는 올리는 형식을 따른다', () => {
        expect(toImagePathname('fan-space.png', 'image/webp')).toBe('projects/fan-space.webp');
        expect(toImagePathname('fan-space.jpeg', 'image/png')).toBe('projects/fan-space.png');
    });

    it('주소에 쓰기 어려운 글자는 줄표로 바꾼다', () => {
        expect(toImagePathname('팬 공간 (1).png', 'image/webp')).toBe('projects/-1-.webp');
    });
});
