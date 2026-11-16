# Doodle

붓과 스프레이로 그린 거리 낙서 하나다. 페이지 배경(`widgets/backdrop`)에 놓는다.
페이지마다 자기 낙서를 따로 갖는다.(2026-11-16 사용자 결정) 홈은 `features/homeDoodles`, 소개는 `features/aboutDoodles` 가 쓴다.

| prop        | 값                                                         | 기본 |
| ----------- | ---------------------------------------------------------- | ---- |
| `shape`     | `DoodleShape`(`doodle.constants.ts` 의 `DOODLE_SHAPES` 키) |      |
| `tone`      | `quiet` · `sky` · `violet` · `yellow`                      |      |
| `lag`       | 본문보다 뒤처지는 비율. 음수면 본문보다 빠르다             | 0    |
| `className` | 자리 · 크기 · 기울기                                       | 없음 |

```tsx
<Backdrop>
    <Doodle shape="star" tone="yellow" lag={0.2} className="top-28 left-[45%] w-9 rotate-12" />
</Backdrop>
```

같은 폴더의 `DoodleFilter` 는 붓 질감을 입히는 SVG 필터다. `Backdrop` 이 한 번 넣는다.

## 자주 하는 실수

- `Backdrop` 밖에 두지 않는다. 필터(`DoodleFilter`)와 스크롤 시차가 `Backdrop` 안에서만 걸린다.
- 글 가까이에는 `quiet` 를 쓴다. 나머지 색은 본문과 떨어진 자리나 반투명 패널 뒤에 쓴다.

## 이 컴포넌트를 고칠 때

`data-drift` 와 `data-lag` 속성은 `src/widgets/backdrop/Backdrop.tsx` 가 읽는다. 이름을 바꾸면 함께 고친다.
모양을 더하려면 `DOODLE_SHAPES` 에 한 항목을 더한다. 48×48 칸에 굵은 획(`d`) · 흘러내린 자국(`drips`) · 방울(`dots`)로 그린다.
