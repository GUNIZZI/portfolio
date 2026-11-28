# colophon

「제작 과정」 페이지와 홈의 제작 과정 섹션에 보이는 글과 표다. 저장소는 Firestore 의 `colophon` 컬렉션이다.(`docs/architecture.md` 4.1절)

| 파일                                    | 내용                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `model/colophon.constants.ts`           | 섹션 7개의 문서 이름, 캐시 태그, 역할, 과정이 이어질 수 있는 섹션, 견본 글꼴, 목록의 최소 개수, 오류 문구, 처음 값 |
| `model/colophon.schemas.ts`             | 섹션마다의 스키마. 규칙과 오류 문구를 함께 둔다. 폼과 서버가 같이 쓴다                                             |
| `model/colophon.types.ts`               | `ColophonResponse`(원문) · 화면용 `~Data` · 저장 결과(`COLOPHON_SAVE_STATUS`)                                      |
| `repositories/colophon.repositories.ts` | 섹션 7개를 읽고 검증한다. 문서가 없는 섹션은 null 로 낸다. 섹션 1건을 저장한다                                     |
| `services/colophon.services.ts`         | 읽은 결과를 캐시한다. 없는 섹션을 처음 값으로 채우고, 수정 일시 문구를 붙이고, 저장한다                            |
| `actions/colophon.actions.ts`           | 섹션 1건을 저장하는 서버 액션. 세션을 검사하고 캐시를 지운다                                                       |

서버에서만 실행한다. 클라이언트 컴포넌트는 `actions` 의 서버 액션과 `model` 만 가져온다.(`docs/architecture.md` 4절)

섹션은 `head` · `process` · `design` · `develop` · `guards` · `human` · `stack` 7개이고, 문서 1개가 섹션 1개다.
섹션 안의 목록은 모두 개수와 순서를 바꿀 수 있다. 개발 단계마다의 링크만 0개가 될 수 있고, 나머지는 1개 이상이다.(`model/colophon.constants.ts` 의 `COLOPHON_MIN`, `docs/plan/admin/colophon/README.md` 「목록」)

- 한 번도 저장하지 않은 섹션은 저장소에 문서가 없다. `services` 가 `COLOPHON_DEFAULT_CONTENT` 로 채운다.(`docs/plan/admin/colophon/README.md` 「처음 값」)
- 처음 값이 스키마에 맞는지는 테스트가 본다.(`services/__test__/colophon.services.test.ts`)
- 과정의 단계는 1개 이상이고 개수와 순서를 바꿀 수 있다. 단계마다 이름 · 역할(`COLOPHON_ROLE`) · 이어지는 섹션(`COLOPHON_STEP_TARGETS`)을 둔다.(`docs/plan/admin/colophon/README.md` 「과정」)
- 이어지는 섹션의 값은 페이지의 섹션 id 와 같다. `features/colophon` 이 이 entity 의 섹션 이름으로 id 를 만든다.(`src/features/colophon/model/colophon.constants.ts` 의 `COLOPHON_SECTION_ID`)
- 디자인의 단락도 역할을 갖는다. 폰트는 이름과 견본 글꼴(`COLOPHON_FONT_FACE`)을 갖는다. 글꼴을 그리는 클래스는 `features/colophon` 이 갖는다.(`src/features/colophon/model/colophon.constants.ts` 의 `COLOPHON_FONT_FACE_CLASS`)
- 링크의 주소는 `https://` 나 `/` 로 시작하는 것만 받는다.(`model/colophon.schemas.ts`)
