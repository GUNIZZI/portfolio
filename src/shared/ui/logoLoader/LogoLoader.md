# LogoLoader

페이지 본문을 기다리는 동안 그 자리에 두는 로더다. 색을 뺀 G 심볼 위로 색이 왼쪽부터 번져 들어왔다가 옅어지기를 되풀이하고, 아래의 점 3개가 차례로 뛴다.(2026-11-20 사용자 결정. 사용자가 준 시안을 옮겼다)
`Suspense` 의 `fallback` 으로 쓴다. 지금은 작업 상세의 본문이 쓴다.(`src/app/(site)/project/[id]/page.tsx`)

| prop        | 값                                            | 기본          |
| ----------- | --------------------------------------------- | ------------- |
| `label`     | 보조 기술이 읽는 문구. 화면에는 보이지 않는다 | `불러오는 중` |
| `className` | 심볼을 가운데 놓는 바깥 요소에 붙는다         |               |

```tsx
import LogoLoader from '@/shared/ui/logoLoader/LogoLoader';

<Suspense fallback={<LogoLoader />}>
    <WorkDetailContent params={params} />
</Suspense>;
```

- 바깥 요소는 높이를 화면의 60% 이상으로 잡고 심볼을 가운데 놓는다. 본문이 오기 전에 푸터가 올라붙지 않는다.(`LogoLoader.tsx`)
- 바깥 요소가 `role="status"` 다. 문구는 `sr-only` 로 넣는다.(`LogoLoader.tsx`)
- 버튼 안의 진행 표시는 이 컴포넌트가 아니라 `Loader` 다.(`src/shared/ui/loader/Loader.md`)
- 관리 화면에는 쓰지 않는다. 관리 화면은 제목 · 설명 · 본문의 자리를 면으로 그린 틀을 둔다.(`src/features/adminAuth/ui/AdminGuardFallback.tsx`)

## 모션

GSAP 타임라인 하나가 끝없이 되풀이한다.(`LogoLoader.tsx`)

| 차례 | 움직임                                         | 지속시간 · 가속도 |
| ---- | ---------------------------------------------- | ----------------- |
| 1    | 색이 왼쪽부터 번져 들어온다                    | `slower` · `move` |
| 2    | 색이 옅어져 색을 뺀 바탕 심볼만 남는다         | `base` · `move`   |
| 함께 | 점 3개가 `loose` 간격으로 올랐다 내려온다. 2번 | `fast` · `move`   |

- 시안의 시간(1.12초 · 0.45초 · 0.22초)과 가속도는 가장 가까운 토큰으로 옮겼다.(`docs/motion.md` 원칙 2)
- 색은 심볼 2겹 가운데 위의 것에 씌운 가림막(`mask-image`)의 자리를 옮겨 드러낸다. 크기와 자리는 그대로다.(`LogoLoader.tsx` 의 `REVEAL_MASK`)
- 바탕 심볼의 흐린 정도(`grayscale(0.8) brightness(0.4)`, 불투명도 0.72)와 점의 불투명도(0.28 · 0.55 · 1)는 시안의 값 그대로 컴포넌트에 적었다. 토큰에 없는 값이다.(2026-11-20 사용자 결정, `LogoLoader.tsx` 의 `BASE_STYLE` · `DOT_OPACITY`)
- 스크립트가 오기 전과 동작 줄이기에서는 색이 다 들어온 심볼과 멈춘 점만 보인다.(`LogoLoader.tsx` 의 `gsap.matchMedia()`)

## 이 컴포넌트를 고칠 때

그림은 `public/images/logo/symbol.svg` 다. `logo.svg` 에서 G 심볼의 path 4개와 그 그라데이션만 떼어 냈다. 비율은 426:348 이다. 같은 그림을 바탕과 색 2겹으로 겹쳐 쓴다.
심볼의 색은 두 테마에서 같아 그림을 한 장만 둔다.(`logo.svg` 와 `logo-light.svg` 는 글자색만 다르다, `src/shared/ui/logo/Logo.md`)
