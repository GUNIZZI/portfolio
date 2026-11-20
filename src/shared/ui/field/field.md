# Field

입력에 이름 · 설명 · 오류 문구를 붙이는 묶음이다. shadcn 의 Field 를 바탕으로 했고, 구조와 이름은 shadcn 그대로다.(`field.tsx`, 2026-11-17 사용자 결정)

| 컴포넌트                      | 역할                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `Field`                       | 입력 하나의 묶음. `orientation` 으로 세로 · 가로 · 폭에 따라 바뀌는 배치(`responsive`)를 고른다 |
| `FieldLabel`                  | 입력의 이름. `htmlFor` 로 입력에 잇는다                                                         |
| `FieldDescription`            | 입력 아래의 설명                                                                                |
| `FieldError`                  | 오류 문구. 내용이 없으면 그리지 않는다                                                          |
| `FieldGroup`                  | 여러 `Field` 를 세로로 쌓는다                                                                   |
| `FieldSet` · `FieldLegend`    | 관련된 입력을 `<fieldset>` 으로 묶고 이름을 붙인다                                              |
| `FieldContent` · `FieldTitle` | 가로 배치에서 이름과 설명을 한쪽에 모은다                                                       |
| `FieldSeparator`              | 묶음 사이의 구분선                                                                              |

```tsx
import { Field, FieldError, FieldLabel } from '@/shared/ui/field/field';
import { Input } from '@/shared/ui/input/input';

<Field data-invalid={error ? true : undefined}>
    <FieldLabel htmlFor={id}>이름</FieldLabel>
    <Input id={id} aria-invalid={error ? true : undefined} value={name} onChange={hndlChange} />
    <FieldError>{error}</FieldError>
</Field>;
```

- 오류일 때는 `Field` 에 `data-invalid` 를, 입력에 `aria-invalid` 를 함께 준다. 이름과 테두리가 `destructive` 로 바뀐다.(`field.tsx`, `src/shared/ui/input/input.tsx`)
- `FieldError` 는 `role="alert"` 라 문구가 생기면 스크린 리더가 읽는다.(`field.tsx`)
- 관리 화면의 폼은 이 묶음을 `TextField` 로 한 번 감싸 쓴다.(`src/shared/ui/textField/TextField.tsx`)

## shadcn 원본과 다른 점

- 비활성은 숫자 불투명도 대신 `opacity-disabled` 로 흐리게 한다.(`docs/theme.md` 4절)
- 다크 전용 분기를 뺐다. `dark:` 로 색을 나누지 않는다.(`docs/theme.md` 원칙 4)
- 글자 크기는 `text-caption`, 이름과 입력의 간격은 8px 이다. 바꾸기 전의 입력과 같다.(`field.tsx`)
