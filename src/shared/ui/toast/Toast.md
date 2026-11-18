# Toast

작업 결과를 잠깐 알리고 사라지는 알림이다. 관리 화면에서 저장하거나 지운 결과를 알린다.(`docs/plan/admin/about/wireframe.html` P-01, `docs/plan/admin/experiences/wireframe.html` P-02)
종류 · 모양 · 호출 방식은 Kozipsa 의 토스트와 같다.(Kozipsa `packages/ui` 의 `toast/toast.tsx` 에서 가져옴, 2026-11-18 사용자 결정)

```tsx
import { useToast } from '@/shared/ui/toast/ToastProvider';

const toast = useToast();
toast.success('경력을 저장했습니다');
```

## 조각 2개로 되어 있다

| 조각            | 내용                               | 위치                          |
| --------------- | ---------------------------------- | ----------------------------- |
| `ToastProvider` | 토스트를 그리는 곳                 | 관리 화면의 레이아웃에 하나만 |
| `useToast`      | 띄우는 함수 `toast` 를 돌려주는 훅 | `ToastProvider` 안쪽 어디서든 |

- 레이아웃은 화면을 옮겨도 남아, 저장하고 목록으로 돌아간 뒤에도 문구가 보인다.(`src/app/admin/(panel)/layout.tsx`)
- `Toast.tsx` 는 토스트 1장을 그린다. 화면에서 직접 쓰지 않는다.(`ToastProvider.tsx`)

## 종류

색이 아니라 결과의 뜻으로 고른다.(Kozipsa `toast.md` 2절에서 가져옴)

| 함수            | 상황                     | 색                 | 아이콘 |
| --------------- | ------------------------ | ------------------ | ------ |
| `toast.success` | 요청한 일이 끝났을 때    | `success`          | 체크   |
| `toast.error`   | 실패해서 다시 해야 할 때 | `destructive`      | 금지   |
| `toast.warning` | 됐지만 확인이 필요할 때  | `warning`          | 세모   |
| `toast.info`    | 결과가 아닌 소식         | `info`             | 안내   |
| `toast()`       | 위 어디에도 없는 알림    | `strong`           | 없음   |
| `toast.loading` | 진행 중                  | `muted-foreground` | 로더   |

- 종류는 테두리와 제목 · 아이콘의 색으로만 가른다. 바탕은 `card` 그대로다.(`Toast.tsx`, Kozipsa `toast.md` 「이 컴포넌트를 고칠 때」에서 가져옴)
- 두 번째 인자로 `description` · `duration` · `id` 를 받는다. `description` 의 줄바꿈은 그대로 나온다.(`ToastProvider.tsx`)
- 같은 `id` 로 다시 부르면 새로 쌓지 않고 그 토스트를 바꾼다. 시간은 처음부터 다시 잰다.(`ToastProvider.tsx`)
- `toast.dismiss(id)` 로 지운다. `id` 가 없으면 모두 지운다.(`ToastProvider.tsx`)

### 비동기 작업

`toast.promise` 는 토스트 1장을 로딩에서 성공 · 실패로 바꾼다.(`ToastProvider.tsx`)

```tsx
toast.promise(saveExperience(), {
    loading: '저장하는 중',
    success: '저장했습니다',
    error: '저장하지 못했습니다',
});
```

- `error` 는 제목만 맡는다. 던져진 오류의 `message` 는 설명에 붙는다.(`ToastProvider.tsx`)
- 세 번째 인자에 `description` 을 주면 오류의 내용 대신 그것을 쓴다.(`ToastProvider.tsx`)

## 배치

- 화면 오른쪽 아래에 쌓이고, 새 토스트가 아래에 온다. 좁은 화면에서는 양옆을 16px 씩 남기고 폭을 채운다.(`ToastProvider.tsx`)
- 4초 뒤에 지운다. `toast.loading` 은 직접 지울 때까지 남는다.(`ToastProvider.tsx` 의 `TOAST_DURATION_MS`)
- 한 번에 5장까지 보여 준다. 넘치면 오래된 것부터 지운다.(`ToastProvider.tsx` 의 `MAX_VISIBLE_TOASTS`)
- 층은 `z-modal` 이다.(`docs/theme.md` 3절)

## 연출

| 대상   | 나타날 때                           | 사라질 때         |
| ------ | ----------------------------------- | ----------------- |
| 토스트 | 아래에서 올라오며 짙어진다          | 내려가며 옅어진다 |
| 아이콘 | 작게 있다가 커진다                  |                   |
| 나머지 | 한 장이 사라지면 빈자리로 옮겨 간다 |                   |

- 지속시간은 `DURATION.fast` 다.(`Toast.tsx`)
- 동작 줄이기에서는 움직이지 않고 바로 나타나고 사라진다.(`src/_app/Providers.tsx`)

## 접근성

- `role="status"` 로 알린다.(`docs/plan/admin/about/README.md` 「접근성 · 성능 고려」)
- `role="status"` 요소는 토스트가 없을 때도 남긴다. 나중에 생긴 요소는 스크린 리더가 읽지 않는다.(`ToastProvider.tsx`)

## Kozipsa 원본과 다른 점

- sonner 를 쓰지 않고 framer-motion 으로 만들었다. 모션 도구를 더하지 않는다.(`docs/motion.md` 원칙 1)
- 그래서 sonner 의 기능 중 겹쳐 접히는 모양, 밀어서 지우기, 마우스를 올린 동안 멈추기, `toast.custom` 은 없다.(`ToastProvider.tsx`)
- `toast` 를 파일에서 바로 가져오지 않고 `useToast` 로 받는다.(`ToastProvider.tsx`)

## 자주 하는 실수

- `useToast` 는 `ToastProvider` 안에서만 쓴다. 밖에서 부르면 던진다.(`ToastProvider.tsx`)
- 되돌릴 수 없는 동작의 확인을 토스트로 알리지 않는다. 사라지는 알림이라 못 볼 수 있다. 확인 창이 맡는다.(`src/shared/ui/alertDialog/alertDialog.md`, Kozipsa `toast.md` 2.1절에서 가져옴)
