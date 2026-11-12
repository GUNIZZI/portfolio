# Portfolio

인터랙션과 모션을 강조한 웹 프론트엔드 개발자 포트폴리오다.

- Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
- 모션: framer-motion · GSAP
- 구조: CleanFSD (Kozipsa 의 아키텍처와 코드 규약을 따른다)

## 시작

```bash
pnpm install
git config commit.template .gitmessage
pnpm dev
```

## 명령

| 명령            | 내용                                     |
| --------------- | ---------------------------------------- |
| `pnpm dev`      | 개발 서버                                |
| `pnpm check`    | tc · lint · format · 단위 테스트         |
| `pnpm test:e2e` | Playwright (기본 · 동작 줄이기 · 모바일) |
| `pnpm build`    | 프로덕션 빌드                            |

## 문서

규칙은 [docs/index.md](./docs/index.md) 에서 시작한다. AI 에이전트 지침은 [CLAUDE.md](./CLAUDE.md) 다.

## AX 환경

| 구성                                    | 역할                                                             |
| --------------------------------------- | ---------------------------------------------------------------- |
| `CLAUDE.md` · `docs/`                   | 규칙 문서. 사람과 AI 가 같은 문서를 읽는다                       |
| `.claude/hooks/format.py`               | 파일을 쓰자마자 Prettier                                         |
| `.claude/hooks/guard_tokens.py`         | 토큰에 없는 색·층·모션 값을 쓰면 바로 알림                       |
| `.claude/hooks/guard-commit.py`         | 커밋 스킬 밖의 `git commit` 차단, 디자인 시스템 변경엔 문서 요구 |
| `/commit` · `/commit-quick`             | 관심사 분할 · 문서 점검 · 메시지 규칙                            |
| `/section-write` · `/project-add`       | 섹션 · 케이스 스터디 생성 절차                                   |
| `/doc-write` · `/comment-write`         | 문장 규칙 교정                                                   |
| `structure-check` · `motion-a11y-check` | 읽기 전용 점검 에이전트                                          |
| ESLint `boundaries`                     | 계층 의존 방향을 lint 오류로                                     |
| Playwright MCP (`.mcp.json`, 로컬)      | AI 가 화면을 직접 띄워 확인                                      |
