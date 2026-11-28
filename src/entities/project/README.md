# project

포트폴리오에 싣는 프로젝트다. 공개 화면의 기획은 「작업」 이라고 적는다.
저장소는 Firestore 의 `projects` 컬렉션이다. 프로젝트 1건이 문서 1개다. 썸네일 파일은 Vercel Blob 에 둔다.(`docs/architecture.md` 4.1절, `docs/plan/admin/README.md` 「데이터」)

| 파일                                   | 내용                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `model/project.constants.ts`           | 컬렉션 이름, 캐시 태그, 썸네일의 제한, 오류 문구, 맡은 범위의 이름                       |
| `model/project.schemas.ts`             | 폼이 저장하는 내용(`ProjectContentSchema`)과 문서 1건(`ProjectSchema`)의 스키마          |
| `model/project.types.ts`               | `ProjectResponse`(원문) · 화면용 `~Data` · 저장 결과(`PROJECT_SAVE_STATUS`)              |
| `repositories/project.repositories.ts` | 문서를 읽고 검증한다. 등록 · 수정 · 삭제 · 순서 저장. 썸네일 파일의 토큰 발급과 삭제     |
| `services/project.services.ts`         | 읽은 결과를 순서대로 놓고 캐시한다. 공개 · 홈 노출로 거르고, 화면용으로 바꾸고, 저장한다 |
| `actions/project.actions.ts`           | 등록 · 수정 · 삭제 · 공개 · 홈 노출 · 순서 서버 액션. 세션을 검사하고 캐시를 지운다      |

서버에서만 실행한다. 클라이언트 컴포넌트는 `actions` 의 서버 액션과 `model` 만 가져온다.(`docs/architecture.md` 4절)

- 프로젝트는 저장소가 발급한 `id` 로 구분한다. 상세 주소도 `id` 를 쓴다(`/project/<id>`).(`docs/plan/admin/README.md` 요구사항 10)
- 공개 화면은 공개한 프로젝트만 그린다. 홈은 그 가운데 홈 노출을 켠 것만 그린다.(`services/project.services.ts` 의 `getProjectList` · `getFeaturedProjectList`, `docs/plan/admin/README.md` 요구사항 26)
- 비공개 프로젝트는 홈 노출을 켤 수 없고, 비공개로 바꾸면 홈 노출도 함께 꺼진다. 서버가 저장할 때 맞춘다.(`services/project.services.ts` 의 `parseContent` · `setProjectPublished` · `setProjectFeatured`)
- 순서는 문서의 `order` 다. 작은 수가 앞이고, 새 프로젝트는 맨 뒤에 놓는다. 저장소가 주는 순서는 정해져 있지 않아 `services` 가 놓는다.(`services/project.services.ts` 의 `sortProjectList` · `createProject`)
- 오류 문구는 스키마가 낸다. 폼은 따로 검사하지 않고 그 문구를 그린다.(`docs/architecture.md` 4.3절)
- 폼은 기본 항목(제목 · 분류 · 요약 · 상세 주소 · 썸네일 · 공개 · 홈 노출)과 상세 항목(팀 · 역할 · 맡은 범위 · 기간 · 기술 · 링크 · 본문)을 함께 저장한다. 수정은 폼의 항목만 바꾸고 순서와 등록 시각은 남긴다.(`model/project.schemas.ts` 의 `ProjectContentSchema`, `repositories/project.repositories.ts` 의 `updateProject`, `docs/plan/admin/README.md` 요구사항 29)
- 본문은 저장하기 전에 정제한다. 에디터가 내는 서식의 태그만 남기고, 글자도 구분선도 이미지도 없으면 저장하지 않는다.(`services/project.services.ts` 의 `sanitizeProjectBody`)
- 본문의 이미지는 이미지 저장소의 주소만 남긴다. 본문에서 뺀 이미지와 지운 프로젝트의 본문 이미지는 파일도 지운다.(`services/project.services.ts` 의 `sanitizeProjectBody` · `toBodyImageList` · `updateProject` · `deleteProject`)
- 맡은 범위의 영역 · 단계 이름은 `model/project.constants.ts` 에 있다. 상세 화면과 관리 화면의 폼이 함께 쓴다.
- 분류는 정해 둔 목록(`PROJECT_CATEGORIES`)의 값만 저장한다. 읽을 때는 글자이기만 하면 받는다. 목록에서 뺀 분류의 프로젝트도 화면에 그려야 한다.(`model/project.constants.ts`, `model/project.schemas.ts`, `docs/plan/admin/README.md` 요구사항 33)
- 썸네일은 이미지 저장소의 주소만 받는다.(`model/project.schemas.ts` 의 `ProjectImageSchema`)
- `src/app/(site)/` 의 홈 · 작업 페이지가 읽어 `features/featuredProjects` · `projectExplorer` · `projectDetail` 에, 관리 화면의 페이지가 읽어 `features/projectEditor` 에 넘긴다. 경력 화면은 프로젝트 연결을 위해 id 와 제목을 읽는다.

처음 내용은 `content/projects.ts` 의 4건이다. `scripts/migrate-projects.mjs` 로 한 번 옮긴다.(`docs/plan/admin/README.md` 「기존 프로젝트 이전」)
