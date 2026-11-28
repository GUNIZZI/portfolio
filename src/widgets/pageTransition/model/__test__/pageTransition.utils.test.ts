import { isLeftward, shouldCoverEarly, toTransitionMode } from '../pageTransition.utils';

describe('toTransitionMode', () => {
    it('다른 메뉴로 옮기면 붓질이다', () => {
        expect(toTransitionMode('/', '/project')).toBe('paint');
        expect(toTransitionMode('/project/abc', '/about')).toBe('paint');
        expect(toTransitionMode('/', '/project/abc')).toBe('paint');
    });

    it('작업 목록과 상세 사이, 상세와 상세 사이는 디졸브다', () => {
        expect(toTransitionMode('/project', '/project/abc')).toBe('dissolve');
        expect(toTransitionMode('/project/abc', '/project')).toBe('dissolve');
        expect(toTransitionMode('/project/abc', '/project/def')).toBe('dissolve');
    });

    it('메뉴에 없는 주소끼리는 붓질이다', () => {
        expect(toTransitionMode('/unknown', '/unknown/abc')).toBe('paint');
    });
});

describe('isLeftward', () => {
    it('메뉴에서 왼쪽에 있는 페이지로 가면 참이다', () => {
        expect(isLeftward('/about', '/project')).toBe(true);
        expect(isLeftward('/project/abc', '/')).toBe(true);
    });

    it('메뉴에서 오른쪽에 있는 페이지로 가면 거짓이다', () => {
        expect(isLeftward('/', '/project/abc')).toBe(false);
        expect(isLeftward('/project', '/about')).toBe(false);
    });
});

describe('shouldCoverEarly', () => {
    it('다른 메뉴의 페이지로 가면 누른 순간부터 칠한다', () => {
        expect(shouldCoverEarly('/', '/project')).toBe(true);
        expect(shouldCoverEarly('/project/abc', '/about')).toBe(true);
        expect(shouldCoverEarly('/about', '/project/abc')).toBe(true);
    });

    it('같은 메뉴 안의 이동은 디졸브라 칠하지 않는다', () => {
        expect(shouldCoverEarly('/project', '/project/abc')).toBe(false);
        expect(shouldCoverEarly('/project/abc', '/project')).toBe(false);
    });

    it('메뉴 밖의 주소로 가면 칠하지 않는다', () => {
        expect(shouldCoverEarly('/', '/admin')).toBe(false);
        expect(shouldCoverEarly('/project', '/unknown')).toBe(false);
    });

    it('주소가 같으면 칠하지 않는다', () => {
        expect(shouldCoverEarly('/project', '/project')).toBe(false);
    });
});
