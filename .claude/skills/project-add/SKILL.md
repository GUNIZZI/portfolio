---
name: project-add
description: 포트폴리오에 프로젝트(케이스 스터디) 하나를 추가한다. content/projects/<slug>.mdx 를 entity project 의 프론트매터 스키마에 맞춰 만들고, 사용자에게 받은 내용으로 문제·해결·성과 구조의 본문을 채운다. 사용자가 "/project-add <slug>" 를 호출했을 때 사용한다.
---

# project-add

## 0. 전제

- 스키마는 `src/entities/project/model/project.schemas.ts` 에만 정의한다. 이 파일에 필드를 옮겨 적지 않는다.
- entity `project` 가 아직 없으면 멈추고, Phase 3 에서 entity 를 먼저 만들어야 한다고 알린다.
- **없는 경력이나 수치를 지어내지 않는다.** 모르는 칸은 비워 두고 사용자에게 묻는다.

## 1. 읽는다

`project.schemas.ts` 와 기존 `content/projects/*.mdx` 하나를 읽는다. 문장은 `docs/writing.md` 를 따른다.

## 2. 묻는다

스키마의 필수 필드와 아래 본문 재료를 한 번에 묻는다.

- 어떤 문제가 있었나
- 무엇을 왜 선택했나 (기술과 대안)
- 결과 — 가능하면 숫자
- 내 역할과 기여 범위

## 3. 만든다

`content/projects/<slug>.mdx` 를 만들고, 이미지는 `public/projects/<slug>/` 에 둔다.

## 4. 확인한다

`pnpm test` 와 `pnpm build` 로 스키마 검증을 통과하는지 본다. 상세 페이지를 Playwright MCP 로 열어 본다.
커밋은 하지 않는다. `/commit-quick` 을 호출하라고 안내한다.
