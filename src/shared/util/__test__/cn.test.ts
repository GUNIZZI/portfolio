import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { cn } from '../cn';

describe('cn', () => {
    it('거짓 값을 버리고 클래스를 합친다', () => {
        expect(cn('flex', false, undefined, 'gap-2')).toBe('flex gap-2');
    });

    it('충돌하는 Tailwind 클래스는 뒤의 것을 남긴다', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('토큰 글자 크기와 글자색을 함께 남긴다', () => {
        expect(cn('text-body', 'text-accent-foreground')).toBe('text-body text-accent-foreground');
        expect(cn('text-bubble font-bold', 'text-strong')).toBe(
            'text-bubble font-bold text-strong',
        );
    });

    it('토큰 글자 크기끼리는 뒤의 것을 남긴다', () => {
        expect(cn('text-body', 'text-sm')).toBe('text-sm');
    });

    it('typography.css 의 글자 크기 토큰을 모두 등록했다', () => {
        const css = readFileSync(join(__dirname, '../../../style/tokens/typography.css'), 'utf8');
        const names = [...css.matchAll(/--text-([a-z0-9]+(?:-[a-z0-9]+)*):/g)].map(
            (match) => match[1] ?? '',
        );
        for (const name of names) {
            expect(cn(`text-${name}`, 'text-strong')).toBe(`text-${name} text-strong`);
        }
    });
});
