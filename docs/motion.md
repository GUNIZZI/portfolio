# 모션

애니메이션과 인터랙션을 만드는 규칙이다.
이 사이트는 인터랙션과 모션을 강조한다(2026-11-11 사용자 결정). 그래서 모션도 색처럼 토큰으로 관리한다.

## 원칙

1. **도구는 framer-motion 과 GSAP 2개만 쓴다.**(2026-11-11 사용자 결정)
    - 다른 모션 라이브러리(Lenis, three 등)를 추가하지 않는다. 필요하면 먼저 컨펌을 받는다.
    - 예외가 2곳 있다. 로더는 CSS 애니메이션으로 돈다. 화면의 연출이 아니라 진행 중임을 알리는 표시다.(2026-11-18 사용자 결정, `src/shared/ui/loader/Loader.tsx`)
    - 페이지 전환은 React 의 `<ViewTransition>` 이 시작하고, 브라우저가 CSS 애니메이션으로 이전 화면을 붙잡아 둔다. 나가는 화면을 붙잡아 둘 수 있는 것이 브라우저의 화면 전환뿐이다. 화면을 덮는 붓질은 GSAP 이 그린다.(2026-11-18 사용자 결정, `src/widgets/pageTransition/PageTransition.tsx` · `src/style/viewTransition.css`)
2. **값은 토큰으로만 쓴다.** 지속시간·가속도·간격을 숫자로 적지 않는다.
3. **동작 줄이기 설정을 따른다.** OS 에서 동작 줄이기를 켠 사용자에게는 움직임 없이 최종 상태를 보여 준다.
4. **레이아웃을 밀지 않는 속성만 움직인다.** `transform` · `opacity` 가 기본이고 `clip-path` 도 해당한다.(2026-11-16 사용자 결정)
   `width` · `top` · `margin` 을 애니메이션하면 매 프레임 레이아웃을 다시 계산한다.
    - `clip-path` 는 버튼의 면이 넓어지는 연출에 쓴다. 폭을 움직이지 않고 가려 둔 면을 드러낸다.(`src/shared/ui/button/button.tsx`)
    - `filter` 는 페이지 전환에서 화면이 번지는 연출에 쓴다. 레이아웃을 다시 계산하지 않는다.(2026-11-18 사용자 결정, `src/style/viewTransition.css`)
    - 예외가 1곳 있다. 소개의 경력은 회사를 여닫을 때 프로젝트 목록과 회사 요약의 높이를 움직인다.(2026-11-16 사용자 결정, `src/features/experienceTimeline/ui/ExperienceTimeline.tsx`, `docs/plan/about/README.md` 「모션」)

## 1. 상황별 도구

| 상황                                                   | 도구                             |
| ------------------------------------------------------ | -------------------------------- |
| 컴포넌트 등장·퇴장, hover, 탭 전환, 레이아웃 전환      | framer-motion                    |
| 스크롤 진행에 묶인 연출 (핀 고정, 가로 스크롤, 스크럽) | GSAP + ScrollTrigger             |
| 여러 요소를 정해진 순서로 잇는 긴 시퀀스 (인트로)      | GSAP 타임라인                    |
| 색·배경 같은 단순 hover 전환                           | CSS `transition` + 토큰 유틸리티 |
| 페이지 전환                                            | `<ViewTransition>` + CSS, GSAP   |

**한 요소에 도구 2개를 함께 쓰지 않는다.** 서로 같은 `transform` 을 덮어써서 위치가 순간적으로 바뀐다.

## 2. 토큰

토큰은 아래 2개 파일에 정의하고, 값이 같은지 테스트가 검사한다.

| 파일                                       | 쓰는 곳                |
| ------------------------------------------ | ---------------------- |
| `src/style/tokens/motion.ts`               | framer-motion, GSAP    |
| `src/style/tokens/motion.css`              | Tailwind 유틸리티, CSS |
| `src/style/tokens/__test__/motion.test.ts` | 2개 파일의 값 대조     |

| 축       | 이름                                    |
| -------- | --------------------------------------- |
| 지속시간 | `instant` `fast` `base` `slow` `slower` |
| 가속도   | `enter` `exit` `move`                   |
| 간격     | `tight` `base` `loose` (JS 만)          |
| 스프링   | `follow` (JS 만). 포인터를 따라가는 값  |

- `enter` 는 들어오는 것, `exit` 는 나가는 것, `move` 는 화면 안에서 위치를 옮기는 것이다.
  이름은 Kozipsa Storybook `Foundation/Motion` 의 `enter·exit·move` 를 따랐다.

### 2.1 사용법

```ts
// framer-motion
import { DURATION, EASE } from '@/style/tokens/motion';
const titleVariants = {
    hidden: { opacity: 0, y: 24 },
    shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.enter } },
};
```

```ts
// GSAP — 가속도는 토큰 이름을 문자열로 적는다. shared/util/gsap.ts 가 등록해 둔다
import { gsap, useGSAP } from '@/shared/util/gsap';
gsap.from(el, { y: 24, opacity: 0, duration: DURATION.slow, ease: 'enter' });
```

```tsx
// CSS
<a className="transition-colors duration-fast ease-enter" />
```

**GSAP 은 `gsap` 패키지에서 직접 import 하지 않는다.** `@/shared/util/gsap` 에서 가져온다.
플러그인 등록과 토큰 가속도 등록이 그 파일에서 한 번만 일어난다.

## 3. 동작 줄이기

| 도구          | 처리                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| framer-motion | `_app/Providers.tsx` 의 `<MotionConfig skipAnimations>` 가 모든 값을 최종 상태로 바로 그린다 |
| CSS           | `motion.css` 가 동작 줄이기에서 지속시간 토큰을 `0ms` 로 바꾼다                              |
| GSAP          | 자동으로 처리되지 않는다. `gsap.matchMedia()` 로 분기해 최종 상태만 적용한다                 |

`reducedMotion="user"` 만으로는 transform 만 멈춘다. 선 그리기(`pathLength`)와 `opacity` 는 계속 움직인다.(`src/_app/Providers.tsx`)
`animate()` 함수와 포인터를 따라가는 값은 `MotionConfig` 를 거치지 않는다. `useReducedMotion()` 으로 직접 분기한다.(`src/features/about/ui/CountUp.tsx` · `src/features/hero/ui/HeroIntro.tsx`)

**GSAP 코드는 모두 `gsap.matchMedia()` 안에서 만든다.**

```ts
useGSAP(
    () => {
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            /* 연출 */
        });
    },
    { scope: rootRef },
);
```

페이지 전환의 시간은 `src/style/viewTransition.css` 위쪽의 전용 변수(`--page-cover-duration` · `--page-uncover-duration`)가 정하고, GSAP 도 그 값을 읽는다.(`src/widgets/pageTransition/PageTransition.tsx`) 동작 줄이기에서는 그 파일이 두 값을 `0ms` 로 되돌리고 붓질은 그리지 않는다.
화면 전환을 지원하지 않는 브라우저에서도 연출 없이 바로 바뀐다.

e2e 는 `reduced-motion` 프로젝트로 같은 화면을 한 번 더 실행한다.(`playwright.config.ts`)

## 4. 성능

- **GSAP 은 `useGSAP` 안에서만 만든다.** 언마운트 때 트윈과 ScrollTrigger 를 정리해 준다.
- **스크롤 이벤트를 직접 듣지 않는다.** framer-motion `useScroll` 이나 ScrollTrigger 를 쓴다.
- **움직이는 요소가 레이아웃을 밀지 않게 한다.** 등장 전에 크기를 미리 확보해 CLS 가 생기지 않게 한다.

## 금지사항

| 금지                                    | 대신                                | 근거                                                   |
| --------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `duration: 0.6` · `ease: 'power2.out'`  | `DURATION.*` · `EASE.*` · `'enter'` | 값의 근거가 남지 않고 화면마다 속도가 달라진다         |
| `duration-300` · `ease-[…]`             | `duration-base` · `ease-enter`      | 같은 이유. theme.md 원칙 3                             |
| `import { gsap } from 'gsap'`           | `@/shared/util/gsap`                | 플러그인과 가속도가 등록되지 않는다                    |
| `useEffect` 안에서 GSAP 생성            | `useGSAP`                           | 정리가 빠져 라우트 이동 뒤에도 ScrollTrigger 가 남는다 |
| `matchMedia` 분기 없는 GSAP             | `gsap.matchMedia()`                 | 동작 줄이기 사용자에게도 움직인다                      |
| `width` · `top` 애니메이션              | `scale` · `x` · `y` · `clip-path`   | 매 프레임 레이아웃을 다시 계산한다                     |
| 한 요소를 framer-motion 과 GSAP 이 함께 | 한 도구만                           | 같은 transform 을 덮어써 위치가 순간적으로 바뀐다      |

## 미정리 항목

- 모션 목록은 `docs/plan/home/README.md` 와 `docs/plan/about/README.md` 의 「모션」 표다. 헤더와 배경의 모션은 홈의 표에 있다.
- 원칙 4 의 예외가 1곳 있다. 소개 경력의 높이 전환이다.
- 원칙 1 과 2 의 예외가 1곳 더 있다. 페이지 전환이다. 칠하는 시간(900ms)과 지우는 시간(900ms)을 지속시간 토큰이 아닌 값으로 `src/style/viewTransition.css` 에 적었다.
- 원칙 1 과 2 의 예외가 1곳 있다. 로더의 회전이다. 한 바퀴의 시간(1초 · 2초 · 4초)을 지속시간 토큰이 아닌 값으로 `src/style/tokens/motion.css` 에 적었다.

## 확인방법

```bash
# 토큰 값 대조. 기대: 통과
pnpm test src/style/tokens

# 숫자 지속시간·가속도 문자열. 기대: 출력 없음
grep -rnE "duration:\s*[0-9]|ease:\s*['\"\[](?!enter|exit|move)" src --include="*.ts" --include="*.tsx" -P | grep -v "src/style/tokens/"

# gsap 직접 import. 기대: shared/util/gsap.ts 만
grep -rln "from 'gsap" src | grep -v "src/shared/util/gsap.ts"
```
