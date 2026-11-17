import { EDGE_MASK, toCardEdge, toEdgeMaskImage } from '../featuredProjects.utils';

describe('toCardEdge', () => {
    it.each([
        [0.5, 0, 'top'],
        [1, 0.5, 'right'],
        [0.5, 1, 'bottom'],
        [0, 0.5, 'left'],
    ] as const)('변의 가운데(%s, %s)는 %s 다', (x, y, edge) => {
        expect(toCardEdge(x, y)).toBe(edge);
    });

    it.each([
        [0, 0, 'topLeft'],
        [1, 0, 'topRight'],
        [1, 1, 'bottomRight'],
        [0, 1, 'bottomLeft'],
    ] as const)('모서리(%s, %s)는 %s 다', (x, y, edge) => {
        expect(toCardEdge(x, y)).toBe(edge);
    });

    it('변에서 모서리 쪽으로 조금 치우친 점은 그 변으로 본다', () => {
        expect(toCardEdge(0.6, 0)).toBe('top');
        expect(toCardEdge(1, 0.4)).toBe('right');
    });
});

describe('EDGE_MASK', () => {
    it('모든 변이 가려진 자리와 보이는 자리가 다르다', () => {
        for (const mask of Object.values(EDGE_MASK)) {
            expect(mask.hidden).not.toBe(mask.shown);
        }
    });

    it('변의 각도로 마스크 그림을 만든다', () => {
        expect(toEdgeMaskImage('left')).toBe('linear-gradient(90deg, black 50%, transparent 50%)');
    });
});
