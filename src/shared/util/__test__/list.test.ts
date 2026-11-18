import { moveItem, moveItemTo, removeItem, replaceItem } from '../list';

describe('moveItem', () => {
    it('한 줄을 아래로 옮긴다', () => {
        expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
    });

    it('한 줄을 위로 옮긴다', () => {
        expect(moveItem(['a', 'b', 'c'], 2, -1)).toEqual(['a', 'c', 'b']);
    });

    it('끝을 넘어가면 그대로 둔다', () => {
        expect(moveItem(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
        expect(moveItem(['a', 'b'], 1, 1)).toEqual(['a', 'b']);
    });
});

describe('moveItemTo', () => {
    it('뒤로 옮긴다', () => {
        expect(moveItemTo(['a', 'b', 'c', 'd'], 0, 3)).toEqual(['b', 'c', 'a', 'd']);
        expect(moveItemTo(['a', 'b', 'c'], 0, 3)).toEqual(['b', 'c', 'a']);
    });

    it('앞으로 옮긴다', () => {
        expect(moveItemTo(['a', 'b', 'c', 'd'], 3, 1)).toEqual(['a', 'd', 'b', 'c']);
    });

    it('제자리의 앞이나 뒤에 놓으면 그대로 둔다', () => {
        expect(moveItemTo(['a', 'b', 'c'], 1, 1)).toEqual(['a', 'b', 'c']);
        expect(moveItemTo(['a', 'b', 'c'], 1, 2)).toEqual(['a', 'b', 'c']);
    });

    it('목록 밖의 항목은 옮기지 않는다', () => {
        expect(moveItemTo(['a', 'b'], 5, 0)).toEqual(['a', 'b']);
    });
});

describe('removeItem · replaceItem', () => {
    it('한 줄을 빼고, 한 줄을 바꾼다', () => {
        expect(removeItem(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
        expect(replaceItem(['a', 'b', 'c'], 1, 'x')).toEqual(['a', 'x', 'c']);
    });
});
