import { isLeftward, toTransitionMode } from '../pageTransition.utils';

describe('toTransitionMode', () => {
    it('다른 메뉴로 옮기면 붓질이다', () => {
        expect(toTransitionMode('/', '/work')).toBe('paint');
        expect(toTransitionMode('/work/abc', '/about')).toBe('paint');
        expect(toTransitionMode('/', '/work/abc')).toBe('paint');
    });

    it('작업 목록과 상세 사이, 상세와 상세 사이는 디졸브다', () => {
        expect(toTransitionMode('/work', '/work/abc')).toBe('dissolve');
        expect(toTransitionMode('/work/abc', '/work')).toBe('dissolve');
        expect(toTransitionMode('/work/abc', '/work/def')).toBe('dissolve');
    });

    it('메뉴에 없는 주소끼리는 붓질이다', () => {
        expect(toTransitionMode('/unknown', '/unknown/abc')).toBe('paint');
    });
});

describe('isLeftward', () => {
    it('메뉴에서 왼쪽에 있는 페이지로 가면 참이다', () => {
        expect(isLeftward('/about', '/work')).toBe(true);
        expect(isLeftward('/work/abc', '/')).toBe(true);
    });

    it('메뉴에서 오른쪽에 있는 페이지로 가면 거짓이다', () => {
        expect(isLeftward('/', '/work/abc')).toBe(false);
        expect(isLeftward('/work', '/about')).toBe(false);
    });
});
