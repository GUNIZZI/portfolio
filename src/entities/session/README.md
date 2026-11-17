# session

관리 화면의 로그인 상태다. 저장소는 Firebase Auth 다.(`docs/architecture.md` 4.1절)

| 파일                                   | 내용                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `model/session.constants.ts`           | 쿠키 이름, 세션 시간(2시간), 관리 화면 주소                             |
| `model/session.schemas.ts`             | 로그인 폼과 Firebase Auth 응답의 스키마                                 |
| `model/session.types.ts`               | `SessionData` · 로그인 상태(`LOGIN_STATUS`)                             |
| `repositories/session.repositories.ts` | Firebase Auth 로 비밀번호를 확인하고, 세션 쿠키 값을 발급 · 검증한다    |
| `services/session.services.ts`         | 관리자인지 판별한다. `getSession` · `requireSession` 으로 세션을 읽는다 |
| `actions/session.actions.ts`           | `login` · `logout` 서버 액션. 쿠키를 쓰고 지운다                        |

서버에서만 실행한다. 클라이언트 컴포넌트는 `actions` 의 서버 액션과 `model` 만 가져온다.(`docs/architecture.md` 4절)

환경 변수 5개가 필요하다. 이름과 검증은 `src/shared/util/serverEnv.ts` 에 있다.
