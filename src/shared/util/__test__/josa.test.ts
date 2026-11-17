import { withObjectParticle } from '../josa';

describe('withObjectParticle', () => {
    it('받침이 있으면 을을 붙인다', () => {
        expect(withObjectParticle('제목')).toBe('제목을');
        expect(withObjectParticle('소개 문단')).toBe('소개 문단을');
    });

    it('받침이 없으면 를을 붙인다', () => {
        expect(withObjectParticle('성장 경로')).toBe('성장 경로를');
        expect(withObjectParticle('홈 소개')).toBe('홈 소개를');
    });

    it('한글이 아니면 를을 붙인다', () => {
        expect(withObjectParticle('URL')).toBe('URL를');
    });
});
