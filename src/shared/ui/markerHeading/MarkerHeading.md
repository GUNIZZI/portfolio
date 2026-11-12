# MarkerHeading

마커 폰트로 쓴 섹션 제목(`h2`)과 그 아래 손으로 그은 밑줄이다.

| prop                 | 값                                   | 기본     |
| -------------------- | ------------------------------------ | -------- |
| `underline`          | `accent` · `brand`. 없으면 안 그린다 | 없음     |
| `underlineClassName` | 밑줄 길이(`w-37.5` 처럼)             | `w-42.5` |

```tsx
<MarkerHeading underline="accent" underlineClassName="w-37.5">
    MY SKILLS
</MarkerHeading>
```

## 자주 하는 실수

- 히어로 이름이나 연락 제목에는 쓰지 않는다. 그 2개는 크기와 기울기가 달라 각 섹션이 직접 그린다.

## 이 컴포넌트를 고칠 때

밑줄 모양은 디자인 원본(`sample/`)의 SVG path 다. 바꾸면 섹션 제목 3개가 함께 바뀐다.
