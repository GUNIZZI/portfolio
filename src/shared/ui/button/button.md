# Button

버튼이다. shadcn 의 Button 을 바탕으로 했다. `variant` · `asChild` 는 shadcn 과 같고, 모양과 `size` · `effect` 는 이 사이트의 것이다.(`button.tsx`, 2026-11-17 사용자 결정)
링크로 그릴 때는 `asChild` 를 주고 `<a>` 를 자식으로 넣는다. 링크는 페이지 안 이동과 `mailto:` 에, `<button>` 은 폼 제출과 동작에 쓴다.

| prop      | 값                                                                                                                | 기본      |
| --------- | ----------------------------------------------------------------------------------------------------------------- | --------- |
| `variant` | `default` · `secondary` · `destructive` · `outline` · `outlineSlim` · `ghost` · `link` · `brand` · `outlineBrand` | `default` |
| `size`    | 높이(px). `2xs`(24) · `xs`(28) · `sm`(36) · `md`(44) · `lg`(48) · `xl`(56) · `2xl`(64)                            | `lg`      |
| `asChild` | 버튼 대신 자식 요소를 버튼 모양으로 그린다                                                                        | `false`   |
| `effect`  | `sweep`(연출) · `none`(색만 바로 바뀜)                                                                            | `sweep`   |
| `type`    | `<button>` 의 `type` 그대로                                                                                       | `button`  |

높이와 글자 크기는 입력과 함께 쓰는 눈금에서 읽는다.(`src/shared/ui/size/size.constants.ts`)
같은 `size` 의 Input 과 높이가 같다.(`src/shared/ui/input/input.tsx`)

커서는 손가락 모양이다. Tailwind 4 는 `<button>` 의 커서를 화살표로 두어 버튼에서 따로 준다.(`button.tsx`, 2026-11-17 사용자 결정)

아이콘은 자식으로 넣는다. 간격은 버튼에 정해져 있다.

```tsx
import { Button } from '@/shared/ui/button/button';

<Button asChild>
    <a href="#projects">
        View My Projects
        <Icon name="arrowRight" size={18} strokeWidth={2.2} />
    </a>
</Button>

<Button type="submit" variant="secondary" size="sm" effect="none">
    저장
</Button>
```

## variant

`default` · `secondary` · `destructive` · `outline` · `ghost` · `link` 는 shadcn 의 이름이다. `outlineSlim` · `brand` · `outlineBrand` 는 이 사이트에서 더했다.(`button.tsx`)

| `variant`      | 평소                             | 덮는 색과 글자                          |
| -------------- | -------------------------------- | --------------------------------------- |
| `default`      | `primary`(연두) 바탕             | `strong`(흰색) 바탕, 글자 그대로        |
| `secondary`    | `secondary` 바탕, 밝은 글자      | `strong` 바탕, 어두운 글자              |
| `destructive`  | 얇은(1px) 붉은 테두리, 붉은 글자 | `destructive`(붉은색) 바탕, 어두운 글자 |
| `outline`      | 흰 테두리(2px)                   | `strong` 바탕, 어두운 글자              |
| `outlineSlim`  | 얇은(1px) 흰 테두리              | `strong` 바탕, 어두운 글자              |
| `ghost`        | 면이 없다                        | `accent`(옅은 면) 바탕, 글자 그대로     |
| `link`         | 연두 글자. 면이 없다             | 밑줄                                    |
| `brand`        | 보라 바탕                        | `primary`(연두) 바탕, 어두운 글자       |
| `outlineBrand` | 보라 테두리(2px)                 | `brand`(보라) 바탕, 흰 글자             |

- `outlineSlim` 은 `outline` 보다 테두리가 얇다. 작은 버튼이 여럿 놓이는 자리에 쓴다.(2026-11-17 사용자 결정)
- `destructive` 는 지우기처럼 되돌릴 수 없는 동작에 쓴다.(2026-11-17 사용자 결정)
- 색은 버튼에 바로 칠하지 않고 뒤에 깐 면에 칠한다. 밀려 들어오는 연출이 그 면 위에서 움직인다.(`button.tsx` 의 `surfaceVariants`)

## hover · 포커스

마우스를 올리거나 키보드로 초점을 주면 세 가지가 함께 움직인다.(2026-11-16 사용자 결정. 이전의 색 전환만으로는 올린 것을 알기 어려웠다)

| 움직임                                            | 토큰                                                     |
| ------------------------------------------------- | -------------------------------------------------------- |
| 다른 색의 면이 왼쪽에서 밀려 들어와 덮는다        | `duration-fast` · `ease-move`                            |
| 버튼의 면이 오른쪽으로 12px 넓어진다              | `duration-fast` · `ease-move`                            |
| 맨 끝의 아이콘이 조금 늦게 따라 오른쪽으로 밀린다 | `duration-fast` · `ease-move`, 늦추기 `duration-instant` |

- 누르면 조금 눌린다. 떠오르는 움직임은 두지 않는다.(2026-11-16 사용자 결정)
- 넓어지는 것은 폭을 움직이지 않는다. 면을 처음부터 오른쪽으로 12px 더 길게 깔고 `clip-path` 로 가렸다가 드러낸다. 레이아웃을 다시 계산하지 않고 옆의 요소도 밀리지 않는다.(`docs/motion.md` 원칙 4)
- 동작 줄이기에서는 색만 바로 바뀌고 넓어지거나 밀리지 않는다.

## 연출 없이 쓰기

`effect="none"` 을 주면 면이 넓어지거나 밀려 들어오지 않고, 누를 때도 눌리지 않는다. hover · 포커스 때 덮는 색과 글자색만 바로 바뀐다.(2026-11-17 사용자 결정)
관리 화면의 버튼이 쓴다.(`src/features/adminAuth/`, `src/features/aboutEditor/`)
면이 넓어지지 않아 버튼 오른쪽에 12px 을 비우지 않아도 된다.

## 비활성

`<button>` 에 `disabled` 를 주면 면이 `chip`, 글자가 `muted-foreground` 로 바뀌고 마우스에 반응하지 않는다. hover 연출도 멈춘다.(`button.tsx`)
`ghost` · `link` 는 면이 없어 글자색만 바뀐다.
`secondary` 는 평소의 면도 `chip` 과 같은 색이라, 비활성일 때 글자색만 바뀐다.

## 자주 하는 실수

- 화살표처럼 밀려야 하는 아이콘은 맨 끝에 둔다. 맨 끝의 아이콘만 움직인다.
- `effect="sweep"` 인 버튼 오른쪽에 12px 의 빈 곳을 둔다. hover 때 면이 그만큼 넓어진다.
- 폼 제출에는 `type="submit"` 을 준다. 기본값은 `button` 이라 주지 않으면 제출하지 않는다. shadcn 원본과 다른 점이다.(`button.tsx`)
- `asChild` 의 자식은 요소 하나다. 글자와 아이콘은 그 요소 안에 넣는다.(`button.tsx`)

## 이 컴포넌트를 고칠 때

변형을 더하면 `buttonVariants` · `surfaceVariants` · `staticSurfaceVariants` 3곳에 같은 이름을 넣는다.(`button.tsx`)
높이와 글자 크기는 `src/shared/ui/size/size.constants.ts` 에서 고친다. Input · Textarea 가 함께 바뀐다.
