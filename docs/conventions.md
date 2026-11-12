# 네이밍과 코드 규약

파일과 식별자에 이름을 붙이는 규칙, 그리고 화면 코드를 작성하는 규칙이다.
Kozipsa(`admin-next/docs/conventions.md`)에서 가져왔다.(2026-11-11 사용자 결정)
계층과 의존 방향은 [architecture.md](./architecture.md) 에 있다.

## 원칙

**이름은 관례보다 일관성이 우선이다.** 일반적인 관례와 달라도 이 저장소의 규칙을 따른다.
`hndl` 이 그 예다.(2.3)

**포맷과 import 순서는 Prettier 와 ESLint 가 정한다.**
설정은 일반적인 관례를 엄격하게 적용한 것이다.(`.prettierrc.json` · `eslint.config.mjs`, 2026-11-11 사용자 결정)

## 1. 신규 entity 만들기

`project` 를 예로 든 파일 4개다.

**1) `model/project.schemas.ts`**: zod 스키마와 그 추론 타입

```ts
export const ProjectFrontmatterSchema = z.object({ title: z.string(), year: z.number() });
export type ProjectFrontmatterType = z.infer<typeof ProjectFrontmatterSchema>;
```

**2) `model/project.types.ts`**: 원문과 화면용 타입

```ts
export interface ProjectResponse {
    slug: string;
    frontmatter: ProjectFrontmatterType;
} // 원문
export interface ProjectData {
    slug: string;
    title: string;
    yearText: string;
} // 가공본
```

**3) `repositories/project.repositories.ts`**: interface 먼저, 구현 나중

```ts
import 'server-only';

export interface ProjectRepository {
  /**
   * 프로젝트 원문 전체 조회
   * @see {@link ProjectResponse}
   */
  getProjectList(): Promise<ProjectResponse[]>;
}

export const projectRepository: ProjectRepository = { … };
```

**4) `services/project.services.ts`**: 가공

```ts
import 'server-only';

export async function getProjectList(): Promise<ProjectData[]> {
    const list = await projectRepository.getProjectList();
    return list.toSorted(byYearDesc).map(toProjectData);
}
```

## 2. 네이밍

Kozipsa conventions 2절에서 가져왔다.

| 대상                | 규칙                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| **타입 이름**       | `PascalCase`. `interface` · `type` · 타입 매개변수 모두                                  |
| **값 이름**         | `camelCase`. React 컴포넌트만 `PascalCase`                                               |
| **깊게 불변인 값**  | `CONSTANT_CASE`. `as const` 묶음과 원시 리터럴이다. `const` 로 선언한 것이 기준이 아니다 |
| **zod 스키마 상수** | `PascalCase` + `Schema` 접미                                                             |
| **복수형**          | 파일 접미와 폴더 이름은 복수형. 고정 예외는 `ui/` 와 `model/` 2개                        |
| 컴포넌트 파일       | `PascalCase.tsx`, default export                                                         |
| 훅 파일             | `use<Name>.ts(x)`, `features/*/model/` 또는 `shared/util/` 배치                          |
| Props 인터페이스    | **`OwnProps`** 고정. 확장은 `interface OwnProps extends X`                               |
| 이벤트 핸들러       | **`hndl`** 접두. `handle` 금지                                                           |
| entity 파일         | `<entity>.<역할>.ts`. 역할은 `.schemas` `.types` `.services` `.repositories`             |
| `model/` 파일       | `.schemas.ts` · `.types.ts` · `.utils.ts` · `.constants.ts` · `.contexts.tsx`            |
| 모션 변형           | `<대상>Variants`(`heroTitleVariants`). 파일은 `model/<feature>.motions.ts`               |

`.motions.ts` 접미와 `~Variants` 이름은 이 저장소에서 새로 정했다.(2026-11-11 사용자 결정)
framer-motion 의 `variants` 정의를 컴포넌트 밖으로 빼 둘 곳이 필요하다.

### 2.1 타입 접미사

| 접미사      | 의미                     | 위치          |
| ----------- | ------------------------ | ------------- |
| `~Response` | 원문 (mdx 프론트매터 등) | `.types.ts`   |
| `~Data`     | 화면에서 쓰는 **가공본** | `.types.ts`   |
| `~Schema`   | zod 스키마               | `.schemas.ts` |
| `~Type`     | `z.infer` 결과           | `.schemas.ts` |

**`~Response` 와 `~Data` 를 나누는 것이 이 표의 목적이다.** 이름이 같으면 `services` 가 변환했는지 알 수 없다.(Kozipsa 2.1)

### 2.2 표기

```ts
export const PROJECT_ROLE = { LEAD: 'LEAD', MEMBER: 'MEMBER' } as const;
export type ProjectRole = (typeof PROJECT_ROLE)[keyof typeof PROJECT_ROLE];
```

**타입 이름에 `_TYPE` 을 붙이지 않는다.**(Kozipsa 2.2)

### 2.3 `hndl` 접두

일반적인 관례는 `handle` 이지만 Kozipsa 의 다수(93 대 16)를 따라 `hndl` 을 쓴다.(Kozipsa 2.3)

### 2.4 import 순서

ESLint `simple-import-sort` 가 고친다. 순서는 Kozipsa 2.4 와 같다.

```
0. 부수효과 import (CSS)
1. react / next
2. 외부 라이브러리
3. @/_app → @/widgets → @/features → @/entities → @/shared → @/config → @/style …
4. 상대경로
```

## 3. 날짜

`date-fns` 를 추가하기 전까지는 `Intl.DateTimeFormat` 을 쓴다. 표시 포맷은 점(`.`)으로 구분한다(`2026.11`).(Kozipsa 3절)
가공은 `services` 에서 한다.

## 4. 화면 코드

### 4.1 컴포넌트

```tsx
'use client';

interface OwnProps {
    title: string;
}

export default function HeroTitle({ title }: OwnProps) {
    function hndlPointerMove() {
        /* ... */
    }
    return <h1 className={cn('text-strong', isActive && 'text-accent')}>{title}</h1>;
}
```

**`'use client'` 는 상호작용이 있는 가장 작은 컴포넌트에만 붙인다.** 섹션 전체를 클라이언트로 만들지 않는다.
모션이 필요한 부분만 클라이언트 컴포넌트로 떼고, 글자와 데이터는 서버 컴포넌트에서 넘긴다.

`features/*/index.ts` 는 **`ui` 와 Provider 만 공개한다.**(Kozipsa 4.1)

```ts
// features/hero/index.ts
export { default as Hero } from './ui/Hero';
```

### 4.2 색

글자색은 `strong` › `foreground` › `muted` › `decorative` 4계층 안에서 고른다.
기준은 [theme.md](./theme.md) 에 있다.

### 4.3 클래스 줄 나누기

**Tailwind 클래스는 성격별로 줄을 나눠 적는다.**(Kozipsa 4.3)
기준은 클래스 개수가 아니라 **섞인 성격의 수**다.

| 상황                                  | 처리                               |
| ------------------------------------- | ---------------------------------- |
| 성격이 1~2개                          | 한 줄에 둔다. 주석도 붙이지 않는다 |
| 성격이 3개 이상                       | 줄을 나눈다                        |
| 성격이 2개인데 클래스가 7개를 넘을 때 | 줄을 나눈다                        |

나눌 때는 **줄마다 성격을 주석으로 적는다.**
순서는 배치와 모양 › 글자 › 아이콘 › hover › 상태 › 포커스 › 비활성 › 모션이다.

```tsx
<a
    className={cn(
        // 배치와 모양
        'inline-flex items-center gap-2 rounded-full px-5 py-3',
        // 글자
        'text-sm font-medium text-strong',
        // hover
        'hover:bg-surface',
        // 모션
        'transition-colors duration-fast ease-enter',
    )}
/>
```

클래스 문자열 안의 순서는 `prettier-plugin-tailwindcss` 가 정렬한다.

`cva` 로 변형을 정의할 때는 base 를 문자열이 아니라 **배열**로 둔다.

### 4.4 훅 의존성

**`react-hooks/exhaustive-deps` 는 의존성을 채워서 없앤다.**
일부러 빼야 한다면 끄는 주석의 `--` 뒤에 이유를 적는다. 이유가 없으면 lint 가 막는다.(Kozipsa 4.6)

```tsx
// eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 때 한 번만 타임라인을 만든다
}, []);
```

### 4.5 파일 나누기

**나누는 기준은 줄 수가 아니라 변경 이유다.**(Kozipsa 4.7)
모션 정의(`variants`, GSAP 타임라인 구성)는 마크업과 변경 이유가 달라 `model/` 로 뺀다.

## 금지사항

| 금지                                   | 대신                           | 근거                                                    |
| -------------------------------------- | ------------------------------ | ------------------------------------------------------- |
| `interface HeroProps`                  | `interface OwnProps`           | 파일마다 이름이 달라지면 검색으로 찾을 수 없다(Kozipsa) |
| `handleClick`                          | `hndlClick`                    | Kozipsa 2.3                                             |
| `service/` 처럼 단수 디렉터리          | 복수형. `ui/` `model/` 만 예외 | 경로 자동완성이 나눠진다(Kozipsa)                       |
| 클래스를 한 줄에 몰아 쓰기             | 성격별로 줄을 나눈다           | 어느 상태를 다루는 클래스인지 읽을 수 없다(Kozipsa)     |
| 섹션 전체에 `'use client'`             | 상호작용 부분만 떼어 낸다      | 서버에서 그릴 글자까지 JS 번들에 들어간다               |
| 이유 없는 `eslint-disable`             | `-- 이유` 를 단다              | 일부러 끈 것인지 빠뜨린 것인지 구별할 수 없다(Kozipsa)  |
| 파일을 복사해 이름을 그대로 둔 채 사용 | 이름을 한 번 더 확인한다       | 복사한 파일에 오타가 그대로 남는다(Kozipsa)             |

## 미정리 항목

- 아래 확인방법으로 찾은 어긋난 곳은 없다(2026-11-12).
- `OwnProps` 와 `hndl` 은 lint 로 검사하지 않는다. 아래 확인방법의 grep 으로 본다.

## 확인방법

```bash
# Props 이름. 기대: OwnProps 만
grep -rhoE "interface [A-Za-z]+Props" src --include="*.tsx" | sort | uniq -c

# handle 접두. 기대: 0
grep -rhoE "\bhandle[A-Z][A-Za-z]+" src --include="*.tsx" --include="*.ts" | sort -u | wc -l

# 단수 디렉터리. 기대: 출력 없음
ls -d src/entities/*/service src/entities/*/repository 2>/dev/null

# 타입 표기·포맷·import 순서. 기대: 오류 0
pnpm lint && pnpm format:check
```
