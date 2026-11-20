# ErrorBoundary

감싼 부분에서 에러가 나면 그 자리에만 대신 칸을 그린다. 페이지의 나머지는 그대로 남는다.(2026-11-20 사용자 결정)
Next 의 `catchError` 로 만들었다.(`ErrorBoundary.tsx`, `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/catchError.md`)

| prop        | 값                                             | 기본                           |
| ----------- | ---------------------------------------------- | ------------------------------ |
| `message`   | 에러가 났을 때 보이는 문구                     | `이 부분을 불러오지 못했어요.` |
| `className` | 대신 그리는 칸을 놓는 자리의 폭 · 여백         | 없음                           |
| `children`  | 감쌀 내용. 서버 컴포넌트를 그대로 넣을 수 있다 |                                |

```tsx
import ErrorBoundary from '@/shared/ui/errorBoundary/ErrorBoundary';

// 패널 안의 부분
<ErrorBoundary message="프로젝트를 불러오지 못했어요.">
    <FeaturedProjects projects={projects} />
</ErrorBoundary>

// 페이지 폭을 스스로 잡는 섹션. 섹션의 바깥 여백을 그대로 준다
<ErrorBoundary message="경력을 불러오지 못했어요." className="mx-auto mt-10 max-w-page px-gutter">
    <ExperienceTimeline experiences={experiences} />
</ErrorBoundary>
```

## 쓰는 곳

빠져도 페이지의 나머지를 읽을 수 있는 섹션을 감싼다.(2026-11-20 사용자 결정)

| 페이지 | 감싼 섹션                              | 감싸지 않은 것      |
| ------ | -------------------------------------- | ------------------- |
| 홈     | 대표 작업 · 기술 · 소개                | 히어로 · 연락       |
| 소개   | 경력 · 일하는 방식 · 기술              | 맨 위의 소개 · 연락 |
| 작업   | 없음. 목록과 상세 본문이 페이지 자체다 | 목록 · 상세         |

(`src/app/(site)/page.tsx`, `src/app/(site)/about/page.tsx`)

## 에러 화면과의 구분

에러는 던져진 곳에서 가장 가까운 경계가 받는다.(`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`)

| 에러가 난 곳                            | 받는 곳                    | 보이는 것                            |
| --------------------------------------- | -------------------------- | ------------------------------------ |
| `ErrorBoundary` 로 감싼 부분            | 그 `ErrorBoundary`         | 그 자리에만 대신 칸. 나머지는 그대로 |
| 감싸지 않은 공개 화면(홈 · 작업 · 소개) | `src/app/(site)/error.tsx` | 헤더는 남고 본문이 에러 화면으로     |
| 그 밖의 페이지(관리 화면 · colophon)    | `src/app/error.tsx`        | 페이지 전체가 에러 화면으로          |
| 루트 레이아웃 · 전역 Provider           | `src/app/global-error.tsx` | 문서 전체가 에러 화면으로            |

- `notFound()` 와 `redirect()` 는 에러로 잡히지 않고 그대로 지나간다.(`catchError.md`)
- 이벤트 핸들러와 서버 액션 안에서 난 에러는 어느 경계도 받지 않는다. 그리는 도중에 난 에러만 받는다. 저장 실패 같은 것은 토스트로 알린다.(`src/shared/ui/toast/Toast.md`)

## 자주 하는 실수

- 페이지 전체를 감싸지 않는다. 페이지 전체의 에러는 `error.tsx` 가 받는다.
- 없으면 페이지가 성립하지 않는 부분은 감싸지 않는다. 작업 상세의 본문이 그렇다. 빠져도 나머지를 읽을 수 있는 부분에 쓴다.
- 페이지 폭을 스스로 잡는 섹션(`mx-auto max-w-page px-gutter`)을 감쌀 때는 같은 여백을 `className` 으로 준다. 주지 않으면 대신 칸이 화면 끝까지 넓어진다.
- 페이지가 데이터를 읽다가 난 에러는 이 모듈이 받지 못한다. 데이터는 페이지가 먼저 읽어 섹션에 넘기므로, 그 에러는 섹션을 그리기 전에 페이지에서 난다. 이 모듈은 섹션을 그리는 도중의 에러를 받는다.(`src/app/(site)/page.tsx`)
