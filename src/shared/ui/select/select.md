# Select

정해진 목록에서 하나를 고르는 입력이다. Kozipsa 의 Select 를 가져왔다.(`select.tsx`, Kozipsa `packages/ui` 의 `custom/select` 에서 가져옴, 2026-11-18 사용자 결정)
`list` · `value` · `onChange` · `placeholder` 의 이름과 동작은 Kozipsa 와 같다.
관리 화면의 경력 폼이 프로젝트 연결에, 프로젝트 폼이 분류와 맡은 범위에 쓴다.(`src/features/experienceEditor/ui/ProjectRow.tsx`, `src/features/projectEditor/ui/ProjectForm.tsx` · `DetailFields.tsx`)

| prop          | 값                                                                                     | 기본       |
| ------------- | -------------------------------------------------------------------------------------- | ---------- |
| `list`        | 고를 수 있는 항목. 아래 「목록」 절                                                    |            |
| `value`       | 고른 항목의 `code`. 고르지 않았으면 빈 문자열이나 `undefined`                          |            |
| `onChange`    | 항목을 고르면 그 `code` 로 부른다                                                      |            |
| `placeholder` | 고르지 않았을 때 보이는 글자                                                           | `선택없음` |
| `beforeLabel` | 트리거 안쪽, 값의 앞에 붙는 글자                                                       |            |
| `afterLabel`  | 트리거 안쪽, 값의 뒤에 붙는 글자                                                       |            |
| `size`        | 높이(px). `2xs`(24) · `xs`(28) · `sm`(36) · `md`(44) · `lg`(48) · `xl`(56) · `2xl`(64) | `sm`       |
| `disabled`    | 고를 수 없다                                                                           | `false`    |
| `className`   | 트리거에 붙는다. 폭을 정할 때 쓴다                                                     |            |

그 밖에 `id` · `aria-label` · `aria-describedby` · `aria-invalid` 를 받아 트리거에 붙인다.

```tsx
import { Select } from '@/shared/ui/select/select';

<Select
    aria-label="상태"
    list={[
        { code: 'Y', name: '사용' },
        { code: 'N', name: '사용 안 함' },
    ]}
    value={status}
    onChange={setStatus}
    placeholder="상태를 고르세요"
/>;
```

- 트리거는 Input 의 모양과 크기 눈금을 그대로 입는다. 같은 `size` 의 Input · Button 과 높이가 같다.(`select.base.tsx`, `src/shared/ui/size/size.constants.ts`)
- 목록이 열려 있는 동안 트리거에 포커스와 같은 테두리를 두른다. 포커스가 목록 안으로 옮겨 가 어느 칸이 열렸는지 보이지 않기 때문이다.(`select.base.tsx`, Kozipsa `select.md` 7절)
- 목록이 나타나고 사라지는 연출은 없다. 관리 화면에는 연출을 두지 않는다.(`docs/plan/admin/README.md` 「모션」)
- 목록의 층은 `z-overlay` 다.(`docs/theme.md` 3절)

## 폴더에 파일이 2개다

| 파일              | 내용                                               |
| ----------------- | -------------------------------------------------- |
| `select.base.tsx` | shadcn 의 Select 부품. Radix Select 를 감싼다      |
| `select.tsx`      | 화면이 쓰는 `Select`. 부품을 감싸 `list` 를 받는다 |

화면에서는 `select.tsx` 의 `Select` 를 쓴다. `select.base.tsx` 를 바로 쓰면 `list` 와 「매칭 없음」 이 빠진다.(Kozipsa `select.md` 1절)

## 목록

`list` 는 2가지 모양을 받는다. `code` 가 값이고 `name` 이 화면에 보이는 이름이다.(`select.tsx` 의 `SelectOption` · `SelectOptionGroup`)

```tsx
// 그대로 늘어놓은 목록
list={[{ code: 'Y', name: '사용' }]}

// 묶은 목록
list={[{ label: '서초구', options: [{ code: 'A', name: '래미안 원베일리' }] }]}
```

- 항목에 `disabled` 를 주면 목록에 남지만 고를 수 없다. 묶음에 주면 그 묶음 전체를 고를 수 없다.
- 묶음 사이에는 선이 들어간다.
- **`list` 가 비어 있으면 스스로 비활성이 된다.** 따로 `disabled` 를 주지 않아도 된다.(`select.tsx`)
- 이름이 트리거의 폭을 넘으면 말줄임한다.(`select.tsx`)

## 값이 목록에 없으면 「매칭 없음」

`value` 가 `list` 에 없으면 트리거에 `매칭 없음` 이 뜨고, `placeholder` 로 되돌아가지 않는다.(`select.tsx` 의 `UNMATCHED_TEXT`)
값이 없는 것과 값이 있는데 찾지 못한 것은 원인이 다르다.(Kozipsa `select.md` 6.1절)

## 자주 하는 실수

- `code` 에 빈 문자열을 쓰지 않는다. Radix 는 빈 값을 「고르지 않음」 으로 쓴다. 고른 것을 비우는 항목이 필요하면 쓰는 쪽이 따로 정한 값을 넣고, 그 값이 오면 `value` 를 빈 문자열로 되돌린다.(`src/features/experienceEditor/ui/ProjectRow.tsx` 의 `UNLINKED_CODE`)
- `beforeLabel` · `afterLabel` 은 입력의 이름이 아니다. 이름은 `aria-label` 이나 `FieldLabel` 로 준다. 모양은 Input 의 붙는 글자와 같다.(`src/shared/ui/input/input.tsx` 의 `ADORNMENT_CLASS`)
- 이름 없이 쓰는 셀렉트에는 `aria-label` 을 준다. 이름이 화면에 있으면 `id` 와 `FieldLabel` 로 잇는다.(`src/shared/ui/field/field.md`)

## Kozipsa 와 다른 점

- `multiple` · `variant` · `loading` · `readonly` 는 가져오지 않았다. 쓰는 곳이 없다.(`select.tsx`)
- 값의 뒤에 붙는 글자는 `afterLabel` 이다. Kozipsa 는 `label` 이라고 부른다. Input 과 이름을 맞췄다.(`src/shared/ui/input/input.md`)
- `code` 는 문자열만 받는다. Kozipsa 는 숫자도 받는다.(`select.tsx` 의 `SelectOption`)
- `name` 은 문자열만 받는다. Kozipsa 는 JSX 도 받는다.
- 크기는 이 사이트의 눈금(`2xs` ~ `2xl`)이다. Kozipsa 는 `xs` ~ `xl` 이다.(`src/shared/ui/size/size.constants.ts`)
- 화살표는 lucide 의 `ChevronDown` 이다. Kozipsa 는 자체 아이콘(`SelectArrow`)을 쓴다.(`select.base.tsx`)

## 이 컴포넌트를 고칠 때

테두리 · 바탕 · 오류 색은 `inputVariants` 에서 온다. Input 을 고치면 Select 도 함께 바뀐다.(`src/shared/ui/input/input.tsx`)
Radix 의 Select 를 여는 테스트는 jsdom 에 없는 `hasPointerCapture` · `scrollIntoView` 를 채워야 한다.(`__test__/select.test.tsx`)
