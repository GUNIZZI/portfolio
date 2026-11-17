import { toCategoryList, toSelectedCategory } from '../projectExplorer.utils';

describe('toCategoryList', () => {
    it('처음 나온 순서대로 중복 없이 낸다', () => {
        const items = [{ category: 'Web' }, { category: 'Dashboard' }, { category: 'Web' }];
        expect(toCategoryList(items)).toEqual(['Web', 'Dashboard']);
    });
});

describe('toSelectedCategory', () => {
    const categories = ['Web', 'Dashboard'];

    it('목록에 있는 분류는 그대로 받는다', () => {
        expect(toSelectedCategory('Dashboard', categories)).toBe('Dashboard');
    });

    it('목록에 없는 분류와 빈 값은 전체로 본다', () => {
        expect(toSelectedCategory('없는분류', categories)).toBeNull();
        expect(toSelectedCategory(null, categories)).toBeNull();
        expect(toSelectedCategory('', categories)).toBeNull();
    });
});
