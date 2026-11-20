# TiptapEditor

Tiptap 으로 본문을 쓰는 에디터다. 내는 값은 HTML 이다.(`TiptapEditor.tsx`, 2026-11-19 사용자 결정, `docs/plan/admin/README.md` 요구사항 12 · 32)
관리 화면의 프로젝트 폼이 케이스 스터디 본문에 쓴다.(`src/features/projectEditor/ui/ProjectForm.tsx`)
쓴 본문을 읽는 화면은 `TiptapViewer` 다.(`src/shared/ui/tiptapViewer/TiptapViewer.md`)

| prop        | 값                                     | 기본 |
| ----------- | -------------------------------------- | ---- |
| `value`     | 본문의 HTML                            |      |
| `onChange`  | 내용을 고칠 때마다 새 HTML 로 부른다   |      |
| `onBlur`    | 편집 영역에서 포커스가 나갈 때 부른다  |      |
| `label`     | 편집 영역의 이름. 스크린 리더가 읽는다 |      |
| `className` | 바깥 요소에 붙는다                     | 없음 |

```tsx
import TiptapEditor from '@/shared/ui/tiptapEditor/TiptapEditor';

<TiptapEditor label="본문" value={body} onChange={setBody} />;
```

react-hook-form 에서는 `Controller` 로 잇는다.(`src/features/projectEditor/ui/ProjectForm.tsx`)

## 서식

| 서식      | 내는 태그          |
| --------- | ------------------ |
| 제목      | `h2` · `h3`        |
| 굵게      | `strong`           |
| 취소선    | `s`                |
| 코드      | `code`             |
| 링크      | `a`                |
| 목록      | `ul` · `ol` · `li` |
| 인용      | `blockquote`       |
| 코드 블록 | `pre` > `code`     |
| 구분선    | `hr`               |

- **이미지와 표는 받지 않는다.**(`docs/plan/admin/README.md` 「등록 · 수정」)
- 제목은 `h2` · `h3` 만 받는다. 본문의 절이 `h2` 다.(`docs/plan/work/README.md` 「상세」)
- 기울임과 밑줄은 버튼이 없지만 단축키와 붙여넣기로 들어올 수 있다. 저장하는 쪽이 `em` · `u` 도 남긴다.(`src/entities/project/services/project.services.ts` 의 `BODY_ALLOWED_TAGS`)
- 링크 버튼을 누르면 도구 줄 아래에 주소 입력이 펼쳐진다. 주소를 비우고 적용하면 링크를 푼다. Esc 로 닫는다.
- 쓰는 동안에는 링크를 눌러도 열리지 않는다.

## 모양

- **편집 영역은 읽는 화면과 같은 서식 클래스(`tiptap-content`)를 단다.** 쓰면서 보던 모습 그대로 읽힌다. 서식의 정본은 `src/shared/ui/tiptapViewer/tiptapContent.css` 하나다.
- 테두리와 바탕은 Input 과 같다. 편집 영역에 포커스가 있으면 테두리가 `primary` 로 바뀐다.
- 도구 줄의 버튼은 `ghost` 버튼이다. 켜진 서식은 `aria-pressed` 로 알리고 글자색(`primary`)으로 구분한다.
- 나타나고 사라지는 연출은 없다. 관리 화면에는 연출을 두지 않는다.(`docs/plan/admin/README.md` 「모션」)

## 자주 하는 실수

- **에디터가 낸 HTML 을 그대로 믿지 않는다.** 저장하는 쪽에서 정제한다. 읽는 화면은 정제하지 않고 그대로 그린다.(`src/entities/project/services/project.services.ts` 의 `sanitizeProjectBody`)
- 빈 에디터는 빈 문자열이 아니라 `<p></p>` 를 낸다. 비었는지는 저장하는 쪽이 글자가 있는지로 본다.
- 서버에서는 그려지지 않는다. 브라우저에서 에디터가 만들어진 뒤에 도구 줄과 편집 영역이 나타난다.(`TiptapEditor.tsx` 의 `immediatelyRender`)
- jsdom 에서는 그려지지 않는다. 에디터를 쓰는 화면의 단위 테스트는 이 컴포넌트를 글상자로 바꿔 값이 이어지는지만 본다.(`src/features/projectEditor/ui/__test__/ProjectForm.test.tsx`)

## Kozipsa 와 다른 점

- Kozipsa 의 에디터는 이미지 · 표 · 글자 정렬 · 글자색을 함께 쓴다. 여기서는 가져오지 않았다. 케이스 스터디에 쓰는 서식만 뒀다.(Kozipsa `packages/ui` 의 `custom/tiptapEditor`)
- 패키지는 `@tiptap/react` · `@tiptap/pm` · `@tiptap/starter-kit` 3개다. 링크와 목록은 `starter-kit` 에 들어 있다.(`package.json`)
