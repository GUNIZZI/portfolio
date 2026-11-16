# 소개 — 유저 플로우

[README.md](./README.md) 의 정책을 기준으로 방문자 동작을 흐름으로 옮겼다.

## 1. 전체 흐름

```mermaid
flowchart TD
    HOME["홈 · More About Me"]:::step --> A["S-01 소개"]:::screen
    NAV["헤더 · 푸터의 About"]:::step --> A
    A -->|"스크롤"| TL["경력 타임라인"]:::step
    A -->|"연락"| C(["메일 앱"]):::done
    A -->|"헤더 · 푸터 메뉴"| HS(["홈 · 작업 페이지"]):::done
    A -.->|"로고"| HOME
```

- 연락의 흐름은 홈과 같다.([home/userflow.md](../home/userflow.md) 4절)
- 헤더의 About 이 이 페이지다. 홈의 More About Me 로도 들어온다.

## 2. 경력 보기

```mermaid
flowchart TD
    A["S-01 소개"]:::screen -->|"스크롤"| TL["경력 타임라인"]:::step
    TL --> R["최근 2곳 · 프로젝트 목록이 펼쳐져 있음"]:::step
    TL --> O["이전 4곳 · 회사와 프로젝트 수만 보임"]:::step
    O -->|"회사를 누름"| OPEN["S-02 프로젝트 목록이 펼쳐짐"]:::screen
    R -.->|"회사를 누름"| O
    OPEN -.->|"다시 누름"| O
    R --> L{"작업 상세가 있는가"}:::decision
    L -->|"예"| WD(["작업 상세 /work/slug"]):::done
    L -->|"아니요"| TXT["이름만 표시"]:::step
```

- 처음부터 펼치는 기준은 시작한 해가 2014년 이후인가다. KOCOM 과 NEWEN AI 가 해당한다.
- 작업 상세가 있는지는 프로젝트마다 본다. 접힌 회사의 프로젝트도 같다.
- 정책은 [README.md](./README.md) 「경력」 에 있다.
