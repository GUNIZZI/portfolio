import type { AboutRepository } from '../../repositories/about.repositories';
import { saveAboutSection, toUpdatedAtText } from '../about.services';

const repository = vi.hoisted(() => ({
    getAbout: vi.fn<AboutRepository['getAbout']>(),
    saveSection: vi.fn<AboutRepository['saveSection']>(),
}));

vi.mock('../../repositories/about.repositories', () => ({ aboutRepository: repository }));
vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

beforeEach(() => {
    vi.resetAllMocks();
});

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

describe('saveAboutSection', () => {
    it('규칙에 맞으면 다듬은 값으로 저장한다', async () => {
        const isSaved = await saveAboutSection('intro', {
            lines: [' 소개 '],
            growthPath: ['Design', 'React'],
            growthPathNote: '',
        });

        expect(isSaved).toBe(true);
        expect(repository.saveSection).toHaveBeenCalledWith('intro', {
            lines: ['소개'],
            growthPath: ['Design', 'React'],
            growthPathNote: '',
        });
    });

    it('성장 경로가 2개보다 적으면 저장하지 않는다', async () => {
        const isSaved = await saveAboutSection('intro', {
            lines: ['소개'],
            growthPath: ['Design'],
            growthPathNote: '',
        });

        expect(isSaved).toBe(false);
        expect(repository.saveSection).not.toHaveBeenCalled();
    });

    it('일하는 방식이 4개가 아니면 저장하지 않는다', async () => {
        const isSaved = await saveAboutSection('principles', {
            items: [{ title: '제목', description: '설명' }],
        });

        expect(isSaved).toBe(false);
        expect(repository.saveSection).not.toHaveBeenCalled();
    });

    it('다른 섹션의 모양으로 보내면 저장하지 않는다', async () => {
        const isSaved = await saveAboutSection('home', { lines: ['소개'] });

        expect(isSaved).toBe(false);
        expect(repository.saveSection).not.toHaveBeenCalled();
    });
});
