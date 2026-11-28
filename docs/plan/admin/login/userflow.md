# 로그인 — 유저 플로우

[README.md](./README.md) 의 정책을 기준으로 관리자 동작을 흐름으로 옮겼다.
화면 ID(`S-01` 등)는 [wireframe.html](./wireframe.html) 의 ID 와 같다.

## 1. 전체 흐름

```mermaid
flowchart TD
    IN["주소 직접 입력 /admin · /admin/login"]:::step --> SS{"세션이 있는가"}:::decision
    SS -->|"아니요"| LG["S-01 로그인"]:::screen
    SS -->|"예"| PJ(["대시보드로"]):::done
    DEEP["관리 화면의 주소로 바로 들어옴"]:::step --> SS2{"세션이 있는가"}:::decision
    SS2 -->|"아니요"| LG
    SS2 -->|"예"| PAGE(["그 화면으로"]):::done
    LG -->|"로그인 성공"| PJ
    LG -->|"로고 · 사이트로 돌아가기"| HOME(["공개 화면의 홈으로"]):::done
```

- 세션은 `/admin` 아래의 모든 화면에서 서버가 검사한다.
- `/admin` 은 화면을 그리지 않는다. 세션에 따라 로그인이나 대시보드로 보낸다.
- 로그인하지 않고 관리 화면의 주소로 들어와도, 로그인한 뒤에는 대시보드로 간다. 들어오려던 주소는 기억하지 않는다.
- 대시보드부터의 흐름은 [대시보드](../dashboard/userflow.md)에 있다.

## 2. 로그인

```mermaid
flowchart TD
    L["S-01 로그인"]:::screen --> IN["이메일 · 비밀번호 입력"]:::step
    IN --> FILL{"2개를 모두 입력했는가"}:::decision
    FILL -->|"아니요"| DIS["로그인 버튼 비활성"]:::warn
    DIS -.-> IN
    FILL -->|"예"| A[/"서버가 Firebase Auth 에 확인"/]:::api
    A --> REACH{"Firebase 에 닿았는가"}:::decision
    REACH -->|"아니요"| FAIL["S-02 실패 안내"]:::warn
    FAIL -.-> IN
    REACH -->|"예"| OK{"관리자 계정인가"}:::decision
    OK -->|"아니요"| NO["S-02 거절 안내"]:::warn
    NO -.-> IN
    OK -->|"예"| SE[/"세션 쿠키 발급"/]:::api
    SE --> PJ(["대시보드로"]):::done
```

- 관리자 계정은 Firebase 콘솔에서 Firebase Auth 에 등록한 계정이다. 로그인 화면에서는 가입할 수 없다.
- 「관리자 계정인가」 는 2가지를 본다. 이메일과 비밀번호가 맞고, 그 계정의 UID 가 `ADMIN_UID` 와 같아야 한다.
- 거절과 실패 모두 세션을 만들지 않는다. 입력한 값은 그대로 둔다.
- 확인하는 동안 로그인 버튼은 비활성이다.

## 3. 로그아웃

```mermaid
flowchart TD
    PJ["관리 화면"]:::step -->|"로그아웃"| DEL[/"세션 쿠키 지움"/]:::api
    DEL --> L(["S-01 로그인"]):::done
```

- 로그아웃 버튼은 각 관리 화면의 헤더에 있다.([대시보드 와이어프레임](../dashboard/wireframe.html#s01))
- 확인 창을 거치지 않는다.

## 4. 세션 만료

```mermaid
flowchart TD
    USE["관리 화면을 쓰는 중"]:::step --> T{"로그인한 지 2시간이 지났는가"}:::decision
    T -->|"아니요"| KEEP(["그대로 쓴다"]):::done
    T -->|"예"| ACT["다른 화면으로 이동하거나 저장을 누름"]:::step
    ACT --> L(["S-01 로그인"]):::done
```

- 세션은 쓰는 동안에도 늘어나지 않는다.
- 저장 버튼을 누른 경우에는 입력한 내용을 저장하지 않고 로그인 화면으로 이동한다.
- 시간이 다 됐다고 미리 알리지 않는다.
