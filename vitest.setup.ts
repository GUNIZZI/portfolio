import '@testing-library/jest-dom/vitest';

// jsdom 에는 matchMedia 가 없다. reduced-motion 분기를 테스트하려면 필요하다.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
