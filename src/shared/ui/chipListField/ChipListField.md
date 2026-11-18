# ChipListField

짧은 이름의 목록을 고치는 입력이다. 항목을 옆으로 늘어놓고, 자리가 모자라면 다음 줄로 넘긴다.(`ChipListField.tsx`)
소개의 성장 경로 · Skill 이름과 경력의 기술 태그가 쓴다. 두 화면이 함께 쓰게 되어 `features/aboutEditor` 에서 올렸다.(2026-11-18 사용자 결정, `src/features/aboutEditor/` · `src/features/experienceEditor/ui/ProjectRow.tsx`)

| prop         | 값                                                                        | 기본    |
| ------------ | ------------------------------------------------------------------------- | ------- |
| `label`      | 목록의 이름. 있으면 위에 적는다                                           |         |
| `items`      | 지금 목록                                                                 |         |
| `onChange`   | 더하거나 빼거나 옮긴 새 목록을 받는다                                     |         |
| `min`        | 남겨야 하는 최소 개수. 이만큼만 남으면 뺄 수 없다                         |         |
| `addLabel`   | 새 항목을 적는 입력의 안내 문구                                           |         |
| `inputLabel` | 새 항목을 적는 입력의 이름. 주지 않으면 `label` 이나 `addLabel` 로 만든다 |         |
| `isNested`   | 카드 안에 넣어 쓰는지. 바탕을 카드보다 한 단계 밝은 면으로 바꾼다         | `false` |

```tsx
import ChipListField from '@/shared/ui/chipListField/ChipListField';

<ChipListField
    label="성장 경로"
    items={items}
    onChange={hndlChange}
    min={2}
    addLabel="항목 이름"
/>;
```

- 항목을 끌어서 순서를 바꾼다. 키보드로는 옮기지 않는다.(2026-11-18 사용자 결정, `docs/plan/admin/about/README.md` 「목록 고치기」)
- 끄는 동안에는 놓을 자리에 선만 세우고, 놓았을 때 한 번 옮긴다. 끄는 동안 바로 옮기면 폭이 다른 항목끼리 자리가 계속 뒤바뀐다.(`ChipListField.tsx`)
- 새 항목은 입력에 적고 Enter 나 추가 버튼으로 맨 끝에 더한다. 한글 조합 중의 Enter 는 넘긴다.(`ChipListField.tsx`)
- 빼기 버튼의 이름에는 항목의 이름을 넣는다.(`ChipListField.tsx`)

## 자주 하는 실수

- 한 화면에 여럿을 놓고 `label` 을 주지 않으면 입력의 이름이 모두 같아진다. `inputLabel` 로 어느 목록의 입력인지 적는다.(`src/features/experienceEditor/ui/ProjectRow.tsx`)
