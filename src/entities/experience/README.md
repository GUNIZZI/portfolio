# experience

소개 페이지에 싣는 경력이다. 회사 하나가 한 건이고, 그 아래에 프로젝트 목록이 있다.
저장소는 Firestore 의 `experiences` 컬렉션이다. 회사 1곳이 문서 1개이고, 프로젝트 목록은 그 문서 안의 배열이다.(`docs/architecture.md` 4.1절, `docs/plan/admin/experiences/README.md` 「저장소」)

| 파일                                      | 내용                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `model/experience.constants.ts`           | 컬렉션 이름, 캐시 태그, 항목의 오류 문구                                          |
| `model/experience.schemas.ts`             | 경력 1건의 스키마. 규칙과 오류 문구를 함께 둔다. 폼과 서버가 같이 쓴다            |
| `model/experience.types.ts`               | `ExperienceResponse`(원문) · 화면용 `~Data` · 저장 결과(`EXPERIENCE_SAVE_STATUS`) |
| `repositories/experience.repositories.ts` | 전체를 읽고 검증한다. 1건을 등록 · 수정 · 삭제한다                                |
| `services/experience.services.ts`         | 읽은 결과를 순서대로 놓고 캐시한다. 화면용으로 바꾸고, 검증해 저장한다            |
| `actions/experience.actions.ts`           | 등록 · 수정 · 삭제 서버 액션. 세션을 검사하고 캐시를 지운다                       |

서버에서만 실행한다. 클라이언트 컴포넌트는 `actions` 의 서버 액션과 `model` 만 가져온다.(`docs/architecture.md` 4절)

- 오류 문구는 스키마가 낸다. 폼은 따로 검사하지 않고 그 문구를 그린다.(`docs/architecture.md` 4.3절)
- 경력은 저장소가 발급한 `id` 로 구분한다.(`docs/plan/admin/experiences/README.md` 「등록 · 수정」)
- 들어간 해가 늦은 회사부터 놓는다. 저장소가 주는 순서는 정해져 있지 않아 `services` 가 놓는다.(`services/experience.services.ts` 의 `sortExperienceList`)
- 프로젝트 연결은 지금 프로젝트의 `slug`(`workSlug`)로 잇는다. 프로젝트를 저장소로 옮길 때 `projectId` 로 바꾼다.(`docs/plan/admin/experiences/README.md` 「기존 내용 이전」)
- `src/app/(site)/about/page.tsx` 가 읽어 `features/experienceTimeline` 에, 관리 화면의 페이지가 읽어 `features/experienceEditor` 에 넘긴다.

처음 내용은 기존 소개 페이지(`gunizzi.github.io/guni/about`)에서 옮긴 회사 6곳이다.(2026-11-16 사용자 결정) `content/experiences.json` 에 있던 것을 2026-11-18 에 저장소로 옮기고 파일을 지웠다.
