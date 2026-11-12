# 색과 층

화면에서 색과 z-index 를 쓰는 규칙이다.
디자인 시스템 5원칙은 Kozipsa 루트 `CLAUDE.md` 의 `디자인 시스템` 절에서 가져왔다.(2026-11-11 사용자 결정)

## 원칙

1. **색은 semantic 유틸리티로만 쓴다.** `bg-background` `text-foreground` `border-border`.
    - `bg-white` 나 `text-gray-900` 은 토큰을 고쳐도 함께 바뀌지 않는다. hex 를 직접 적지 않는다.
2. **글자색은 `strong` › `foreground` › `muted` › `decorative` 4계층 안에서 고른다.**
    - 앞의 3개만 본문 대비 기준(WCAG AA)을 넘도록 값을 정한다. `decorative` 는 읽지 못해도 되는 글자에만 쓴다.
    - 계층이 더 필요하면 색을 늘리지 않고 크기·굵기로 구분한다.
3. **토큰에 없는 값을 적지 않는다.** `z-50` `duration-300` `opacity-50` `rounded-[4px]` 는 값을 정한 근거가 남지 않는다.
4. **`dark:` 로 색을 나누지 않는다.** 색 값은 토큰에서만 정한다.
5. **토큰은 `src/style/tokens/` 에만 정의한다.** 앱 CSS 나 컴포넌트에 색 변수를 새로 정의하지 않는다.

## 1. 색 토큰

토큰 파일: `src/style/tokens/color.css`

| 유틸리티                                                                           | 용도                                  |
| ---------------------------------------------------------------------------------- | ------------------------------------- |
| `background`                                                                       | 페이지 바탕                           |
| `panel` · `card` · `chip`                                                          | 면. 뒤로 갈수록 한 단계씩 밝다        |
| `border` · `border-card`                                                           | 패널과 카드의 테두리                  |
| `line` · `divider`                                                                 | 구분선                                |
| `strong`                                                                           | 제목, 링크                            |
| `foreground`                                                                       | 본문                                  |
| `muted`                                                                            | 보조 설명                             |
| `decorative`                                                                       | 읽지 못해도 되는 글자                 |
| `accent` · `accent-foreground`                                                     | 주 강조와 그 위 글자                  |
| `brand` · `brand-soft` · `brand-foreground`                                        | 보조 강조, 연한 보조 강조, 그 위 글자 |
| `badge`                                                                            | 작업 분류 표시                        |
| `info`                                                                             | 히어로 태그의 파란 기호               |
| `doodle-sky` · `doodle-violet` · `doodle-yellow` · `doodle-blue` · `doodle-indigo` | 낙서와 로고                           |
| `brush-sky` · `brush-violet`                                                       | 가장자리 붓 자국(알파 0.85)           |
| `dot`                                                                              | 배경 점 무늬                          |
| `ring`                                                                             | 포커스 표시                           |

값과 대비 수치의 근거는 [design.md](./design.md) 1절에 있다.
이름을 늘리거나 바꿀 때는 이 표를 함께 고친다.

다크 전용이다. 디자인 원본(`sample/`)에 라이트 화면이 없다.(2026-11-12 사용자 결정)

## 2. 모서리와 배치

토큰 파일: `src/style/tokens/layout.css`

| 유틸리티       | 값                                      |
| -------------- | --------------------------------------- |
| `max-w-page`   | 1240px                                  |
| `px-gutter`    | 16–40px, 화면 폭에 따라                 |
| `rounded-card` | 14px                                    |
| `rounded-blob` | 손으로 그린 말풍선의 고르지 않은 모서리 |

토큰으로 더한 글자 크기와 모서리 이름은 `src/shared/util/cn.ts` 에도 등록한다.
등록하지 않으면 `tailwind-merge` 가 `text-body` 를 색으로 읽어 다른 글자색과 함께 쓸 때 지운다.
빠뜨리면 `src/shared/util/__test__/cn.test.ts` 가 실패한다.

## 3. 층

토큰 파일: `src/style/tokens/layer.css`. 숫자 z-index 대신 역할로 고른다.

| 유틸리티    | 용도                       |
| ----------- | -------------------------- |
| `z-base`    | 기본                       |
| `z-raised`  | 같은 섹션 안에서 위로 올림 |
| `z-float`   | 그림 위에 얹는 낙서·말풍선 |
| `z-header`  | 고정 헤더                  |
| `z-overlay` | 메뉴 오버레이              |
| `z-modal`   | 모달                       |
| `z-cursor`  | 커스텀 커서                |

## 금지사항

| 금지                         | 대신                                 | 근거                               |
| ---------------------------- | ------------------------------------ | ---------------------------------- |
| `text-gray-500` · `bg-white` | semantic 유틸리티                    | 토큰을 고쳐도 함께 바뀌지 않는다   |
| `dark:bg-…`                  | 토큰 값을 고친다                     | 색 값은 토큰에서만 정한다(Kozipsa) |
| `z-50` · `z-[999]`           | 층 토큰                              | 층의 근거가 남지 않는다(Kozipsa)   |
| 컴포넌트에 `--my-color` 정의 | `src/style/tokens/color.css` 에 추가 | 같은 내용이 2곳에 생긴다(Kozipsa)  |

## 미정리 항목

- 없다. 앞의 3계층과 `accent` 는 AA 를 넘는다(design.md 1절).

## 확인방법

`.claude/hooks/guard_tokens.py` 가 코드를 쓸 때마다 같은 패턴을 검사한다.

```bash
# 팔레트 색·고정색·dark:·숫자 z-index. 기대: 출력 없음
grep -rnE "\b(bg|text|border)-(gray|slate|zinc|neutral|white|black)\b|(^|[^-\w])dark:|\bz-[0-9]" src --include="*.tsx" --include="*.ts" | grep -v "src/style/tokens/"
```
