#!/usr/bin/env bash
# /commit 6 단계를 한 번에 돌린다. 기대 출력은 "통과" 세 줄과 남은 변경 목록이다.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}" || exit 1
N="${1:-3}"

echo "=== type 접두 ==="
bad=$(git log --pretty=%s -"$N" | grep -vE '^\[(feat|fix|refactor|style|docs|chore|test)\] ')
[ -z "$bad" ] && echo "통과" || { echo "!! 위반"; echo "$bad"; }

echo
echo "=== 제목 72자 ==="
# macOS awk 는 바이트로 세어 한글을 오탐하므로 문자 수로 센다
long=$(git log --pretty=%s -"$N" | python3 -c "import sys;[print(l) for l in sys.stdin.read().splitlines() if len(l)>72]")
[ -z "$long" ] && echo "통과" || { echo "!! 초과"; echo "$long"; }

echo
echo "=== 이번 커밋 ==="
git log --pretty='%h %s' -"$N"

echo
echo "=== 남은 변경 ==="
git status --short || true
[ -z "$(git status --porcelain)" ] && echo "(없음)"
