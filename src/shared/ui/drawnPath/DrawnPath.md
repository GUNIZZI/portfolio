# DrawnPath

손으로 긋듯 처음부터 끝까지 그려지는 SVG 선이다. `<svg>` 안에 `<path>` 대신 둔다.
히어로의 왕관 · 번개 · 이름 밑줄, 섹션 제목 밑줄, 연락 제목 밑줄이 쓴다.

| prop             | 값                             | 기본     |
| ---------------- | ------------------------------ | -------- |
| `d`              | 선의 모양                      | 필수     |
| `className`      | 선 색(`stroke-accent` 처럼)    | 없음     |
| `strokeWidth`    | 선 굵기                        | 필수     |
| `strokeLinecap`  | 선 끝 모양                     | 없음     |
| `strokeLinejoin` | 꺾이는 곳 모양                 | 없음     |
| `trigger`        | `inView` · `parent`. 시작 계기 | `inView` |

```tsx
<svg viewBox="0 0 200 12" aria-hidden="true">
    <DrawnPath d="M3 8 C 60 3, 130 2, 197 5" className="stroke-accent" strokeWidth={6} />
</svg>
```

- `inView` 는 화면에 처음 들어올 때 한 번 그린다.
- `parent` 는 부모 motion 요소의 `hidden` → `shown` 을 따른다. 히어로 등장 연출이 이렇게 쓴다.(`src/features/hero/ui/HeroIntro.tsx`)

## 자주 하는 실수

- 면을 칠하는 path 에는 쓰지 않는다. 선 길이를 움직이는 연출이라 `fill` 은 항상 `none` 이다.
- 선이 여러 조각(`m`)으로 끊긴 path 는 조각이 동시에 그려진다.

## 이 컴포넌트를 고칠 때

지속시간과 가속도는 `DURATION.slow` · `EASE.enter` 다.(`docs/plan/home/README.md` 「모션」 표)
동작 줄이기에서는 `_app/Providers.tsx` 의 `skipAnimations` 가 다 그려진 상태로 바로 그린다.
