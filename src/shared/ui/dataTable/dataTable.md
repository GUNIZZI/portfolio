# DataTable

목록 표다. 바깥이 잘라 준 한 페이지를 그린다. TanStack Table 위에 `Table` · `Pagination` 을 얹었다.
Kozipsa 의 DataTable 을 가져왔고, prop 의 이름과 동작은 Kozipsa 와 같다.(`dataTable.tsx`, Kozipsa `packages/ui` 의 `custom/dataTable` 에서 가져옴, 2026-11-18 사용자 결정)
관리 화면의 목록이 쓴다. 지금은 경력 목록과 프로젝트 목록이다.(`src/features/experienceEditor/ui/ExperienceList.tsx`, `src/features/projectEditor/ui/ProjectList.tsx`)

칸 안의 버튼이나 스위치가 목록의 상태를 바꿔야 하면, 컬럼 정의를 컴포넌트 밖에 두고 동작은 컨텍스트로 내려 준다. 컬럼을 컴포넌트 안에서 만들면 그릴 때마다 칸이 새 컴포넌트가 되어 포커스를 잃는다.(`src/features/projectEditor/ui/ProjectList.tsx` 의 `ListActionsContext`)

```tsx
import { DataTable } from '@/shared/ui/dataTable/dataTable';

<DataTable
    columns={COLUMNS}
    data={{ content: experiences, totalElements: experiences.length }}
    hndlRowClick={hndlRowClick}
/>;
```

## 1. 데이터

`data` 는 아래 모양이다. Kozipsa 의 백엔드 목록 응답과 같다.(`dataTable.types.ts`)

```ts
interface DataTablePage<TRow> {
    content: TRow[]; // 이 페이지의 행
    totalElements: number; // 전체 건수. 페이저와 「전체 N」 이 쓴다
    page?: number;
    totalPages?: number;
}
```

- **자르고 정렬하고 거르는 일은 바깥이 한다.** 이 컴포넌트는 받은 행만 그리고, 정렬 · 필터는 상태만 갖고 핸들러로 알린다.(`dataTable.tsx` 의 `manualPagination` · `manualSorting` · `manualFiltering`)
- 행 배열을 통째로 갖고 있으면 `{ content: 목록, totalElements: 목록.length }` 로 감싸 넘긴다.(`src/features/experienceEditor/ui/ExperienceList.tsx`)
- `data` 가 없으면 아무것도 그리지 않는다.(`dataTable.tsx`)

## 2. 페이저

- **`page` 를 주지 않거나 `null` 을 주면 페이저를 그리지 않는다.** 한 번에 다 보여 주는 목록이 이렇게 쓴다.(`dataTable.tsx`, `src/features/experienceEditor/ui/ExperienceList.tsx`)
- 페이저를 쓸 때는 `page` · `hndlPage` · `opts` 를 함께 준다. 지금 페이지는 바깥이 갖는다.
- `opts.pageSize` 가 한 페이지 건수, `opts.pagingLen` 이 한 번에 늘어놓을 번호의 개수다. 주지 않으면 둘 다 10 이다.(`dataTable.tsx`)

```tsx
<DataTable
    columns={COLUMNS}
    data={data}
    opts={{ pageSize: 10, pagingLen: 5 }}
    page={page}
    hndlPage={setPage}
/>
```

## 3. 컬럼

컬럼은 TanStack 의 `ColumnDef` 그대로다. **열의 폭과 정렬은 `meta.className` 으로 정한다.**(`src/types/tanstack-table.d.ts`)

```tsx
{
    id: 'period',
    header: '기간',
    meta: { className: 'px-4 md:w-[18%] tabular-nums' },
    cell: ({ row }) => row.original.periodText,
}
```

- 문자열이면 머리 칸과 몸 칸에 함께 붙는다. 함수면 `({ row, column, table })` 를 받아 행마다 다른 클래스를 내고, 몸 칸에만 붙는다.(`dataTable.tsx`)
- 문자열에 `hidden` 이 든 열은 빈 목록의 `colSpan` 에서 뺀다. 함수로 숨긴 열은 세지 못한다.(`dataTable.tsx`)
- 표는 `md` 부터 `table-fixed` 다. 폭을 주지 않은 열이 남은 폭을 나눠 갖는다.(`dataTable.tsx`)

셀은 `table.options.meta` 로 아래 값을 꺼내 쓴다. `meta` prop 으로 넘긴 값은 이 뒤에 펼쳐진다.(`dataTable.tsx`)

| 키           | 내용                    |
| ------------ | ----------------------- |
| `fullData`   | 넘긴 `data` 통째로      |
| `totalCount` | `totalElements`         |
| `pageIndex`  | 지금 페이지. 1부터 센다 |
| `pageSize`   | 한 페이지 건수          |

## 4. 머리줄

표 위 한 줄에 「전체 N」 · 선택 개수 · `rightSlot` 이 놓인다. 셋 다 없으면 그 줄을 그리지 않는다.(`dataTable.tsx`)

| prop              | 내용                                              | 기본                   |
| ----------------- | ------------------------------------------------- | ---------------------- |
| `visibleTotalCnt` | 「전체 N」. 천 단위로 끊어 적는다                 | `true`                 |
| `rightSlot`       | 줄의 오른쪽 끝. 검색 조건이나 등록 버튼을 둔다    |                        |
| `visibleHeader`   | 표의 머리 행                                      | `true`                 |
| `emptyMessage`    | 행이 없을 때의 문구. 주면 빈 칸의 높이가 낮아진다 | 「데이터가 없습니다.」 |

## 5. 행 클릭

- `hndlRowClick` 을 주면 행 전체가 눌리고 커서가 손가락으로 바뀐다. `disabledRow` 가 참을 돌려준 행은 눌리지 않고 커서도 그대로다.(`dataTable.tsx`)
- 누른 자리에서 5px 넘게 움직였으면 끌기로 보고 세지 않는다. 셀의 글자를 긁어 복사하는 동안 넘어가지 않게 한다.(`dataTable.tsx`)
- 행 클릭은 키보드로 누를 수 없다. 가는 곳이 있는 행에는 셀 안에 링크를 함께 둔다.(`src/features/experienceEditor/ui/ExperienceList.tsx`)

## 6. 선택

- **선택의 정본은 바깥의 `selections` 다.** 안쪽에 선택 상태를 따로 두지 않고, 이 페이지의 행 가운데 `selections` 에 있는 것을 선택된 것으로 그린다.(`dataTable.tsx`)
- 대조는 행의 `id` 로 한다. `id` 가 없는 행에는 선택이 붙지 않는다.(`dataTable.tsx` 의 `readId`)
- 체크박스 열은 컴포넌트가 만들어 주지 않는다. 컬럼 정의에 넣고 `row.getToggleSelectedHandler()` 를 잇는다.(`__test__/dataTable.test.tsx`)

| 넘긴 것                          | 어떻게 불리는가                            |
| -------------------------------- | ------------------------------------------ |
| `hndlRowSelection` 만            | 바뀔 때마다 이 페이지의 선택 전부를 통째로 |
| `hndlRowRemoveSelection` 도 함께 | 늘어난 행과 줄어든 행을 나눠서 각각        |

- 다른 페이지에서 고른 행은 지금 화면에 없다는 이유로 풀지 않는다.(`dataTable.tsx`)
- `onClearSelection` 을 주면 선택이 있을 때 머리줄에 모두 푸는 버튼이 붙는다.

## 7. 정렬과 필터

- `hndlSort` · `hndlFilter` 는 사용자가 바꿨을 때만 불린다. 처음 그릴 때와 바깥이 `sorts` · `filters` 를 바꿨을 때는 불리지 않는다.(`dataTable.tsx`)
- `sorts` · `filters` 를 주면 안쪽 상태를 그 값에 맞춘다. 주소의 쿼리에서 읽은 정렬을 되돌려 넣는 자리다.
- `defaultSort` 를 주면 정렬을 다 풀었을 때 그 값으로 되돌아간다.
- Shift · Cmd · Ctrl 을 누른 채 누르면 여러 열로 정렬한다.

## 자주 하는 실수

| 이렇게 쓰면                     | 이렇게                              | 이유                                                                                                              |
| ------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 행 배열을 그대로 `data` 에      | `{ content, totalElements }`        | `content` 를 읽는다(`dataTable.types.ts`)                                                                         |
| 셀 안 버튼을 그대로 둔다        | `event.stopPropagation()` 을 붙인다 | 행 클릭이 함께 일어난다(`dataTable.tsx`)                                                                          |
| 확인 창을 여는 버튼만 막는다    | 버튼을 감싼 요소에서 막는다         | 확인 창은 문서 끝에 그려져도 React 의 이벤트는 셀을 거친다(`src/features/experienceEditor/ui/ExperienceList.tsx`) |
| 서버 컴포넌트에서 컬럼을 넘긴다 | 클라이언트 컴포넌트에서 정의한다    | 컬럼 정의에 함수가 든다(`dataTable.tsx`)                                                                          |
| 클라이언트 정렬을 기대한다      | `hndlSort` 로 다시 읽는다           | 정렬은 상태만 갖는다(`dataTable.tsx`)                                                                             |

## Kozipsa 원본과 다른 점

- **건수 선택(`useViewCnt` · `hndlPageSize`)과 머리 부품 4개(`SortButton` · `HeaderInputSearch` · `HeaderSelect` · `HeaderMultiSelect`)는 아직 가져오지 않았다.** `Popover` · `Command` · `Badge` 가 있어야 한다. 쓰는 목록이 생길 때 가져온다.(2026-11-18 사용자 결정)
- `page` · `hndlPage` · `opts` 가 선택 값이다. 원본은 타입에서 필수였지만 페이저가 없으면 쓰지 않았다.(`dataTable.tsx`)
- 마운트 전에도 그린다. 원본은 마운트한 뒤에만 그려, 서버에서 그린 화면에 표가 없었다.(`dataTable.tsx`)
- 선택 상태를 안쪽에 두지 않고 `selections` 에서 바로 구한다. 원본은 사본을 두고 `selections` 가 바뀔 때마다 다시 만들었다.(`dataTable.tsx`)
- 정렬 · 필터 핸들러를 상태가 바뀐 뒤가 아니라 바꾸는 자리에서 부른다. 원본은 첫 렌더를 걸러 내려고 타이머를 썼다.(`dataTable.tsx`)
- `lodash` 와 `react-number-format` 을 쓰지 않는다. 값 비교와 천 단위 표기를 직접 한다.(`dataTable.tsx`)
- `ref` 는 prop 으로 받는다. React 19 는 `forwardRef` 가 필요 없다.(`dataTable.tsx`)
- 색을 이 사이트의 토큰으로 바꿨다.(`docs/theme.md` 1절)

## 이 컴포넌트를 고칠 때

- 표의 뼈대(줄 높이, 구분선, hover)는 `src/shared/ui/table/table.tsx` 가 갖는다.
- 컬럼과 표의 `meta` 타입은 `src/types/tanstack-table.d.ts` 에서 더한다.
- 테스트는 `__test__/dataTable.test.tsx` 에 있다. 페이저 없이 쓰기, 행 클릭, 정렬, 선택의 계약을 지킨다.
