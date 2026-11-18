# Textarea

여러 줄 입력이다. shadcn 의 Textarea 를 바탕으로 했고, 입력만 그린다. 모양은 Input 과 같다.(`textarea.tsx`, 2026-11-17 사용자 결정)
이름과 오류 문구는 Field 로 붙인다.(`src/shared/ui/field/field.md`)

| prop   | 값                                                                               | 기본 |
| ------ | -------------------------------------------------------------------------------- | ---- |
| `size` | `2xs` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl`. 글자 크기와 안쪽 여백이 바뀐다 | `sm` |
| `rows` | 가장 낮은 높이의 줄 수. 내용이 이보다 길면 늘어난다                              | 3    |

그 밖에는 `<textarea>` 의 속성을 그대로 받는다. `className` 은 입력에 붙는다.

```tsx
import { Textarea } from '@/shared/ui/textarea/textarea';

<Textarea value={description} onChange={hndlChange} />;
```

- 글자 크기는 Input 과 같은 눈금에서 읽는다. 높이는 `rows` 가 정해 눈금을 타지 않는다.(`src/shared/ui/size/size.constants.ts`)
- **높이는 내용만큼 늘어난다.** CSS 의 `field-sizing: content` 를 쓴다. 처음에는 `rows` 줄이고, 그보다 길어지면 늘어난다.(`textarea.tsx`, 2026-11-18 사용자 결정)
- 손으로 끌어 크기를 바꾸지 못한다.(`textarea.tsx` 의 `resize-none`, 2026-11-18 사용자 결정)
- Firefox 는 `field-sizing` 을 몰라 `rows` 줄로 고정되고 안에서 스크롤한다.(`textarea.tsx`)
- `aria-invalid` 를 주면 테두리가 `destructive` 로 바뀐다.(`textarea.tsx`)

## 자주 하는 실수

- 한 줄짜리 값에는 Input 을 쓴다. 줄을 바꿀 일이 있는 값에만 이 컴포넌트를 쓴다.(`src/shared/ui/input/input.md`)

## 이 컴포넌트를 고칠 때

`size` 의 위아래 여백(`py-*`)을 바꾸면 같은 줄의 `min-h` 도 함께 고친다. 가장 낮은 높이가 줄 수 · 여백 · 테두리의 합이다.(`textarea.tsx` 의 `textareaVariants`)
테두리 · 바탕 · 오류 색을 바꾸면 Input 도 함께 바꾼다. 두 컴포넌트가 같은 폼에 나란히 놓인다.(`src/features/aboutEditor/`)
