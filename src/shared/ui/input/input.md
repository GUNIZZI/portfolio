# Input

한 줄 입력이다. shadcn 의 Input 을 바탕으로 했고, 입력만 그린다.(`input.tsx`, 2026-11-17 사용자 결정)
이름과 오류 문구는 Field 로 붙인다.(`src/shared/ui/field/field.md`)

| prop          | 값                                                                                     | 기본 |
| ------------- | -------------------------------------------------------------------------------------- | ---- |
| `size`        | 높이(px). `2xs`(24) · `xs`(28) · `sm`(36) · `md`(44) · `lg`(48) · `xl`(56) · `2xl`(64) | `sm` |
| `beforeLabel` | 입력칸 안쪽, 값의 앞에 붙는 글자. `https://` 같은 머리말                               |      |
| `afterLabel`  | 입력칸 안쪽, 값의 뒤에 붙는 글자. 원 · 개 같은 단위                                    |      |

그 밖에는 `<input>` 의 속성을 그대로 받는다. `className` 은 입력에 붙는다.

```tsx
import { Input } from '@/shared/ui/input/input';

<Input name="email" type="email" size="md" placeholder="이메일" />;
<Input type="number" afterLabel="년" />;
<Input beforeLabel="https://" placeholder="example.com" />;
```

- 높이와 글자 크기는 버튼과 함께 쓰는 눈금에서 읽는다. 같은 `size` 의 Button 과 높이가 같다.(`src/shared/ui/size/size.constants.ts`)
- 기본은 `sm` 이다. 관리 화면의 소개 수정 폼이 `sm` 을, 로그인 폼이 `md` 를 쓴다.(2026-11-17 사용자 결정)
- `<input>` 의 `size` 속성(글자 수로 정하는 폭)은 받지 않는다. 같은 이름을 크기 단계로 쓴다.(`input.tsx` 의 `InputProps`)
- `aria-invalid` 를 주면 테두리가 `destructive` 로 바뀐다.(`input.tsx`)
- `beforeLabel` · `afterLabel` 은 Kozipsa 의 Input 에서 가져왔다.(Kozipsa `packages/ui` 의 `input.md` 2절) 입력의 이름이 아니라 단위 표기다. 이름은 `FieldLabel` 로 붙인다.
- 둘 중 하나라도 주면 상자(`div`)가 입력의 모양을 입고, `className` 도 상자에 붙는다. 상자를 누르면 입력에 초점이 간다.(`input.tsx`)
- 붙는 글자의 색은 입력 글자색의 30% 다.(2026-11-17 사용자 결정, `input.tsx` 의 `ADORNMENT_CLASS`)
- 붙는 글자의 크기는 `size` 와 상관없이 `text-xs`(12px)다. `2xs` 일 때만 입력과 같은 11px 이다.(2026-11-17 사용자 결정, `input.tsx`)
- 누르는 동작을 다루어 클라이언트 컴포넌트다.(`input.tsx`)

## 자주 하는 실수

- 이름 없이 쓰는 입력에는 `aria-label` 을 준다. `placeholder` 는 값을 적으면 사라진다.(`src/features/aboutEditor/ui/ChipListField.tsx`)

## 이 컴포넌트를 고칠 때

테두리 · 바탕 · 오류 색을 바꾸면 Textarea 도 함께 바꾼다. 두 컴포넌트가 같은 폼에 나란히 놓인다.(`src/features/aboutEditor/`)
