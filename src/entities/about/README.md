# about

소개 페이지와 홈의 소개 섹션에 보이는 문구다. 저장소는 Firestore 의 `about` 컬렉션이다.(`docs/architecture.md` 4.1절)

| 파일                                 | 내용                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `model/about.constants.ts`           | 섹션 4개의 문서 이름, 캐시 태그, 개수가 고정인 목록의 개수               |
| `model/about.schemas.ts`             | 섹션마다의 스키마. 폼과 서버가 같은 규칙으로 검증한다                    |
| `model/about.types.ts`               | `AboutResponse`(원문) · 화면용 `~Data` · 저장 결과(`ABOUT_SAVE_STATUS`)  |
| `repositories/about.repositories.ts` | 섹션 4개를 읽고 검증한다. 섹션 1건을 저장한다                            |
| `services/about.services.ts`         | 읽은 결과를 캐시한다. 섹션별로 꺼내고, 수정 일시 문구를 만들고, 저장한다 |
| `actions/about.actions.ts`           | 섹션 1건을 저장하는 서버 액션. 세션을 검사하고 캐시를 지운다             |

서버에서만 실행한다. 클라이언트 컴포넌트는 `actions` 의 서버 액션과 `model` 만 가져온다.(`docs/architecture.md` 4절)

섹션은 `intro` · `principles` · `skillGroups` · `home` 4개이고, 문서 1개가 섹션 1개다.
일하는 방식 4개 · 기술 묶음 8개 · 숫자 3개는 개수를 바꿀 수 없다.(`docs/plan/admin/about/README.md` 「소개 내용」)
