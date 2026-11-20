# Label

입력의 이름이다. shadcn 의 Label 을 바탕으로 했다.(`label.tsx`, 2026-11-17 사용자 결정)
폼에서는 이 컴포넌트를 바로 쓰기보다 `FieldLabel` 을 쓴다.(`src/shared/ui/field/field.md`)

```tsx
import { Label } from '@/shared/ui/label/label';

<Label htmlFor="email">이메일</Label>;
```

- 글자는 `text-caption` · `muted-foreground` 다. 바꾸기 전 입력의 이름과 같다.(`label.tsx`)
- 비활성은 `opacity-disabled` 로 흐리게 한다. 입력과 같은 값이다.(`docs/theme.md` 4절)
