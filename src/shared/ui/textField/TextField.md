# TextField

이름 · 입력 · 오류 문구를 한 묶음으로 그린다. `Field` · `Input` · `Textarea` 를 감싼 것이다.(`TextField.tsx`)
소개와 경력 관리 화면의 글 입력이 모두 이 모양이다. 두 화면이 함께 쓰게 되어 `features/aboutEditor` 에서 올렸다.(2026-11-18 사용자 결정, `src/features/aboutEditor/` · `src/features/experienceEditor/`)

| prop             | 값                                                | 기본    |
| ---------------- | ------------------------------------------------- | ------- |
| `label`          | 입력 위에 적는 이름. `label` 로 입력에 잇는다     |         |
| `error`          | 오류 문구. 있으면 입력 아래에 적는다              |         |
| `isMultiline`    | 여러 줄 입력(`Textarea`)으로 그린다               | `false` |
| `className`      | 이름 · 입력 · 오류 문구를 묶은 바깥 요소에 붙는다 |         |
| `inputClassName` | 입력에 붙는다. 글자 정렬에 쓴다                   |         |

그 밖의 속성은 `Input` 이나 `Textarea` 에 그대로 넘긴다. `size` · `afterLabel` 도 그렇다.(`src/shared/ui/input/input.tsx`)

```tsx
import TextField from '@/shared/ui/textField/TextField';

<TextField label="회사" value={company} onChange={hndlChange} error={error} />
<TextField isMultiline label="요약" value={summary} onChange={hndlChange} />
```

- 오류 문구가 있으면 이름과 테두리가 `destructive` 로 바뀐다. `Field` 의 `data-invalid` 와 입력의 `aria-invalid` 를 함께 준다.(`src/shared/ui/field/field.md`)
- `id` 를 주지 않으면 스스로 만들어 이름과 입력을 잇는다.(`TextField.tsx`)
- `react-hook-form` 의 `register` 가 주는 속성을 그대로 펼쳐 넣는다. `ref` 까지 입력에 닿는다. `error` 에는 스키마가 낸 문구를 넣는다.(`src/features/experienceEditor/ui/ExperienceForm.tsx`, `docs/architecture.md` 4.3절)

## 자주 하는 실수

- 글자를 오른쪽에 붙이려면 `className` 이 아니라 `inputClassName="text-right"` 를 준다. `className` 은 바깥 묶음에 붙고, 입력은 글자 정렬을 물려받지 않는다.(`TextField.tsx`, `src/features/experienceEditor/ui/ExperienceForm.tsx`)
- `label` 없이 `afterLabel` 만 쓰는 입력에는 `aria-label` 을 준다. `afterLabel` 은 입력의 이름이 되지 못한다.(`src/shared/ui/input/input.md`, `src/features/experienceEditor/ui/ProjectRow.tsx`)
