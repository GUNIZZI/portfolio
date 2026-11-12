# 홈 — 유저 플로우

[README.md](./README.md) 의 정책을 기준으로 방문자 동작을 흐름으로 옮겼다.
화면 ID(`S-01` 등)는 [wireframe.html](./wireframe.html) 의 ID 와 같다. `제안` 동작이 섞여 있다.

## 1. 전체 흐름

```mermaid
flowchart TD
    IN["첫 진입 · 다른 페이지의 로고"]:::step --> H["S-01 홈"]:::screen
    H -->|"헤더 · 푸터 메뉴"| SEC["같은 페이지의 섹션"]:::step
    SEC -.->|"Home · 로고"| H
    H -->|"스크롤로 히어로를 지남"| ST["S-02 헤더 고정"]:::screen
    ST -.->|"맨 위로"| H
    H -->|"View All Projects"| WL(["작업 목록 /work"]):::done
    H -->|"카드 열기 아이콘"| WD(["작업 상세 /work/id"]):::done
    H -->|"More About Me"| AB(["소개 /about"]):::done
    H -->|"Download Resume"| PDF[/"이력서 PDF 새 탭"/]:::api
    H -->|"GitHub · LinkedIn"| EXT[/"외부 프로필 새 탭"/]:::api
    H -->|"연락"| C["연락하기"]:::step
```

- 작업 목록 · 상세 · 소개는 다른 기획 문서에 있다. [work/](../work/README.md) · [about/](../about/README.md)
- 같은 페이지 안의 이동은 `scroll-behavior: smooth` 로 부드럽게 이동한다. 동작 줄이기면 바로 이동한다.(`src/style/global.css`)

## 2. 처음 들어옴

```mermaid
flowchart TD
    L["S-01 홈 그리기 시작"]:::screen --> RM{"동작 줄이기인가"}:::decision
    RM -->|"예"| FIN["S-04 최종 상태로 바로 그림"]:::screen
    RM -->|"아니요"| A1["낙서가 선으로 그려짐"]:::step
    A1 --> A2["이름이 마커로 칠해지듯 드러남"]:::step
    A2 --> A3["말풍선이 튀어나옴"]:::step
    A3 --> DONE(["등장 연출 끝"]):::done
    FIN --> DONE
    DONE --> P{"포인터가 있는가"}:::decision
    P -->|"예"| PX["낙서가 포인터를 따라 살짝 밀림"]:::step
    P -->|"아니요(터치)"| NOP["시차 없음"]:::step
```

- 등장 연출은 한 번만 실행한다. 다른 페이지에 갔다가 돌아와도 다시 실행하지 않는다(제안). 첫 방문을 위한 연출이라, 매번 나오면 방문자가 기다려야 하기 때문이다.
- 포인터 시차도 동작 줄이기에서는 하지 않는다.

## 3. 작업 보기

```mermaid
flowchart TD
    H["S-01 홈"]:::screen -->|"스크롤"| V["작업 카드가 화면에 들어옴"]:::step
    V --> RM{"동작 줄이기인가"}:::decision
    RM -->|"아니요"| UP["카드가 차례로 올라옴"]:::step
    RM -->|"예"| SHOW["카드가 바로 보임"]:::step
    UP --> PICK["카드에 hover · focus"]:::step
    SHOW --> PICK
    PICK --> HAS{"상세 주소가 있는가"}:::decision
    HAS -->|"예"| WD(["작업 상세로 이동"]):::done
    HAS -->|"아니요"| SELF["작업 섹션에 머묾"]:::warn
```

- 상세 주소가 없는 작업은 `href` 가 `#projects` 다.(`src/entities/project/services/project.services.ts`) 작업 상세가 생기면 모든 카드에 주소가 생긴다(제안).

## 4. 연락하기

```mermaid
flowchart TD
    C["S-01 연락 섹션"]:::screen --> W{"무엇을 누르는가"}:::decision
    W -->|"Get in Touch"| MAIL[/"메일 앱"/]:::api
    W -->|"메일 주소 버튼"| CP{"클립보드에 쓸 수 있는가"}:::decision
    CP -->|"예"| T("P-01 복사됨 토스트"):::dialog
    CP -->|"아니요"| MAIL
    T --> END(["주소를 가져감"]):::done
    MAIL --> END
```

- 메일 주소 버튼의 복사는 `제안` 이다. 지금은 버튼 2개 모두 `mailto:` 다.(`src/features/contact/ui/Contact.tsx`)
