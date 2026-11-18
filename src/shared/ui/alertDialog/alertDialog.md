# AlertDialog

확인 창이다. 되돌릴 수 없는 동작을 하기 전에 한 번 더 묻는다.
구성과 나타나고 사라지는 연출은 Kozipsa 의 확인 창과 같다.(Kozipsa `packages/ui` 의 `alertDialog/ConfirmDialog.tsx` 에서 가져옴, 2026-11-18 사용자 결정)
경력 삭제가 쓴다.(`docs/plan/admin/experiences/wireframe.html` P-01, `src/features/experienceEditor/ui/ExperienceDeleteButton.tsx`)

```tsx
import { useConfirmDialog } from '@/shared/ui/alertDialog/ConfirmDialogProvider';

const { addConfirmDialog } = useConfirmDialog();

addConfirmDialog({
    variant: 'delete',
    title: '경력을 삭제할까요?',
    description: '되돌릴 수 없습니다.',
    confirmText: '삭제',
    cancelText: '취소',
    onConfirm: hndlDelete,
});
```

**컴포넌트를 그리지 않는다. 함수를 부른다.**(Kozipsa `alertDialog.md` 에서 가져옴)

## 폴더에 파일이 3개다

| 파일                        | 내용                                          | 화면에서 쓰는가           |
| --------------------------- | --------------------------------------------- | ------------------------- |
| `alertDialog.tsx`           | shadcn 의 AlertDialog 를 바탕으로 한 조각들   | 아니오                    |
| `ConfirmDialog.tsx`         | 조각을 조립한 완성품. 종류별 아이콘·제목·버튼 | 아니오                    |
| `ConfirmDialogProvider.tsx` | 확인 창을 그리는 곳과 `useConfirmDialog`      | **`addConfirmDialog` 만** |

- 소문자가 shadcn 을 바탕으로 한 것, PascalCase 가 조립한 것이다.(Kozipsa `alertDialog.md` 2절에서 가져옴)
- `ConfirmDialogProvider` 는 관리 화면의 레이아웃에 하나만 둔다.(`src/app/admin/(panel)/layout.tsx`)
- `useConfirmDialog` 는 `ConfirmDialogProvider` 안에서만 쓴다. 밖에서 부르면 던진다.(`ConfirmDialogProvider.tsx`)

## 띄우고 닫기

- 연달아 부르면 나중 것이 위에 뜬다. `id` 를 주면 같은 `id` 는 한 번만 뜬다.(`ConfirmDialogProvider.tsx`)
- 닫아도 사라지는 연출이 끝날 때까지 목록에 남긴다. 연출 도중에 내용이 없어지지 않는다.(`ConfirmDialogProvider.tsx`)
- 화면(경로)이 바뀌면 떠 있던 창을 닫는다. `onConfirm` 이 물고 있던 화면이 사라졌기 때문이다.(`ConfirmDialogProvider.tsx`, Kozipsa `alertDialog.md` 8절에서 가져옴)
- `removeConfirmDialog(id)` 는 그 창을, `id` 가 없으면 맨 위의 창을 닫는다. `clearConfirmDialogs()` 는 모두 닫는다.(`ConfirmDialogProvider.tsx`)

## 구성

왼쪽에 종류를 알리는 아이콘, 오른쪽에 제목과 설명, 아래 오른쪽에 취소 · 실행 버튼을 둔다.(`ConfirmDialog.tsx`)

`addConfirmDialog` 에 넘기는 값이다.

| 값            | 내용                                                             | 기본   |
| ------------- | ---------------------------------------------------------------- | ------ |
| `variant`     | 묻는 내용의 종류. 아이콘 · 기본 제목 · 실행 버튼의 모양을 정한다 | `info` |
| `title`       | 제목. 없으면 종류의 기본 제목                                    |        |
| `description` | 설명                                                             |        |
| `confirmText` | 실행 버튼의 글자                                                 | `확인` |
| `cancelText`  | 취소 버튼의 글자. 없으면 취소 버튼을 그리지 않는다               |        |
| `onConfirm`   | 실행 버튼을 눌렀을 때                                            |        |
| `onCancel`    | 취소 버튼을 누르거나 Esc 로 닫았을 때                            |        |
| `children`    | 설명과 버튼 사이에 더 그릴 내용                                  |        |
| `id`          | 같은 `id` 는 한 번만 뜬다. 없으면 만들어 붙인다                  |        |

색이 아니라 묻는 내용으로 고른다.(Kozipsa `alertDialog.md` 3절에서 가져옴)

| variant    | 상황                        | 아이콘(색)                      | 기본 제목          | 실행 버튼     |
| ---------- | --------------------------- | ------------------------------- | ------------------ | ------------- |
| `question` | 되돌리기 어려운 동작의 확인 | 물음표(`warning`)               | 질문               | `default`     |
| `delete`   | 삭제 확인                   | 고리 안의 휴지통(`destructive`) | 삭제 하시겠습니까? | `destructive` |
| `info`     | 진행 전 알아둘 것           | 안내(`info`)                    | 안내               | `secondary`   |
| `warning`  | 됐지만 확인이 필요할 때     | 세모(`warning`)                 | 경고               | `default`     |
| `success`  | 결과 알림                   | 체크(`success`)                 | 성공               | `default`     |
| `error`    | 결과 알림                   | 금지(`destructive`)             | 오류               | `destructive` |

- 취소는 `ghost`, 버튼 크기는 `sm` 이다.(`ConfirmDialog.tsx`, `alertDialog.tsx`)
- 열면 처음 포커스가 취소에 간다. Esc 로 닫히고, 바깥을 눌러서는 닫히지 않는다. Radix 가 한다.(`alertDialog.tsx`)
- 닫으면 포커스를 띄울 때 포커스가 있던 요소로 돌려준다.(`ConfirmDialogProvider.tsx`)
- 층은 `z-modal` 이다.(`docs/theme.md` 3절)

## 연출

| 대상 | 나타날 때                          | 사라질 때                |
| ---- | ---------------------------------- | ------------------------ |
| 딤   | 옅은 데서 짙어진다                 | 옅어진다                 |
| 창   | 옅은 데서 짙어지며 95% 에서 커진다 | 옅어지며 95% 로 작아진다 |

- 지속시간은 `DURATION.fast`, 가속도는 나타날 때 `EASE.enter`, 사라질 때 `EASE.exit` 다.(`alertDialog.tsx`)
- framer-motion 으로 그린다. 닫힌 뒤에도 사라지는 연출이 끝날 때까지 창을 남겨 둔다.(`alertDialog.tsx`, `docs/motion.md` 원칙 1)
- 동작 줄이기에서는 움직이지 않고 바로 나타나고 사라진다.(`src/_app/Providers.tsx`)

## Kozipsa 원본과 다른 점

- 연출을 CSS 애니메이션이 아니라 framer-motion 으로 그린다.(`docs/motion.md` 원칙 1)
- 딤은 `bg-background` 를 옅게 깔고 뒤를 흐린 것이다. 원본의 고정색 대신 썼다.(`docs/theme.md` 1절)
- 창의 테두리를 남겼다. 원본은 그림자로 창을 띄우는데, 이 사이트에는 그 그림자 토큰이 없다.(`src/style/tokens/layout.css`)
- 실행 버튼은 이 사이트의 `Button` 에 있는 변형으로 옮겼다. `success` · `warning` 버튼이 없어 주 버튼(`default`)을 쓴다.(`ConfirmDialog.tsx`, `src/shared/ui/button/button.tsx`)
- `form` · `onSubmit` · `color` 를 가져오지 않았다. 쓰는 곳이 없다.(`ConfirmDialog.tsx`)
- 스토어(zustand) 대신 context 로 만들었다. 그래서 `ConfirmDialogProvider` 안에서만 부를 수 있다.(`ConfirmDialogProvider.tsx`)
- 닫은 창은 300ms 를 기다리지 않고, 사라지는 연출이 끝났을 때 목록에서 지운다.(`ConfirmDialogProvider.tsx`)
- 화면이 바뀌었는지는 경로만 본다. 쿼리는 보지 않는다.(`ConfirmDialogProvider.tsx`)
- 처음 포커스는 실행이 아니라 취소에 둔다.(`docs/plan/admin/README.md` 「접근성 · 성능 고려」)
