@AGENTS.md

# 규칙

- 항상 한국어로 답변한다. 코드와 식별자, 라이브러리 이름은 영어 그대로 둔다.
- **Plan 을 승인받은 뒤에는 그 범위 안에서 묻지 않고 진행한다.** 범위를 벗어나는 수정은 방향을 먼저 설명하고 허락을 받는다.(2026-11-11 사용자 결정. Kozipsa 의 "수정 전 허락" 을 바이브 코딩에 맞게 완화)
- **없는 정책을 스스로 만들어 추가하지 않는다.** 문서는 실제 코드와 이미 합의된 규칙만 서술한다.
- **정책을 추가해야 하면 컨펌 후 진행한다.** 무엇을 왜 정해야 하는지 먼저 말한다.
- **규칙 문장에는 근거를 함께 적는다.** 형식은 `docs/index.md` 의 "근거 표기" 에 있다.
- **규칙이 될 만한 것을 메모리에 넣지 않는다.** 발견하면 바로 문서 수정을 제안한다.
  메모리는 나만 읽지만 문서는 사람도 읽는다.
- **같은 실수를 두 번 하면 규칙 후보다.** 해당 주제 문서에 넣자고 제안한다.

## 문서

**문서는 하나만 둔다.** AI 전용 요약본을 따로 만들지 않는다.
코드를 건드리기 전에 `docs/index.md` 로 읽을 문서를 고른다.

- 구조와 의존 방향 → `docs/architecture.md`
- 이름 짓기와 화면 코드 → `docs/conventions.md`
- 디자인 방향 → `docs/design.md`, 색·층 → `docs/theme.md`, 모션 → `docs/motion.md`
- 화면 기획 → `docs/plan/README.md` (`/plan-write` 가 쓴다. 뷰어는 `pnpm plan-index`)
- 문장 → `docs/writing.md` (`/doc-write`, `/comment-write` 가 대조한다)

## 디자인 시스템

아래 5개는 **어디서 무엇을 하든** 지킨다.

- **색은 semantic 유틸리티로만 쓴다.** hex 와 `bg-white` · `text-gray-*` 를 쓰지 않는다.
- **글자색은 `strong` › `foreground` › `muted` › `decorative` 4계층 안에서 고른다.**
- **토큰에 없는 값을 적지 않는다.** `z-50` `duration-300` `opacity-50` `rounded-[4px]` 대신 이름 있는 토큰.
- **`dark:` 로 색을 나누지 않는다.** 색 값은 토큰에서만 정한다.
- **토큰은 `src/style/tokens/` 에만 정의한다.**

모션은 하나 더 있다.

- **framer-motion 과 GSAP 만 쓴다.** 지속시간·가속도는 `src/style/tokens/motion.ts` 의 토큰으로만 적고,
  GSAP 은 `@/shared/util/gsap` 에서 가져와 `gsap.matchMedia()` 로 동작 줄이기를 분기한다.

**코드를 쓰면 PostToolUse 훅(`.claude/hooks/guard_tokens.py`)이 방금 넣은 부분만 검사한다.**
걸렸다면 먼저 고칠 것이 맞는지 판단한다. 근거가 있어 그대로 둔다면 이유를 코드 주석에 남긴다.

## 검증

작업을 끝냈다고 말하기 전에 `pnpm check` (tc · lint · format · test)를 통과시킨다.
화면을 고쳤다면 Playwright MCP 로 띄워 보고, 모션은 동작 줄이기 설정으로도 확인한다.

## 커밋

**커밋은 커밋 스킬로만 한다.** 평문 "커밋해줘" 에는 스킬을 호출하라고 한 줄로 안내만 하고 끝낸다.

| 스킬            | 상황                                                     |
| --------------- | -------------------------------------------------------- |
| `/commit`       | 디자인 시스템을 건드렸거나, 규칙·상수·경로가 바뀌었을 때 |
| `/commit-quick` | 그 밖. 문서 점검을 생략한다                              |

`git commit` 은 PreToolUse 훅(`.claude/hooks/guard-commit.py`)이 차단하며,
스킬 절차에서 발급하는 1회용 토큰이 있을 때만 통과한다.
디자인 시스템(`src/style/tokens/`, `src/shared/ui/`) 변경에 문서가 함께 있지 않아도 차단한다.
메시지 규칙 전문은 `docs/commit.md` 다.
