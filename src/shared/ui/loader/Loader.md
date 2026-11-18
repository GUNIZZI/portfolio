# Loader

진행 중임을 알리는 로더다. 고리 3개가 서로 다른 빠르기로 돈다. Kozipsa 의 Loader 를 가져왔다.(`Loader.tsx`, Kozipsa `packages/ui` 의 `loader/Loader.tsx` 에서 가져옴, 2026-11-18 사용자 결정)
지금은 Button 의 `isLoading` 이 쓴다.(`src/shared/ui/button/button.tsx`)

| prop        | 값                                                                    | 기본 |
| ----------- | --------------------------------------------------------------------- | ---- |
| `size`      | 가운데 고리의 지름. `xs`(12px) · `sm`(20px) · `md`(32px) · `lg`(48px) | `md` |
| `text`      | 고리 옆에 적는 문구                                                   |      |
| `className` | 고리를 가운데 놓는 바깥 요소에 붙는다                                 |      |

```tsx
import Loader from '@/shared/ui/loader/Loader';

<Loader size="xs" className="absolute inset-0 rounded-full bg-card/90" />;
```

- 바깥 요소는 고리를 가운데 놓기만 한다. 무엇을 덮을지는 쓰는 쪽이 `className` 으로 정한다.(`Loader.tsx`)
- 고리의 색은 `muted-foreground` 다.(`Loader.tsx`)
- 꾸밈이라 `aria-hidden` 이다. 진행 중임은 쓰는 쪽이 `aria-busy` 로 알린다.(`src/shared/ui/button/button.tsx`)

## 모션

- 한 바퀴는 안쪽부터 1초 · 2초 · 4초다. 값은 Kozipsa 의 것이고 `src/style/tokens/motion.css` 의 `--animate-loader*` 에 있다.
- **CSS 애니메이션으로 돈다.** 모션 도구를 framer-motion 과 GSAP 으로 한정한 규칙의 예외다. 화면의 연출이 아니라 진행 표시이고, 끝없이 도는 것 하나를 위해 클라이언트 컴포넌트로 만들지 않는다.(`docs/motion.md` 원칙 1, 2026-11-18 사용자 결정)
- 동작 줄이기에서는 돌지 않고 멈춘 고리만 보인다.(`Loader.tsx` 의 `motion-safe:`)

## Kozipsa 원본과 다른 점

- 고리를 전역 CSS 의 `.loader` 클래스가 아니라 유틸리티 클래스로 그린다. 이 저장소는 컴포넌트의 모양을 전역 CSS 에 두지 않는다.(`Loader.tsx`)
- 동작 줄이기에서 멈춘다. 원본은 그대로 돌았다.(`docs/motion.md` 원칙 3)
