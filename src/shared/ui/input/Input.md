# Input

이름이 붙은 한 줄 입력이다. 관리 화면의 폼이 쓴다.(`docs/plan/admin/README.md` 요구사항 7)

| prop    | 값                                                   | 기본 |
| ------- | ---------------------------------------------------- | ---- |
| `label` | 입력 위에 적는 이름. 필수(`Input.tsx` 의 `OwnProps`) |      |
| `error` | 오류 문구. 있으면 입력 아래에 그린다.                |      |

그 밖에는 `<input>` 의 속성을 그대로 받는다. `className` 은 이름과 입력을 묶은 바깥 요소에 붙는다.

```tsx
<Input label="이메일" name="email" type="email" autoComplete="username" required />
```

- 이름은 `label` 로 입력에 잇는다. `id` 를 주지 않으면 스스로 만든다.
- 오류 문구는 `aria-describedby` 로 입력에 잇고, 입력에 `aria-invalid` 를 단다.(`docs/plan/admin/README.md` 「접근성 · 성능 고려」)
- 높이는 48px 이다. Button 의 `lg` 와 같다.(`src/shared/ui/button/Button.tsx`)

## 자주 하는 실수

- `placeholder` 로 이름을 대신하지 않는다. 입력마다 `label` 을 잇기로 했다.(`docs/plan/admin/README.md` 「접근성 · 성능 고려」)

## 이 컴포넌트를 고칠 때

오류 색은 `accent` 를 쓴다. 오류 전용 색 토큰이 없다.(`src/style/tokens/color.css`)
토큰을 더하면 테두리와 문구의 색을 함께 바꾼다.
