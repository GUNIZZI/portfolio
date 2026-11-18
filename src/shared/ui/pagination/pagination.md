# Pagination

여러 페이지로 잘린 목록의 번호줄이다. Kozipsa 의 Pagination 을 가져왔다.(`pagination.tsx`, Kozipsa `packages/ui` 의 `custom/pagination` 에서 가져옴, 2026-11-18 사용자 결정)
`DataTable` 이 `page` 를 받았을 때 표 아래에 그린다.(`src/shared/ui/dataTable/dataTable.tsx`)

| prop           | 값                                                     | 기본 |
| -------------- | ------------------------------------------------------ | ---- |
| `totalCount`   | 전체 건수                                              |      |
| `page`         | 지금 페이지. 1부터 센다                                |      |
| `pageSize`     | 한 페이지 건수                                         |      |
| `visiblePages` | 한 번에 늘어놓을 번호의 개수                           | `5`  |
| `onPageChange` | 번호나 화살표를 눌렀을 때. 주지 않으면 넘어가지 않는다 |      |
| `className`    | 바깥 `nav` 에 붙는다                                   |      |

```tsx
import { Pagination } from '@/shared/ui/pagination/pagination';

<Pagination totalCount={totalElements} page={page} pageSize={10} onPageChange={setPage} />;
```

- **값을 스스로 갖지 않는다.** 지금 페이지는 바깥이 갖고, 이 컴포넌트는 누른 번호를 알리기만 한다.(`pagination.tsx`)
- 건수가 0이면 그리지 않는다.(`pagination.tsx`)
- 번호 창은 지금 페이지를 가운데 둔다. 끝에 닿으면 반대쪽으로 밀어 개수를 지킨다. 개수가 짝수면 앞쪽을 한 칸 짧게 둔다.(`pagination.utils.ts` 의 `getPageNumbers`)
- 생략 기호(`…`)는 없다. 창 밖의 페이지로는 화살표로 한 칸씩 간다.(Kozipsa `pagination.md` 3절)
- 지금 페이지에는 `aria-current="page"` 를 준다. 첫 페이지의 이전과 끝 페이지의 다음은 비활성이다.(`pagination.tsx`)

## Kozipsa 원본과 다른 점

- 번호와 화살표를 주소 없는 링크(`href="#"`) 대신 `<button>` 으로 그린다. 페이지를 옮기는 것은 바깥이라 갈 주소가 없다.(`pagination.tsx`)
- shadcn 의 `pagination.base` 를 따로 두지 않고 한 파일에 합쳤다. 쓰는 조각이 번호와 화살표뿐이다.(`pagination.tsx`)
- 지금 페이지의 밑줄은 `primary`, hover 의 밑줄은 `border` 다. 밑줄이 바뀌는 연출은 뺐다.(`docs/plan/admin/README.md` 「모션」)
