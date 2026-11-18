# ThemeToggle

다크와 라이트를 바꾸는 아이콘 버튼이다. 공개 헤더와 관리 헤더가 함께 쓴다.(2026-11-18 사용자 결정)
다크에서는 해, 라이트에서는 달을 보여 준다. 고른 테마는 `next-themes` 가 `localStorage` 에 저장한다.(`src/_app/Providers.tsx`)

| prop        | 값                                                  |
| ----------- | --------------------------------------------------- |
| `effect`    | 테마를 바꿀 때의 연출. `fadeSlideUp`(기본) · `none` |
| `className` | 놓이는 자리에 맞춰 크기 · 여백을 준다               |

## 연출

누르면 바뀐 테마의 아이콘이 아래에서 올라오며 나타난다.(2026-11-18 사용자 결정, `ThemeToggle.tsx` 의 `fadeSlideUpVariants`)
페이지를 처음 그릴 때는 움직이지 않는다. 동작 줄이기에서는 바로 바뀐다.(`docs/motion.md` 3절)
관리 화면은 `effect="none"` 으로 쓴다. 관리 화면에는 연출을 두지 않는다.(`docs/plan/admin/dashboard/README.md` 「모션」)

## 자주 하는 실수

- `useTheme` 의 값으로 아이콘을 고르면 하이드레이션 경고가 뜬다. 서버는 방문자가 고른 테마를 알지 못한다.
  아이콘 2개를 모두 그리고 `theme-light:` 변형으로 하나만 보인다.(`ThemeToggle.tsx`)

## 이 컴포넌트를 고칠 때

`theme-light:` 변형은 `src/style/tokens/color.css` 에 정의돼 있다.
처음 방문 때의 테마와 저장 방식은 `src/_app/Providers.tsx` 의 `ThemeProvider` 가 정한다.
