import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { DURATION, EASE } from '../motion';

const css = readFileSync(join(__dirname, '..', 'motion.css'), 'utf8');

function cssValue(name: string): string {
    const match = new RegExp(`--${name}:\\s*([^;]+);`).exec(css);
    if (!match?.[1]) {
        throw new Error(`motion.css 에 --${name} 이 없다`);
    }
    return match[1].trim();
}

describe('모션 토큰 — CSS 와 JS 가 같은 값을 갖는다', () => {
    it.each(Object.entries(DURATION))('duration-%s', (name, seconds) => {
        expect(cssValue(`duration-${name}`)).toBe(`${Math.round(seconds * 1000)}ms`);
    });

    it.each(Object.entries(EASE))('ease-%s', (name, points) => {
        expect(cssValue(`ease-${name}`)).toBe(`cubic-bezier(${points.join(', ')})`);
    });
});
