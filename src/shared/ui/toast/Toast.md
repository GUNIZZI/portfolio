# Toast

화면 아래 가운데에 잠깐 띄우는 알림이다. 관리 화면에서 저장한 결과를 알린다.(`docs/plan/admin/about/wireframe.html` P-01)

| prop      | 값                                            | 기본 |
| --------- | --------------------------------------------- | ---- |
| `message` | 알릴 문구. `null` 이면 아무것도 그리지 않는다 |      |

```tsx
<Toast message={message} />
```

- `role="status"` 로 알린다.(`docs/plan/admin/about/README.md` 「접근성 · 성능 고려」)
- 문구가 없을 때도 `role="status"` 요소는 남긴다. 나중에 생긴 요소는 스크린 리더가 읽지 않는다.(`Toast.tsx`)
- 층은 `z-modal` 이다.(`docs/theme.md` 3절)
- 연출은 없다. 바로 나타나고 바로 사라진다.(`docs/plan/admin/about/README.md` 「모션」)

## 자주 하는 실수

- 이 컴포넌트는 그리기만 한다. 띄우고 지우는 때는 쓰는 쪽이 정한다.(`src/features/aboutEditor/model/aboutEditor.contexts.tsx`)

## 이 컴포넌트를 고칠 때

띄워 두는 시간은 쓰는 쪽에 있다. 여러 곳이 쓰게 되면 그 값을 이 폴더로 옮긴다.
