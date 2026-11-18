import { toUpdatedAtText } from '../dateText';

describe('toUpdatedAtText', () => {
    it('한국 시각으로 날짜와 시각을 적는다', () => {
        expect(toUpdatedAtText('2026-11-17T01:12:00.000Z')).toBe('2026.11.17 (10:12)');
    });

    it('날짜가 바뀌는 시각도 한국 날짜로 적는다', () => {
        expect(toUpdatedAtText('2026-11-16T15:05:00.000Z')).toBe('2026.11.17 (00:05)');
    });

    it('기록이 없으면 문구도 없다', () => {
        expect(toUpdatedAtText(null)).toBeNull();
    });
});
