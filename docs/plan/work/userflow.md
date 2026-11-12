# 작업 목록 · 상세 — 유저 플로우

[README.md](./README.md) 의 정책을 기준으로 방문자 동작을 흐름으로 옮겼다. 초안이라 모든 흐름이 `제안` 이다.
화면 ID 는 [wireframe.html](./wireframe.html) 의 ID 와 같다.

## 1. 전체 흐름

```mermaid
flowchart TD
    HOME["홈 · View All Projects"]:::step --> L["S-01 작업 목록"]:::screen
    CARD["홈 · 작업 카드"]:::step --> D["S-02 작업 상세"]:::screen
    L -->|"카드"| D
    D -->|"이전 · 다음 작업"| D
    D -.->|"목록으로"| L
    D -->|"서비스 · 저장소"| EXT[/"외부 사이트 새 탭"/]:::api
    BAD["없는 slug"]:::warn --> NF(["404"]):::done
```

- 목록으로 돌아가면 고른 필터가 남아 있다. 주소에 남겼기 때문이다.

## 2. 분류로 거르기

```mermaid
flowchart TD
    L["S-01 작업 목록"]:::screen --> F["필터 버튼"]:::step
    F --> U["주소의 category 를 바꿈"]:::step
    U --> RM{"동작 줄이기인가"}:::decision
    RM -->|"아니요"| MV["카드가 위치를 옮김"]:::step
    RM -->|"예"| SW["목록이 바로 바뀜"]:::step
    MV --> END(["걸러진 목록"]):::done
    SW --> END
    END -.->|"전체"| L
```
