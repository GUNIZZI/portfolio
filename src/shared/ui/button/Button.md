# Button

버튼 모양의 링크다. `<a>` 로 렌더한다. 페이지 안 이동과 `mailto:` 에 쓴다.

| prop     | 값                                              | 기본     |
| -------- | ----------------------------------------------- | -------- |
| `intent` | `accent` · `brand` · `outline` · `outlineBrand` | `accent` |
| `size`   | `md`(높이 44) · `lg`(높이 48)                   | `lg`     |
| `href`   | 이동할 곳. 필수                                 |          |

아이콘은 자식으로 넣는다. 간격은 버튼에 정해져 있다.

```tsx
<Button href="#projects">
    View My Projects
    <Icon name="arrowRight" size={18} strokeWidth={2.2} />
</Button>
```

## 자주 하는 실수

- 폼 제출에 쓰면 안 된다. 이 컴포넌트는 링크다. 제출 버튼이 필요하면 `<button>` 변형을 새로 만든다.

## 이 컴포넌트를 고칠 때

변형 이름과 높이를 바꾸면 위 표와 `docs/design.md` 1절의 쓰는 곳을 함께 고친다.
