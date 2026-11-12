# project

포트폴리오에 싣는 작업이다. 원문은 `content/projects.ts` 다.

| 파일                                   | 내용                                            |
| -------------------------------------- | ----------------------------------------------- |
| `model/project.schemas.ts`             | 원문 스키마                                     |
| `model/project.types.ts`               | `ProjectResponse`(원문) · `ProjectData`(화면용) |
| `repositories/project.repositories.ts` | 원문을 읽고 검증한다                            |
| `services/project.services.ts`         | 화면용으로 바꾼다. 상세 주소의 기본값을 채운다  |

서버에서만 실행한다. 클라이언트 컴포넌트에는 `page` 가 `ProjectData` 를 넘긴다.(docs/architecture.md 4절)
