# Table

표의 뼈대다. shadcn 의 Table 을 Kozipsa 가 고쳐 쓰던 것을 가져왔고, 구조와 이름은 그대로다.(`table.tsx`, Kozipsa `packages/ui` 의 `ui/table.tsx` 에서 가져옴, 2026-11-18 사용자 결정)
목록은 이 컴포넌트를 바로 쓰지 않고 `DataTable` 로 그린다.(`src/shared/ui/dataTable/dataTable.md`)

| 컴포넌트                       | 요소                    | 모양                                                          |
| ------------------------------ | ----------------------- | ------------------------------------------------------------- |
| `Table`                        | `<table>` 과 바깥 `div` | 폭을 부모에 맞춘다. 넘치면 바깥 `div` 가 가로로 스크롤한다    |
| `TableHeader`                  | `<thead>`               | 머리 칸에 `muted` 면을 깔고 양 끝을 둥글린다                  |
| `TableBody`                    | `<tbody>`               | 끝 행의 구분선을 지운다                                       |
| `TableRow`                     | `<tr>`                  | 칸마다 아래에 `line` 구분선. hover 와 선택된 행에 면을 얹는다 |
| `TableHead` · `TableCell`      | `<th>` · `<td>`         | 가운데 줄에 맞추고 줄을 바꾸지 않는다                         |
| `TableFooter` · `TableCaption` | `<tfoot>` · `<caption>` | shadcn 그대로다                                               |

```tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table/table';

<Table>
    <TableHeader>
        <TableRow>
            <TableHead>회사</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>KOCOM</TableCell>
        </TableRow>
    </TableBody>
</Table>;
```

- 행의 hover 는 `state-hover`, 선택된 행(`data-state="selected"`)은 `state-selected` 다.(`docs/theme.md` 1절)
- 칸의 좌우 여백은 8px 이다. 넓히려면 칸에 `className` 을 준다.(`src/features/experienceEditor/ui/ExperienceList.tsx`)

## Kozipsa 원본과 다른 점

- 색을 이 사이트의 토큰으로 바꿨다. 행의 구분선은 `line` 이다.(`docs/theme.md` 1절)
- 색이 바뀌는 연출을 뺐다. 관리 화면에는 연출을 두지 않는다.(`docs/plan/admin/README.md` 「모션」)
- 바깥 `div` 에 `overflow-x-auto` 를 줬다. 좁은 화면에서 표를 가로로 스크롤한다.(`docs/plan/admin/experiences/README.md` 「반응형」)
- 머리 줄의 양 끝을 둥글렸다.(`table.tsx`)
