# analytics

관리 화면의 대시보드가 읽는 방문 통계다. 저장소는 Google Analytics 4 이고 읽기만 한다.(`docs/architecture.md` 4.4절, `docs/plan/admin/dashboard/README.md` 「데이터」)

| 파일                                     | 내용                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `model/analytics.constants.ts`           | 고를 수 있는 기간, 세는 주소, 캐시 태그                                      |
| `model/analytics.types.ts`               | GA 에서 받은 `~Response` · 화면용 `~Data` · 새로 고침 결과                   |
| `repositories/analytics.repositories.ts` | GA Data API 를 부른다. 합계 · 날짜별 · 주소별 값과 지금 접속자를 받는다      |
| `services/analytics.services.ts`         | 기간의 구간을 정하고, 받은 값을 블록의 모양으로 바꿔 1시간 간직한다          |
| `actions/analytics.actions.ts`           | 새로 고침 서버 액션. 세션을 검사하고 GA 에 닿을 때만 그 기간의 캐시를 지운다 |

서버에서만 실행한다. 클라이언트 컴포넌트는 `actions` 의 서버 액션과 `model` 만 가져온다.(`docs/architecture.md` 4절)

- GA 는 Firebase 서비스 계정으로 부른다. GA 속성에 이 계정을 뷰어로 더해 두고, 속성의 숫자 id 를 `GA_PROPERTY_ID` 에 적는다.(`repositories/analytics.repositories.ts` · `src/shared/util/serverEnv.ts`)
- 기간은 오늘을 뺀 최근 7일 · 30일 · 90일이다. 오늘이 며칠인지는 한국 시각으로 따진다.(`services/analytics.services.ts` 의 `toAnalyticsPeriod`)
- 관리 화면의 주소(`/admin` 아래)는 합계와 추이에서 뺀다.(`repositories/analytics.repositories.ts` 의 `EXCLUDE_ADMIN_FILTER`)
- 값은 기간마다 따로 간직한다. 받지 못해 던진 것은 간직하지 않는다.(`model/analytics.constants.ts` 의 `toAnalyticsCacheTag`)
- 지금 접속자는 간직하지 않고 부를 때마다 받는다. 실시간 보고서에 주소 차원이 없어 관리 화면의 주소를 빼지 못한다.(`services/analytics.services.ts` 의 `getAnalyticsRealtime` · `repositories/analytics.repositories.ts` 의 `getRealtimeActiveUsers`)
- 프로젝트별 조회수는 프로젝트의 id 까지만 낸다. 제목은 `features/dashboard` 가 entity `project` 와 잇는다.(`docs/architecture.md` 3절)
- `features/dashboard` 의 블록이 저마다 `services` 를 부른다.
