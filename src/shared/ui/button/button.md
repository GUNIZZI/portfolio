# Button

버튼이다. shadcn 의 Button 을 바탕으로 했다. `variant` · `asChild` 는 shadcn 과 같고, 모양과 `size` · `effect` 는 이 사이트의 것이다.(`button.tsx`, 2026-11-17 사용자 결정)
링크로 그릴 때는 `asChild` 를 주고 `<a>` 를 자식으로 넣는다. 링크는 페이지 안 이동과 `mailto:` 에, `<button>` 은 폼 제출과 동작에 쓴다.

| prop        | 값                                                                                                                | 기본      |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | --------- |
| `variant`   | `default` · `secondary` · `destructive` · `outline` · `outlineSlim` · `ghost` · `link` · `brand` · `outlineBrand` | `default` |
| `size`      | 높이(px). `2xs`(24) · `xs`(28) · `sm`(36) · `md`(44) · `lg`(48) · `xl`(56) · `2xl`(64)                            | `lg`      |
| `asChild`   | 버튼 대신 자식 요소를 버튼 모양으로 그린다                                                                        | `false`   |
| `arrow`     | `end`(글자 뒤의 →) · `start`(글자 앞의 ←). 버튼이 화살표를 그린다. 아래 「아이콘」 절                             | 없음      |
| `icon`      | 글자 앞에 놓는 아이콘 요소. 움직이지 않는다                                                                       | 없음      |
| `effect`    | `default`(색이 짧게 바뀜) · `sweep`(연출)                                                                         | `default` |
| `isLoading` | 실행 중인가. 버튼 위에 로더를 덮고 다시 누르지 못하게 막는다                                                      | `false`   |
| `type`      | `<button>` 의 `type` 그대로                                                                                       | `button`  |

높이와 글자 크기는 입력과 함께 쓰는 눈금에서 읽는다.(`src/shared/ui/size/size.constants.ts`)
같은 `size` 의 Input 과 높이가 같다.(`src/shared/ui/input/input.tsx`)

커서는 손가락 모양이다. Tailwind 4 는 `<button>` 의 커서를 화살표로 두어 버튼에서 따로 준다.(`button.tsx`, 2026-11-17 사용자 결정)

아이콘은 `arrow` · `icon` 으로 주거나 자식으로 넣는다. 간격은 버튼에 정해져 있다. 나누는 기준은 아래 「아이콘」 절에 있다.
`lucide-react` 아이콘은 크기를 적지 않으면 버튼의 `size` 를 따른다. 아이콘에 `size-*` 를 직접 적으면 그쪽을 쓴다.(`button.tsx`, 2026-11-18 사용자 결정)

| `size`     | `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` |
| ---------- | ----- | ---- | ---- | ---- | ---- | ---- | ----- |
| 아이콘(px) | 14    | 16   | 18   | 20   | 20   | 24   | 28    |

`shared/ui` 의 `Icon` 은 `size` prop 으로 크기를 정한다. 버튼의 `size` 를 따르지 않는다.(`src/shared/ui/icon/Icon.tsx`)

```tsx
import { Button } from '@/shared/ui/button/button';

<Button asChild effect="sweep" arrow="end">
    <a href="#projects">View My Projects</a>
</Button>

<Button type="submit" variant="secondary" size="sm">
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
- 색은 버튼에 바로 칠하지 않고 뒤에 깐 면에 칠한다. `sweep` 의 밀려 들어오는 연출이 그 면 위에서 움직인다.(`button.tsx` 의 `surfaceVariants`)

## hover · 포커스

마우스를 올리거나 키보드로 초점을 주었을 때의 움직임은 `effect` 가 정한다.(2026-11-18 사용자 결정)

| `effect`  | 움직임                                               | 쓰는 곳                                 |
| --------- | ---------------------------------------------------- | --------------------------------------- |
| `default` | 면과 글자의 색이 짧게 바뀐다                         | 관리 화면을 비롯한 대부분의 버튼        |
| `sweep`   | 다른 색의 면이 밀려 들어와 덮는다. 아래 「sweep」 절 | 홈의 Contact 처럼 눈에 띄어야 하는 버튼 |

`default` 의 색 전환은 `duration-fast` · `ease-move` 다. 누를 때 눌리지 않는다.(`button.tsx` 의 `buttonVariants` · `staticSurfaceVariants`)
동작 줄이기에서는 색이 바로 바뀐다.(`docs/motion.md` 3절)

## 아이콘

**아이콘은 방향을 가리키는 화살표와 뜻을 나타내는 아이콘으로 나눈다.**(2026-11-20 사용자 결정. 움직일 아이콘을 자리로 짐작하던 방식에서는 아이콘이 글자 앞에 하나만 있을 때 글자와 겹쳤다)

| prop    | 값              | 자리와 움직임                                                                    |
| ------- | --------------- | -------------------------------------------------------------------------------- |
| `arrow` | `end` · `start` | 버튼이 그린다. `end` 는 글자 뒤의 →, `start` 는 글자 앞의 ←. `sweep` 에서 밀린다 |
| `icon`  | 아이콘 요소     | 글자 앞에 놓인다. 움직이지 않는다                                                |

```tsx
// 앞으로 가기
<Button asChild effect="sweep" arrow="end">
    <a href="#projects">View My Projects</a>
</Button>

// 돌아가기
<Button asChild effect="sweep" arrow="start">
    <Link href="/">Back to Home</Link>
</Button>

// 동작. 아이콘은 제자리에 있다
<Button effect="sweep" icon={<RotateCw aria-hidden="true" />} onClick={onRetry}>
    Try Again
</Button>
```

- 화살표는 `lucide-react` 의 것이고 크기는 버튼의 `size` 를 따른다.(`button.tsx`)
- `arrow` 와 `icon` 은 함께 줄 수 있다. 연락 섹션의 버튼이 그렇게 쓴다.(`src/widgets/contact/Contact.tsx`)
- 자식으로 넣은 아이콘도 그려지지만 움직이지 않는다.

## sweep

`effect="sweep"` 을 주면 다른 색의 면이 밀려 들어와 버튼을 덮는다.(2026-11-16 사용자 결정. 이전의 색 전환만으로는 올린 것을 알기 어려웠다)
공개 화면의 버튼이 쓴다.(`src/features/hero/ui/Hero.tsx`, `src/features/about/ui/About.tsx`, `src/widgets/contact/Contact.tsx`, `src/widgets/header/Header.tsx`, `src/features/statusScreen/`)

| 움직임                                       | 토큰                          |
| -------------------------------------------- | ----------------------------- |
| 다른 색의 면이 밀려 들어와 덮는다            | `duration-fast` · `ease-move` |
| 화살표(`arrow`)가 가리키는 쪽으로 4px 밀린다 | `duration-fast` · `ease-move` |

- 면은 화살표가 가리키는 방향으로 들어온다. `arrow="start"` 면 오른쪽에서 왼쪽으로, 그 밖에는 왼쪽에서 오른쪽으로 들어온다.(`button.tsx` 의 `surfaceVariants`)
- **버튼의 면은 넓어지지 않는다.** 화살표는 버튼의 좌우 여백 안에서만 움직인다.(2026-11-20 사용자 결정. 이전에는 면이 12px 넓어지고 아이콘이 그만큼 밀렸다)
- 누르면 조금 눌린다. 떠오르는 움직임은 두지 않는다.(2026-11-16 사용자 결정)
- 동작 줄이기에서는 색만 바로 바뀌고 화살표는 밀리지 않는다.

## 연출 없이 쓰기

`effect` 를 주지 않으면(`default`) 면이 밀려 들어오지 않고, 누를 때도 눌리지 않는다. hover · 포커스 때 덮는 색과 글자색만 짧게 바뀐다.(2026-11-18 사용자 결정)
관리 화면의 버튼이 쓴다.(`src/features/adminAuth/`, `src/features/aboutEditor/`, `src/features/experienceEditor/`, `src/features/projectEditor/`)

## 실행 중

`isLoading` 을 주면 버튼 위에 로더를 덮는다. Kozipsa 의 Button 에서 가져왔다.(`button.tsx`, Kozipsa `packages/ui` 의 `custom/button` 에서 가져옴, 2026-11-18 사용자 결정)
저장 · 삭제 · 로그인처럼 서버의 답을 기다리는 버튼이 쓴다.(`src/features/experienceEditor/`, `src/features/aboutEditor/ui/SectionShell.tsx`, `src/features/adminAuth/ui/LoginForm.tsx`)

```tsx
<Button type="submit" disabled={isBlocked} isLoading={isPending}>
    저장
</Button>
```

- **제출 중에는 `disabled` 가 아니라 `isLoading` 을 준다.** `disabled` 로 막으면 진행 중인지 누를 수 없는 것인지 구분할 수 없다.(Kozipsa `button.md` 3절)
- 실행 중에는 `aria-busy` 로 알리고, 마우스와 키보드로 누른 것을 모두 버린다. 폼도 다시 제출되지 않는다. Kozipsa 는 로더가 덮여 마우스만 막혔다.(`button.tsx`, 2026-11-18 사용자 결정)
- `disabled` 를 걸지 않아 버튼이 포커스를 잃지 않는다.(`button.tsx`)
- 글자는 바꾸지 않는다. 로더가 덮여도 버튼의 이름은 그대로 읽힌다.(`src/shared/ui/loader/Loader.md`)
- `asChild` 와 함께 쓰지 않는다. 링크에는 로더를 덮지 않는다.(`button.tsx`)

## 비활성

`<button>` 에 `disabled` 를 주면 버튼 전체가 `opacity-disabled` 로 흐려지고 마우스에 반응하지 않는다. hover 연출도 멈춘다.(`button.tsx`, `docs/theme.md` 4절)
글자 · 면 · 테두리가 함께 흐려져 variant 의 색은 그대로 남는다.

## 자주 하는 실수

- 화살표를 자식으로 넣지 않는다. `arrow` 로 준다. 자식으로 넣은 아이콘은 밀리지 않는다.
- 뜻을 나타내는 아이콘을 글자 뒤에 두지 않는다. `icon` 으로 주면 글자 앞에 놓인다.
- 폼 제출에는 `type="submit"` 을 준다. 기본값은 `button` 이라 주지 않으면 제출하지 않는다. shadcn 원본과 다른 점이다.(`button.tsx`)
- `asChild` 의 자식은 요소 하나다. 글자와 아이콘은 그 요소 안에 넣는다.(`button.tsx`)

## 이 컴포넌트를 고칠 때

변형을 더하면 `buttonVariants` · `surfaceVariants` · `staticSurfaceVariants` 3곳에 같은 이름을 넣는다.(`button.tsx`)
높이와 글자 크기는 `src/shared/ui/size/size.constants.ts` 에서 고친다. Input · Textarea 가 함께 바뀐다.
