# Separator

구분선이다. shadcn 의 Separator 그대로이고, 색만 이 사이트의 구분선 색이다.(`separator.tsx`, 2026-11-17 사용자 결정)

| prop          | 값                                                      | 기본         |
| ------------- | ------------------------------------------------------- | ------------ |
| `orientation` | `horizontal` · `vertical`                               | `horizontal` |
| `decorative`  | 꾸밈일 뿐인지. `false` 면 보조 기술이 구분선으로 읽는다 | `true`       |

```tsx
import { Separator } from '@/shared/ui/separator/separator';

<Separator />
<Separator orientation="vertical" />
```

- 색은 `line` 이다. shadcn 원본의 `border` 대신 썼다. `border-line` 으로 그은 구분선과 색이 같다.(`src/features/aboutEditor/ui/SectionShell.tsx`)
- 가로 선은 폭을, 세로 선은 높이를 부모에 맞춘다. 세로 선은 부모에 높이가 있어야 보인다.(`separator.tsx`)
- Radix 를 쓰는 클라이언트 컴포넌트다.(`separator.tsx`)
