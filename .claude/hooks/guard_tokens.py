#!/usr/bin/env python3
"""PostToolUse(Write|Edit) 검사기 — 방금 쓴 코드에서 디자인 시스템 토큰에 없는 표기를 찾는다.

왜 사후(PostToolUse)인가
  쓰기 전에 막으면 문서를 읽을 때까지 아무것도 못 쓰게 되어 매번 왕복이 생긴다.
  쓴 직후에 알려 주면 바로 고칠 수 있어 실효는 같고 훨씬 덜 성가시다.

무엇을 잡는가
  규칙을 여기 복제하지 않는다. **정의상 토큰에 없는 표기법**만 본다.
  Tailwind 기본 팔레트 이름, 대괄호 임의값, 숫자 리터럴 유틸이 그것이다.
  이건 규칙 서술이 아니라 Tailwind 의 사실이라 같은 내용이 2곳에 생기지 않는다.
  정상적으로 짠 코드에는 하나도 걸리지 않으므로 평소 비용이 0 이다.

무엇을 안 잡는가
  "shared/ui 컴포넌트를 쓴다" 와 "cva 를 쓴다" 는 잡지 않는다.
  둘 다 정상 동작이다. 매번 뜨는 알림은 신호가 아니라 소음이고,
  위 전제("정상 코드에는 안 걸린다")를 깬다. (Kozipsa 실측: 화면 파일 530개 중 241개에서 발동)
  컴포넌트 사용 규칙은 여기 옮겨 적지 않는다. 구현 파일을 고쳤을 때
  옆에 있는 <name>.md 의 **경로만** 짚어 준다 — 문서를 안 읽고 지나가는 것만 막는다.

문서(.md/.mdx)는 축이 하나 더 있다
  규칙 문장을 새로 넣으면 근거를 대라고 되돌려 준다. 어미가 아니라 의무·금지 어휘로 잡는다.
  이 저장소 문서는 전부 반말 서술이라 어미로는 설명과 규칙이 갈리지 않기 때문이다.
  근거 표기 형식은 docs/index.md 에 있고, 여기에는 옮겨 적지 않는다.

돌려주는 것
  어긋난 표기와 **읽을 문서 경로**만 준다. 규칙 문장은 문서 한 곳에만 둔다.
  exit 2 + stderr 가 Claude 에게 피드백으로 돌아가는 규약이다(guard-commit.py 와 같다).

파일명이 언더스코어인 이유
  guard-commit.py 가 이 모듈의 CHECKS 를 import 해 커밋 시점에 같은 검사를 한다.
  하이픈은 모듈명으로 쓸 수 없다. 검사 패턴을 한 곳에만 정의하려면 이 이름이어야 한다.
"""

import json
import os
import re
import sys

# 검사 대상. 그 밖의 확장자는 보지 않는다.
TARGET_SUFFIXES = (".tsx", ".ts", ".css")

# 검사에서 빼는 경로.
#   src/style/tokens/  토큰 정의부. 원시값을 적는 것이 일이다
#   __test__, e2e/     금지 표기를 일부러 적는 자리가 있다
#   docs/plan/         기획 산출물. 토큰 규칙의 대상이 아니다 (docs/plan/README.md 3.6)
SKIP_PARTS = (
    "src/style/tokens/",
    "/__test__/",
    "/e2e/",
    "docs/plan/",
)

# Tailwind 기본 팔레트 이름. 우리 semantic 토큰에는 이 단어가 없다.
PALETTE = (
    "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|"
    "teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
)

CHECKS = [
    (
        re.compile(r"\b(?:bg|text|border|fill|stroke|ring|from|via|to|divide|outline|shadow|accent|caret|decoration|placeholder)-(?:%s)-\d{2,3}\b" % PALETTE),
        "Tailwind 기본 팔레트 색",
        "docs/theme.md 1절 — background·surface·border·strong·foreground·muted·decorative",
    ),
    (
        re.compile(r"\b(?:bg|text|border|fill|stroke|ring|divide|outline|placeholder)-(?:white|black)\b"),
        "고정색 white/black",
        "docs/theme.md 1절. 딤은 bg-dim 이다",
    ),
    (
        re.compile(r"\bz-(?:\d+|\[)"),
        "숫자 z-index",
        "docs/theme.md 2절 — z-base·raised·header·overlay·modal·cursor",
    ),
    (
        re.compile(r"\b(?:duration|ease)-(?:\d+|\[)"),
        "숫자 지속시간·가속도",
        "docs/motion.md 2절 — duration-fast·base·slow 와 ease-enter·exit·move",
    ),
    (
        re.compile(r"\bopacity-\d+\b"),
        "숫자 불투명도",
        "docs/theme.md 원칙 3 — 위계는 글자색 4계층으로 만든다",
    ),
    (
        re.compile(r"\brounded(?:-[a-z]+)?-\["),
        "임의 모서리",
        "docs/theme.md 원칙 3 — 이름 있는 rounded-* 를 쓴다",
    ),
    (
        re.compile(r"(?<![\w-])dark:"),
        "dark: 분기",
        "docs/theme.md 원칙 4 — 색 값은 토큰에서만 정한다",
    ),
    # 아래 셋은 JS 모션(framer-motion · GSAP)의 숫자 리터럴이다. Kozipsa 에 없던 검사다.
    (
        re.compile(r"\b(?:duration|stagger|staggerChildren|delayChildren):\s*\d"),
        "숫자 모션 지속시간·간격",
        "docs/motion.md 2절 — DURATION.* · STAGGER.* 토큰을 쓴다",
    ),
    (
        re.compile(r"\bease:\s*(?:\[|['\"](?!(?:enter|exit|move)['\"]))"),
        "토큰 밖 가속도",
        "docs/motion.md 2절 — EASE.* 또는 GSAP 에서는 'enter'·'exit'·'move'",
    ),
    (
        re.compile(r"from\s+['\"]gsap(?:/[^'\"]*)?['\"]"),
        "gsap 직접 import",
        "docs/motion.md 2.1 — @/shared/util/gsap 에서 가져온다",
    ),
    (
        re.compile(r"#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b"),
        "hex 리터럴",
        "src/style/tokens/color.css 에 토큰으로 추가한다",
    ),
]

# 문서에서 규범 문장을 새로 넣었는지 본다.
#   이 저장소 문서는 전부 반말 서술이라 어미(~한다)만으로는 설명과 규칙을 가를 수 없다.
#   그래서 어미가 아니라 **의무와 금지를 나타내는 어휘**만 본다.
#   설명 문장에는 이 어휘가 나오지 않으므로, 문서를 고쳐도 규칙을 안 건드리면 걸리지 않는다.
#   규칙 문장을 새로 넣는 순간에만 발동하는데, 그때가 바로 근거를 확인해야 하는 자리다.
DOC_SUFFIXES = (".md", ".mdx")

# 규칙이 사는 곳. "docs/" 는 루트와 apps/<app>/docs/ 를 함께 잡는다.
DOC_ROOTS = ("docs/", "src/shared/ui/")

NORM_PATTERN = re.compile(r"않는다|않아야|말아야|말 것|해야|하지 마|반드시|절대|금지|필수|권장")

# 컴포넌트 문서를 찾는 뿌리. 이 아래를 고칠 때만 <name>.md 를 짚는다.
#   앱 화면에서 컴포넌트를 쓰는 자리에는 걸지 않는다. 한 화면에 여럿을 쓰므로
#   매번 여러 문서를 물고 오게 되고, 대개는 읽을 필요가 없다.
#   쓰는 사람의 발견성은 Storybook 이 맡는다.
COMPONENT_ROOT = "src/shared/ui/"


def component_docs(path):
    """고치는 파일 옆의 컴포넌트 문서 경로를 찾는다.

    같은 이름의 .md 가 있으면 그것 하나, 없으면 그 폴더의 .md 전부를 준다.
    폴더에 하나도 없으면 custom/ 경계까지 올라간다 —
    부품 폴더에 자기 .md 가 없으면 상위 컴포넌트 폴더의 .md 를 받는다.
    """
    normalized = path.replace(os.sep, "/")
    if COMPONENT_ROOT not in normalized:
        return []

    prefix, _, rest = normalized.partition(COMPONENT_ROOT)
    base = prefix + COMPONENT_ROOT
    parts = rest.split("/")
    stem = parts[-1].split(".")[0]

    # 파일이 든 폴더에서 시작해 custom/ 바로 아래 폴더까지 거슬러 올라간다.
    for depth in range(len(parts) - 1, 0, -1):
        folder = base + "/".join(parts[:depth])
        try:
            names = sorted(n for n in os.listdir(folder) if n.endswith(".md"))
        except OSError:
            return []
        if not names:
            continue
        if f"{stem}.md" in names:
            names = [f"{stem}.md"]
        return [f"{folder}/{n}" for n in names]
    return []


def fail_open(message):
    """검사기 자체가 실패하면 작업을 세우지 않는다."""
    print(f"guard-tokens: {message}", file=sys.stderr)
    sys.exit(0)


def is_target(path):
    if not path.endswith(TARGET_SUFFIXES):
        return False
    normalized = path.replace(os.sep, "/")
    # gsap 을 등록하는 단 한 곳. 직접 import 하는 것이 이 파일의 일이다
    if normalized.endswith("src/shared/util/gsap.ts"):
        return False
    return not any(part in normalized for part in SKIP_PARTS)


def is_doc_target(path):
    """규칙이 사는 문서인가. is_target 은 커밋 훅이 import 하므로 건드리지 않는다."""
    if not path.endswith(DOC_SUFFIXES):
        return False
    normalized = path.replace(os.sep, "/")
    # 규칙 문서인 docs/plan/README.md 는 본다. 그 아래 기획 폴더는 정책을 제안하는 문서라 뺀다
    if normalized.endswith("docs/plan/README.md"):
        return True
    if any(part in normalized for part in SKIP_PARTS):
        return False
    return any(root in normalized for root in DOC_ROOTS)


def written_text(tool_name, tool_input):
    """이번 호출이 파일에 새로 넣은 텍스트만 모은다. 파일 전체를 훑지 않는다."""
    if tool_name == "Write":
        return tool_input.get("content", "")
    if tool_name == "Edit":
        return tool_input.get("new_string", "")
    return ""


def scan(text):
    findings = []
    for pattern, label, where in CHECKS:
        hits = pattern.findall(text)
        if hits:
            sample = ", ".join(sorted(set(hits))[:3]) if isinstance(hits[0], str) else ""
            findings.append((label, sample, where))
    return findings


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError) as exc:
        fail_open(f"입력 파싱 실패 ({exc})")

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input") or {}
    path = tool_input.get("file_path", "")

    code = is_target(path)
    doc = is_doc_target(path)
    if not code and not doc:
        sys.exit(0)

    blocks = []
    text = written_text(tool_name, tool_input)

    if doc and text:
        hits = sorted(set(NORM_PATTERN.findall(text)))
        if hits:
            blocks.append(
                f"{path} 에 규범 문장을 새로 넣었다. ({', '.join(hits[:3])})\n"
                "  · 각 문장의 근거를 댄다 — 실제 코드 경로 · 기존 문서 조항 · 사용자가 정한 것\n"
                "  · 셋 중 어디에도 못 대는 문장은 지운다. 그럴듯한 일반론이라도 마찬가지다\n"
                "표기 형식은 docs/index.md 의 \"근거 표기\" 에 있다."
            )

    findings = scan(text) if (code and text) else []
    if findings:
        lines = []
        for label, sample, where in findings:
            shown = f" ({sample})" if sample else ""
            lines.append(f"  · {label}{shown} → {where}")
        blocks.append(
            f"{path} 에 디자인 시스템 토큰에 없는 표기가 있다.\n"
            + "\n".join(lines)
            + "\n고칠 것이 맞는지 판단하고, 근거가 있어 그대로 둔다면 그 이유를 코드 주석에 남긴다."
        )

    docs = component_docs(path) if code else []
    if docs:
        blocks.append(
            "이 컴포넌트의 사용 규칙은 옆에 있다.\n"
            + "\n".join(f"  · {doc}" for doc in docs)
            + "\n아직 읽지 않았다면 고치기 전에 읽는다."
        )

    if not blocks:
        sys.exit(0)

    print("\n\n".join(blocks), file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
