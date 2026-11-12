# 테스트

## 원칙

1. **단위 테스트는 계산이 있는 곳에 둔다.** entity `services` 의 가공, `shared/util`, 모션 토큰 대조.
2. **화면과 모션은 e2e 로 본다.** jsdom 에는 레이아웃과 애니메이션이 없어 단위 테스트로 확인할 수 없다.
3. **같은 화면을 동작 줄이기로 한 번 더 본다.** docs/motion.md 3절.

## 1. 위치와 명령

| 종류 | 위치                                 | 명령            | 도구                    |
| ---- | ------------------------------------ | --------------- | ----------------------- |
| 단위 | 고친 파일 옆 `__test__/*.test.ts(x)` | `pnpm test`     | Vitest, Testing Library |
| e2e  | `e2e/*.spec.ts`                      | `pnpm test:e2e` | Playwright              |

`__test__/` 폴더 이름은 Kozipsa 와 같다.(Kozipsa `docs/test.md` 에서 가져옴, 2026-11-11 사용자 결정)

e2e 프로젝트는 `chromium` · `reduced-motion` · `mobile` 3개다.(`playwright.config.ts`)
테스트 이름은 한국어로 동작을 적는다.(`'홈이 열리고 본문 랜드마크가 있다'`)

## 2. 셀렉터

**역할과 이름으로 찾는다.** `getByRole('link', { name: '작업 보기' })`.
클래스나 DOM 구조로 찾으면 스타일을 고칠 때마다 테스트가 실패한다.

## 금지사항

| 금지                             | 대신                           | 근거                                    |
| -------------------------------- | ------------------------------ | --------------------------------------- |
| `page.locator('.hero > div')`    | `getByRole` · `getByText`      | 스타일을 고칠 때마다 실패한다           |
| 애니메이션 끝을 `waitForTimeout` | 최종 상태를 `expect` 로 기다림 | 실행 환경의 속도에 따라 결과가 달라진다 |

## 미정리 항목

- e2e 는 `e2e/smoke.spec.ts` 하나다.

## 확인방법

```bash
pnpm test        # 기대: 전부 통과
pnpm test:e2e    # 기대: 3개 프로젝트 모두 통과
```
