# TiptapViewer

Tiptap 에디터로 작성한 본문(HTML)을 읽는 화면이다. Kozipsa 의 `TiptapViewer` 를 가져왔다.(2026-11-16 사용자 결정)
작업 상세의 케이스 스터디가 쓴다.

| prop        | 값                    | 기본 |
| ----------- | --------------------- | ---- |
| `content`   | 보여 줄 HTML          |      |
| `className` | 바깥 요소의 여백 · 폭 | 없음 |

```tsx
<TiptapViewer content={project.body} className="max-w-170" />
```

비면 아무것도 그리지 않는다. 래퍼 `div` 도 만들지 않으므로 「내용 없음」 표시는 부르는 쪽이 만든다.

## Kozipsa 와 다른 점

- **서버에서 그린다.** 작업 상세는 검색에 잡혀야 해서 본문이 첫 HTML 에 들어 있어야 한다. Kozipsa 는 브라우저에서 정제한 뒤에 채워 첫 HTML 이 비어 있다.
- **이 컴포넌트는 정제하지 않는다.** 믿을 수 있는 HTML 만 넘긴다. 지금은 저장소 안의 원문(`content/projects.ts`)이다.
- 글자 크기는 16px 이다. Kozipsa 는 14px 이다. 체크 목록과 웹뷰용 규칙은 가져오지 않았다.

## 자주 하는 실수

- 외부에서 받은 HTML 을 그대로 넘기지 않는다. 스크립트가 섞여 있으면 여는 순간 실행된다. 관리 화면에서 본문을 받게 되면 저장하는 쪽에서 정제한다.
- `dangerouslySetInnerHTML` 로 직접 그리지 않는다. 서식 CSS 가 붙지 않아 제목과 목록이 무너진다.

## 이 컴포넌트를 고칠 때

서식은 `tiptapContent.css` 가 정본이다. 이 파일은 그 클래스(`tiptap-content`)를 단 `div` 하나다.
관리 화면에 Tiptap 에디터를 붙이면 편집 요소에도 같은 클래스를 달아, 작성하며 보던 모습이 그대로 읽히게 한다.
색은 `src/style/tokens/color.css` 의 변수만 쓴다.
