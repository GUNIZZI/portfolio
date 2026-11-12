#!/usr/bin/env bash
# /commit 1 단계를 한 번에 뜬다. 명령마다 나눠 부르면 Bash 호출 원가만큼 느려진다. (Kozipsa 에서 이식)
# 상태, 이력, 자격증명 차단, 범위 판정, 변경 본문을 순서대로 낸다.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}" || exit 1

# 파일 하나가 이 줄 수를 넘으면 본문 대신 경로만 낸다. 필요하면 그 파일만 따로 읽는다.
LIMIT="${COMMIT_DIFF_LIMIT:-400}"
HAS_HEAD=1
git rev-parse --verify -q HEAD >/dev/null || HAS_HEAD=0

echo "=== 변경 목록 ==="
git status --short --untracked-files=all
if [ -z "$(git status --porcelain)" ]; then
  echo "(변경 없음)"
  exit 0
fi

echo
echo "=== 규모 ==="
[ "$HAS_HEAD" = 1 ] && git diff --stat
git diff --cached --stat

echo
echo "=== 최근 제목 5개 (같은 제목 반복 확인용) ==="
if [ "$HAS_HEAD" = 1 ]; then git log --pretty=%s -5; else echo "(첫 커밋)"; fi

echo
echo "=== 자격증명·산출물 점검 ==="
risky=$(git status --short --untracked-files=all | grep -iE '\.env|\.mcp\.json|\.pem$|\.key$|credential|secret|node_modules/|\.next/|tsbuildinfo')
if [ -n "$risky" ]; then
  echo "!! 아래는 스테이징하지 않는다. 사용자에게 알리고 .gitignore 보완을 제안한다."
  echo "$risky"
else
  echo "걸리는 것 없음"
fi

echo
echo "=== 범위 판정 ==="
# guard-commit.py 의 DS_PREFIXES 와 같은 경계다. 저쪽이 바뀌면 여기도 맞춘다.
ds=$(git status --porcelain --untracked-files=all | awk '{print $NF}' | grep -E '^(src/style/tokens/|src/shared/ui/)')
if [ -n "$ds" ]; then
  echo "디자인 시스템 포함 — /commit-quick 을 쓸 수 없다. /commit 으로 간다."
  echo "$ds" | sed 's/^/  · /'
else
  echo "디자인 시스템 없음 — /commit-quick 가능"
fi

echo
echo "=== 변경 본문 ==="
git status --porcelain --untracked-files=all | while IFS= read -r line; do
  st="${line:0:2}"; path="${line:3}"
  path="${path#\"}"; path="${path%\"}"
  case "$st" in
    "??") body=$(git diff --no-index --no-color -- /dev/null "$path" 2>/dev/null | tail -n +3) ;;
    *)
      if [ "$HAS_HEAD" = 1 ]; then body=$(git diff --no-color HEAD -- "$path" 2>/dev/null)
      else body=$(git diff --cached --no-color -- "$path" 2>/dev/null); fi ;;
  esac
  n=$(printf '%s\n' "$body" | wc -l | tr -d ' ')
  echo "--- $path ($st, ${n}줄) ---"
  if [ "$n" -gt "$LIMIT" ]; then
    echo "(${LIMIT}줄 초과 — 본문 생략. 판단에 필요하면 이 파일만 따로 읽는다)"
  else
    printf '%s\n' "$body"
  fi
done
