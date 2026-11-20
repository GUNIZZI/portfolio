# Switch

켜고 끄는 스위치다. Kozipsa 의 Switch 를 가져왔다.(`switch.tsx`, Kozipsa `packages/ui` 의 `custom/switch` 에서 가져옴, 2026-11-18 사용자 결정)
관리 화면의 경력 폼이 「재직 중」 에, 프로젝트 목록과 폼이 「공개」 · 「홈 노출」 에 쓴다.(`src/features/experienceEditor/ui/ExperienceForm.tsx`, `src/features/projectEditor/ui/ProjectList.tsx` · `ProjectForm.tsx`)

| prop              | 값                                                                      | 기본   |
| ----------------- | ----------------------------------------------------------------------- | ------ |
| `checked`         | 켜져 있는가                                                             |        |
| `onCheckedChange` | 누르면 뒤집은 값으로 부른다                                             |        |
| `size`            | 트랙의 높이(px). `xs`(14) · `sm`(16) · `base`(18) · `lg`(20) · `xl`(24) | `base` |
| `disabled`        | 누를 수 없다                                                            |        |

그 밖에는 Radix Switch 의 속성을 그대로 받는다.

```tsx
import { Switch } from '@/shared/ui/switch/switch';

<label htmlFor={id}>재직 중</label>
<Switch id={id} checked={isCurrent} onCheckedChange={setIsCurrent} />
```

- 켜지면 트랙이 `primary`, 꺼지면 `input` 이다.(`switch.tsx` 의 `switchVariants`)
- 손잡이는 `duration-fast` · `ease-move` 로 옮겨 간다. 동작 줄이기에서는 바로 옮겨 간다.(`switch.tsx`, `docs/motion.md` 3절)
- 비활성이면 스위치 전체가 `opacity-disabled` 로 흐려진다. 켜짐과 꺼짐의 색은 그대로 남는다.(`switch.tsx`, `docs/theme.md` 4절)

## 자주 하는 실수

- 이름 없이 두면 보조 기술이 무엇을 켜는지 읽지 못한다. `<label htmlFor>` 로 잇거나 `aria-label` 을 준다.(`__test__/switch.test.tsx`)

## Kozipsa 와 다른 점

- `variant` 를 가져오지 않았다. 쓰는 곳이 없다.(`switch.tsx`)
- 꺼진 손잡이는 `strong` 이다. Kozipsa 는 `card` 를 쓰고 다크에서만 `dark:` 로 뒤집는다. 이 사이트는 `dark:` 로 색을 나누지 않는다.(`docs/theme.md` 원칙 4)

## 이 컴포넌트를 고칠 때

크기를 더하면 `switchVariants` · `switchThumbVariants` 2곳에 같은 이름을 넣는다. 손잡이는 트랙의 높이보다 2px 작다.(`switch.tsx`)
