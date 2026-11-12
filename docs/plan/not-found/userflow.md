# 찾을 수 없음 — 유저 플로우

[README.md](./README.md) 의 정책을 기준으로 방문자 동작을 흐름으로 옮겼다. 초안이라 모든 흐름이 `제안` 이다.

## 1. 전체 흐름

```mermaid
flowchart TD
    BAD["잘못된 주소 · 없는 작업"]:::warn --> NF["S-01 찾을 수 없음"]:::screen
    NF -->|"홈으로"| HOME(["홈"]):::done
    NF -->|"작업 보기"| WORK{"작업 목록이 있는가"}:::decision
    WORK -->|"예"| WL(["작업 목록"]):::done
    WORK -->|"아니요"| HP(["홈의 작업 섹션"]):::done
```
