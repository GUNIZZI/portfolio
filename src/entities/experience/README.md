# experience

소개 페이지에 싣는 경력이다. 회사 하나가 한 건이고, 그 아래에 프로젝트 목록이 있다.
원문은 `content/experiences.json` 이다.

| 파일                                      | 내용                                                          |
| ----------------------------------------- | ------------------------------------------------------------- |
| `model/experience.schemas.ts`             | 원문 스키마                                                   |
| `model/experience.types.ts`               | `ExperienceResponse`(원문) · `ExperienceData`(화면용)         |
| `repositories/experience.repositories.ts` | 원문을 읽고 검증한다                                          |
| `services/experience.services.ts`         | 화면용으로 바꾼다. 기간 문구, 처음부터 펼칠지, 작업 상세 주소 |

서버에서만 실행한다. 클라이언트 컴포넌트에는 `page` 가 `ExperienceData` 를 넘긴다.(docs/architecture.md 4절)

원문은 기존 소개 페이지(`gunizzi.github.io/guni/about`)의 내용을 옮긴 임시 데이터다.(2026-11-16 사용자 결정)
회사 6곳, 프로젝트 56개다. 회사별 `summary` 는 프로젝트 목록을 보고 쓴 초안이고 사용자가 고친다. `src/app/(site)/about/page.tsx` 가 읽어 `features/experienceTimeline` 에 넘긴다.
