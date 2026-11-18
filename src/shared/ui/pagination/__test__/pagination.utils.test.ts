import { getPageNumbers, getTotalPages } from '../pagination.utils';

describe('getTotalPages', () => {
    it('건수를 한 페이지 건수로 나눠 올린다', () => {
        expect(getTotalPages(25, 10)).toBe(3);
        expect(getTotalPages(20, 10)).toBe(2);
    });

    it('건수가 0이어도 1이다', () => {
        expect(getTotalPages(0, 10)).toBe(1);
    });
});

describe('getPageNumbers', () => {
    it('지금 페이지를 가운데 둔다', () => {
        expect(getPageNumbers(8, 20, 5)).toEqual([6, 7, 8, 9, 10]);
    });

    it('개수가 짝수면 앞쪽을 한 칸 짧게 둔다', () => {
        expect(getPageNumbers(8, 20, 4)).toEqual([7, 8, 9, 10]);
    });

    it('앞 끝에서는 1부터 늘어놓는다', () => {
        expect(getPageNumbers(1, 20, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(getPageNumbers(2, 20, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('뒤 끝에서는 앞으로 밀어 개수를 지킨다', () => {
        expect(getPageNumbers(20, 20, 5)).toEqual([16, 17, 18, 19, 20]);
    });

    it('전체 페이지가 개수보다 적으면 있는 만큼만 낸다', () => {
        expect(getPageNumbers(2, 3, 5)).toEqual([1, 2, 3]);
        expect(getPageNumbers(1, 1, 5)).toEqual([1]);
    });
});
