#!/usr/bin/env python3
"""PreToolUse(Bash) 가드 — `git commit`을 두 가지 기준으로 검사한다.

동작
  1. Bash 명령을 파싱해 git 하위명령이 `commit`인지 판정한다 (`git log --grep=commit` 같은 오탐 제외).
  2. **문서 가드**: 디자인 시스템 파일만 스테이징한 커밋이면 차단한다.
     `.git/.commit-docs-ok`(1회용)가 있으면 통과시킨다.
  2-1. **토큰 가드**: 스테이징된 diff 에 토큰에 없는 표기가 새로 들어왔으면 경고한다.
     guard-tokens.py 를 빠져나온 것을 잡는 마지막 그물이라 **차단하지 않고 알리기만** 한다.
  3. **스킬 가드**: `.commit-skill-token`이 존재하고 TTL 이내면 통과시키고 즉시 삭제한다 (1회용).
  4. 어느 쪽이든 걸리면 exit 2로 차단하고 사유를 stderr로 Claude에게 돌려준다.

검사 순서가 문서 → 스킬인 이유: 문서 가드에서 막힐 때 스킬 토큰을 소모하지 않아야
문서를 보완한 뒤 재시도할 수 있다.

두 토큰 모두 `.claude/skills/commit/SKILL.md`의 절차를 따를 때만 발급된다.
"""

import json
import os
import shlex
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from guard_tokens import CHECKS, is_target  # noqa: E402  검사 패턴은 그쪽에만 정의한다

TOKEN_NAME = ".commit-skill-token"
DOCS_TOKEN_NAME = ".commit-docs-ok"
TOKEN_TTL_SEC = 300

# 디자인 시스템 범위. 이 아래가 바뀌면 문서도 함께 봐야 한다.
# status.sh 의 범위 판정이 같은 값을 쓴다. 한쪽을 바꾸면 다른 쪽도 맞춘다.
DS_PREFIXES = ("src/style/tokens/", "src/shared/ui/")

DOC_SUFFIXES = (".md", ".mdx")

# 명령 체이닝/파이프 구분자. 이 토큰을 만나면 새 명령이 시작된 것으로 본다.
SEPARATORS = {"&&", "||", ";", "|", "(", ")", "{", "}", "\n"}

# `git` 뒤에 하위명령보다 먼저 올 수 있는 전역 옵션 중 인자를 하나 더 먹는 것들.
GIT_OPTS_WITH_ARG = {"-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path"}


def fail_open(message):
    """가드 자체가 실패했을 때 커밋을 막지 않는다 (오탐으로 작업을 세우지 않기 위함)."""
    print(f"guard-commit: {message}", file=sys.stderr)
    sys.exit(0)


def is_git_commit(command):
    try:
        tokens = shlex.split(command, comments=True)
    except ValueError:
        # 따옴표가 안 닫힌 경우 등 — 파싱 불가하면 문자열 매칭으로 보수적으로 판정
        return "git commit" in command

    i = 0
    while i < len(tokens):
        token = tokens[i]
        if token in SEPARATORS or os.path.basename(token) != "git":
            i += 1
            continue

        # git 하위명령 찾기: 전역 옵션을 건너뛴다
        j = i + 1
        while j < len(tokens):
            opt = tokens[j]
            if opt in GIT_OPTS_WITH_ARG:
                j += 2
            elif opt.startswith("-"):
                j += 1
            else:
                break
        if j < len(tokens) and tokens[j] == "commit":
            return True
        i = j + 1 if j > i else i + 1

    return False


def consume_token(project_dir, name=TOKEN_NAME):
    token_path = os.path.join(project_dir, ".git", name)
    if not os.path.exists(token_path):
        return False
    try:
        fresh = (time.time() - os.path.getmtime(token_path)) <= TOKEN_TTL_SEC
    finally:
        try:
            os.remove(token_path)
        except OSError:
            pass
    return fresh


def commit_paths(project_dir, command):
    """이 커밋에 들어갈 파일 목록. -a/--all 이면 추적 중인 수정까지 함께 본다."""
    staged_only = ["diff", "--cached", "--name-only"]
    with_unstaged = ["diff", "--name-only", "HEAD"]
    args = with_unstaged if (" -a" in f" {command}" or "--all" in command) else staged_only

    result = subprocess.run(
        ["git", *args],
        cwd=project_dir,
        capture_output=True,
        text=True,
        timeout=10,
    )
    if result.returncode != 0:
        # 최초 커밋 등 HEAD 가 없는 경우를 포함한다. 판정 불가하면 통과시킨다.
        return None
    return [line for line in result.stdout.splitlines() if line]


def staged_token_findings(project_dir, command):
    """스테이징된 diff 에서 **새로 추가된 줄**만 보고 토큰에 없는 표기를 찾는다.

    이미 저장소에 있던 위반은 잡지 않는다. 이번 커밋이 늘린 것만 본다.
    """
    args = ["diff", "--cached", "-U0"]
    if " -a" in f" {command}" or "--all" in command:
        args = ["diff", "-U0", "HEAD"]
    try:
        result = subprocess.run(
            ["git", *args], cwd=project_dir, capture_output=True, text=True, timeout=10
        )
    except (OSError, subprocess.SubprocessError):
        return []
    if result.returncode != 0:
        return []

    current = None
    added = {}
    for line in result.stdout.splitlines():
        if line.startswith("+++ b/"):
            current = line[6:]
        elif line.startswith("+") and not line.startswith("+++") and current:
            if is_target(current):
                added.setdefault(current, []).append(line[1:])

    findings = []
    for path, lines in added.items():
        text = "\n".join(lines)
        labels = [label for pattern, label, _ in CHECKS if pattern.search(text)]
        if labels:
            findings.append((path, labels))
    return findings


def needs_doc_review(paths):
    """DS 파일이 들어 있는데 문서 파일이 하나도 없으면 True."""
    if not any(path.startswith(DS_PREFIXES) for path in paths):
        return False
    return not any(path.endswith(DOC_SUFFIXES) for path in paths)


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError) as exc:
        fail_open(f"입력 파싱 실패 ({exc}) — 통과시킴")

    command = (payload.get("tool_input") or {}).get("command", "")
    if not command or not is_git_commit(command):
        sys.exit(0)

    project_dir = os.environ.get("CLAUDE_PROJECT_DIR") or payload.get("cwd") or os.getcwd()

    try:
        paths = commit_paths(project_dir, command)
    except (OSError, subprocess.SubprocessError) as exc:
        fail_open(f"스테이징 목록 조회 실패 ({exc}) — 통과시킴")

    # 문서 가드를 스킬 가드보다 먼저 본다 (여기서 막힐 때 스킬 토큰을 소모하지 않도록)
    if paths is not None and needs_doc_review(paths) and not consume_token(project_dir, DOCS_TOKEN_NAME):
        print(
            "디자인 시스템 변경인데 문서(.md/.mdx)가 함께 스테이징되지 않았다.\n"
            "커밋하지 말고 /commit 스킬 3.5 단계를 먼저 처리할 것 — "
            "관련 문서 수정안을 사용자에게 제시하고 컨펌을 받는다.\n"
            "문서를 고칠 필요가 없다고 판단했다면 그 근거를 제시하고 컨펌을 받은 뒤, "
            "`.git/.commit-docs-ok` 를 발급해 재시도한다. 컨펌 없이 발급하지 않는다.\n"
            "대조할 문서: src/shared/ui/<Name>/ → <Name>.md, "
            "src/style/tokens/color.css · layer.css → docs/theme.md, "
            "src/style/tokens/motion.* → docs/motion.md",
            file=sys.stderr,
        )
        sys.exit(2)

    # 토큰 가드는 알리기만 한다. 토큰에 없는 표기에 근거가 있는 경우가 실제로 있어(딤, 이미지 위 컨트롤)
    # 차단하면 정당한 커밋까지 막힌다. 판단은 사람과 Claude 가 한다.
    for path, labels in staged_token_findings(project_dir, command):
        print(f"guard-tokens: {path} 에 토큰에 없는 표기가 추가됨 — {' · '.join(labels)}", file=sys.stderr)

    if consume_token(project_dir):
        sys.exit(0)

    print(
        "이 저장소에서 git commit은 /commit 스킬로만 실행한다.\n"
        "사용자가 '커밋해줘'라고 말했더라도 직접 커밋하지 말고, "
        "Skill 도구로 commit 스킬을 호출해 그 절차를 따를 것.\n"
        "(스킬 절차 중 발급되는 1회용 토큰이 없어 차단됨)",
        file=sys.stderr,
    )
    sys.exit(2)


if __name__ == "__main__":
    main()
