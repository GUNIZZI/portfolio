#!/usr/bin/env python3
"""PostToolUse(Write|Edit) — 방금 쓴 파일 하나에 Prettier 를 돌린다.

포맷은 사람도 AI 도 고르지 않는다(docs/conventions.md 원칙). 쓰자마자 맞춰 두면
lint-staged 에서 diff 가 다시 바뀌는 일이 없다. 실패해도 작업을 세우지 않는다.
"""

import json
import os
import subprocess
import sys

SUFFIXES = (".ts", ".tsx", ".mjs", ".js", ".css", ".md", ".mdx", ".json")

try:
    payload = json.load(sys.stdin)
except (json.JSONDecodeError, ValueError):
    sys.exit(0)

path = (payload.get("tool_input") or {}).get("file_path", "")
project = os.environ.get("CLAUDE_PROJECT_DIR") or payload.get("cwd") or os.getcwd()
if not path.endswith(SUFFIXES) or "/node_modules/" in path or not path.startswith(project):
    sys.exit(0)

try:
    subprocess.run(
        ["pnpm", "exec", "prettier", "--write", "--log-level", "silent", path],
        cwd=project,
        timeout=20,
        check=False,
    )
except (OSError, subprocess.SubprocessError):
    pass
sys.exit(0)
