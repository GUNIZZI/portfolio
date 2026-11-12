import { resolveSection } from '../useSectionSpy';

const ANCHOR = 108;
const VIEWPORT = { height: 800, isAtEnd: false };

/** 스크롤 0 일 때의 위치. skills 는 projects 안에 있고 화면 절반보다 짧다 */
const PROJECTS = { id: 'projects', top: 700, bottom: 1500 };
const SKILLS = { id: 'skills', top: 1150, bottom: 1450 };
const ABOUT = { id: 'about', top: 1520, bottom: 1820 };
const SECTIONS = [PROJECTS, SKILLS, ABOUT];

function at(scrollY: number) {
    return SECTIONS.map((section) => ({
        ...section,
        top: section.top - scrollY,
        bottom: section.bottom - scrollY,
        anchor: ANCHOR,
    }));
}

/** 메뉴로 이동했을 때의 스크롤 위치. 섹션의 위가 anchor 에 멈춘다 */
function scrollTo(id: string) {
    const section = SECTIONS.find((item) => item.id === id);
    return (section?.top ?? 0) - ANCHOR;
}

describe('resolveSection', () => {
    it('첫 섹션에 도달하기 전에는 보고 있는 섹션이 없다', () => {
        expect(resolveSection(at(0), VIEWPORT)).toEqual({ currentId: null, isPastFirst: false });
    });

    it.each(['projects', 'skills', 'about'])('메뉴로 %s 에 가면 그 섹션을 고른다', (id) => {
        expect(resolveSection(at(scrollTo(id)), VIEWPORT).currentId).toBe(id);
    });

    it('멈춘 자리가 소수점으로 어긋나도 그 섹션을 고른다', () => {
        expect(resolveSection(at(scrollTo('skills') - 0.6), VIEWPORT).currentId).toBe('skills');
    });

    it('짧은 섹션을 지나도 다음 섹션에 도달하기 전까지는 그 섹션을 고른다', () => {
        const betweenSkillsAndAbout = SKILLS.bottom - ANCHOR + 20;
        expect(resolveSection(at(betweenSkillsAndAbout), VIEWPORT).currentId).toBe('skills');
    });

    it('마지막 섹션이 다 지나가면 보고 있는 섹션이 없다', () => {
        expect(resolveSection(at(ABOUT.bottom), VIEWPORT)).toEqual({
            currentId: null,
            isPastFirst: true,
        });
    });

    it('페이지 끝에 막혀 올라오지 못한 섹션은 화면에 보이면 고른다', () => {
        const stuck = scrollTo('about') - 200;
        expect(resolveSection(at(stuck), VIEWPORT).currentId).toBe('skills');
        expect(resolveSection(at(stuck), { ...VIEWPORT, isAtEnd: true }).currentId).toBe('about');
    });

    it('페이지 끝이어도 마지막 섹션이 다 지나갔으면 고르지 않는다', () => {
        const past = at(ABOUT.bottom);
        expect(resolveSection(past, { ...VIEWPORT, isAtEnd: true }).currentId).toBeNull();
    });
});
