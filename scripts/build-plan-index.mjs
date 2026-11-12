/**
 * 기획 문서의 와이어프레임을 한 페이지에서 오가며 보는 뷰어(docs/plan/index.html)를 만든다.
 *
 * 기준은 docs/plan/README.md 의 「구조」 표다. 기획 문서의 위치가 그 표에만 적혀 있어,
 * 뷰어도 목록을 따로 들지 않고 그 표에서 만든다. index.html 은 결과물이므로 손으로 고치지 않는다.
 *
 * 읽는 곳은 두 군데다.
 *  - plan/README.md 「구조」 표     : 기획 폴더 목록과 순서
 *  - <폴더>/README.md 「페이지 위치」 : 구역 · 페이지명 · 라우트 → 스코프 표기
 *
 * Kozipsa(admin-next/apps/kozipsa/scripts/build-plan-index.js)에서 옮겨 왔다.
 * 관리자 메뉴(GNB · 상위 메뉴 · 권한)가 없어 「메뉴 위치」 대신 「페이지 위치」 를 읽는다.
 *
 * 메뉴는 기획 문서 단위까지만 둔다. 화면 단위 이동은 각 wireframe.html 머리의 바로가기로 한다.
 *
 * 링크의 target 을 <iframe> 이름으로 걸어 오른쪽에 연다. 와이어프레임처럼 파일을 더블클릭해 열어도 되게 하기 위해서다.
 * 주소 해시로 보던 화면을 공유하는 일은 인라인 <script> 가 한다. 스크립트가 없어도 링크는 그대로 연다.
 *
 * 같은 실행에서 각 wireframe.html 의 「유저 플로우」 구간도 채운다.
 * <!-- userflow:start --> 와 <!-- userflow:end --> 사이를 userflow.md 본문으로 바꾼다.
 * .md 는 배포하지 않으므로 와이어프레임에 담아 보낸다. 그리는 일은 plan/userflow.js 가 한다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const planDir = path.join(__dirname, '../docs/plan');

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Markdown 표의 행을 셀 배열로 바꾼다. 구분선(| --- |)은 버린다.
const parseTableRows = (lines) =>
  lines
    .filter((line) => line.trim().startsWith('|') && !/^\|[\s|:-]+\|$/.test(line.trim()))
    .map((line) =>
      line
        .trim()
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim()),
    );

// 제목 줄 다음부터 다음 제목 전까지를 돌려준다
const sectionLines = (markdown, heading) => {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => line.replace(/^#+\s*(\d+\.\s*)?/, '') === heading);
  if (start < 0) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^#{1,3}\s/.test(line));
  return end < 0 ? rest : rest.slice(0, end);
};

// 「구조」 표에서 기획 폴더 목록을 읽는다
const readPlanFolders = () => {
  const readme = fs.readFileSync(path.join(planDir, 'README.md'), 'utf-8');
  const rows = parseTableRows(sectionLines(readme, '구조')).slice(1);
  return rows.map(([, doc]) => doc?.match(/\]\(\.\/(.+)\/README\.md\)/)?.[1]).filter(Boolean);
};

// 「페이지 위치」 표에서 스코프와 라우트를 읽는다
const readPageScope = (folder) => {
  const readme = fs.readFileSync(path.join(planDir, folder, 'README.md'), 'utf-8');
  const table = Object.fromEntries(
    parseTableRows(sectionLines(readme, '페이지 위치')).map(([k, v]) => [k, v]),
  );
  // 구역은 docs/commit.md 「영역」 의 이름과 같다 — 메인 · 작업 · 소개 · 공통 · 관리
  const parts = [table['구역'], table['페이지명']].map((value) => (value ?? '').trim());
  return {
    scope: parts.filter(Boolean),
    route: (table['라우트'] ?? '').replace(/`/g, ''),
  };
};

const renderNav = (plans) =>
  plans
    .map(({ folder, scope, route }) => {
      const scopeHtml = scope.map(escapeHtml).join(' <span class="sep">&gt;</span> ');
      return `    <a class="plan" href="./${folder}/wireframe.html" target="view" data-key="${escapeHtml(folder)}"><span class="scope">${scopeHtml}</span><span class="route">${escapeHtml(route)}</span></a>`;
    })
    .join('\n');

const renderPage = (plans) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>화면 설계 모음</title>
<!-- scripts/build-plan-index.js 가 만든 파일이다. 손으로 고치지 않는다 -->
<style>
/* 이름과 값은 wireframe.css 와 같다 */
:root{
  --bg:#f4f4f5;      /* 페이지와 iframe 바탕 */
  --surface:#fff;    /* 왼쪽 메뉴 바탕 */
  --line:#d4d4d8;    /* 왼쪽 메뉴 오른쪽 경계선 */
  --text:#18181b;    /* 본문 글자 */
  --sub:#71717a;     /* 보조 글자: 메뉴 설명 · 라우트 · 부품 견본 */
  --mute:#a1a1aa;    /* 스코프 사이 구분자(>) */
  --fill:#f4f4f5;    /* 메뉴 항목 hover 바탕 */
  --fill2:#e4e4e7;   /* 부품 견본 위 경계선 */
  --lnbActive:#18181b; /* LNB 활성 항목 바탕 */
  --lnbActiveText:#fff; /* LNB 활성 항목 글자 */
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--bg);color:var(--text);font:13px/1.5 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard","Noto Sans KR",sans-serif;display:grid;grid-template-columns:280px minmax(0,1fr)}
nav{background:var(--surface);border-right:1px solid var(--line);overflow:auto;padding:16px 12px}
nav h1{font-size:14px;margin:0 4px 4px}
nav p{margin:0 4px 16px;color:var(--sub);font-size:11px}
nav a{color:inherit;text-decoration:none;display:block;border-radius:6px}
nav a:hover{background:var(--fill)}
nav a[aria-current="page"]{background:var(--lnbActive);color:var(--lnbActiveText)}
nav a[aria-current="page"] :is(.route,.sep){color:var(--mute)}
.plan{padding:6px 8px;margin-bottom:4px}
.parts{margin-top:16px;padding:6px 8px;border-top:1px solid var(--fill2);color:var(--sub);font-size:12px}
.scope{display:block;font-weight:700;font-size:13px}
.scope .sep{color:var(--mute);font-weight:400}
.route{display:block;color:var(--sub);font-family:ui-monospace,Menlo,monospace;font-size:11px}
iframe{border:0;width:100%;height:100%;background:var(--bg)}
@media (max-width:760px){body{grid-template-columns:1fr;grid-template-rows:auto 1fr}nav{max-height:40vh;border-right:0;border-bottom:1px solid var(--line)}}
</style>
</head>
<body>
  <nav aria-label="화면 설계 목록">
    <h1>화면 설계 모음</h1>
    <p>기획 문서 ${plans.length}건 · 목록은 README.md 「구조」 표에서 만든다</p>
${renderNav(plans)}
    <a class="parts" href="./parts.html" target="view" data-key="parts">부품 견본</a>
  </nav>
  <iframe name="view" title="와이어프레임" src="./${plans[0]?.folder ?? ''}/wireframe.html"></iframe>
  <script>
  // 주소 해시(#<기획 폴더>[/<화면 ID>])로 보던 화면을 공유한다. 스크립트가 없어도 링크는 그대로 연다
  (() => {
    const view = document.querySelector('iframe[name="view"]');
    const links = [...document.querySelectorAll('nav a[data-key]')];
    const byKey = new Map(links.map(a => [a.dataset.key, a]));

    const mark = key => {
      for (const a of links) a.removeAttribute('aria-current');
      byKey.get(key)?.setAttribute('aria-current', 'page');
      byKey.get(key)?.scrollIntoView({ block: 'nearest' });
    };

    // 마지막 마디가 기획 폴더가 아니면 화면 ID 로 본다
    const parse = () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      if (byKey.has(hash)) return { key: hash, anchor: '' };
      const cut = hash.lastIndexOf('/');
      const key = hash.slice(0, cut);
      return byKey.has(key) ? { key, anchor: hash.slice(cut + 1) } : null;
    };

    const write = (key, anchor) => {
      history.replaceState(null, '', '#' + key + (anchor ? '/' + anchor : ''));
      mark(key);
    };

    const open = () => {
      const target = parse() ?? { key: links[0].dataset.key, anchor: '' };
      view.src = byKey.get(target.key).getAttribute('href') + (target.anchor ? '#' + target.anchor : '');
      mark(target.key);
    };

    for (const a of links) a.addEventListener('click', () => write(a.dataset.key, ''));

    // 와이어프레임 안에서 옮긴 위치도 주소에 남긴다. file:// 은 iframe 안을 읽지 못해 문서 단위까지만 남는다
    view.addEventListener('load', () => {
      try {
        const win = view.contentWindow;
        const sync = () => {
          const a = links.find(link => new URL(link.href).pathname === win.location.pathname);
          if (a) write(a.dataset.key, win.location.hash.slice(1));
        };
        sync();
        win.addEventListener('hashchange', sync);
      } catch {}
    });

    window.addEventListener('hashchange', open);
    open();
  })();
  </script>
</body>
</html>
`;

const plans = readPlanFolders().map((folder) => ({
  folder,
  ...readPageScope(folder),
}));

for (const { folder, scope } of plans) {
  if (scope.length < 2)
    console.warn(`[plan-index] ${folder}: 「페이지 위치」 표에서 스코프를 다 읽지 못했다`);
}

fs.writeFileSync(path.join(planDir, 'index.html'), renderPage(plans));
console.warn(`[plan-index] docs/plan/index.html — 기획 문서 ${plans.length}건`);

const FLOW_START = '<!-- userflow:start -->';
const FLOW_END = '<!-- userflow:end -->';

const renderFlowBlock = (markdown, scriptPath) => {
  if (markdown.includes('</script'))
    throw new Error('userflow.md 에 </script 가 있어 HTML 에 담을 수 없다');
  return `${FLOW_START}
<!-- scripts/build-plan-index.js 가 userflow.md 에서 넣은 구간이다. 손으로 고치지 않는다 -->
<section class="flow" id="flow">
  <div class="screen-h"><h2>유저 플로우</h2><span class="route">userflow.md</span></div>
  <div class="flow-body">유저 플로우를 불러오는 중이다.</div>
</section>
<script type="text/markdown" id="userflow-src">
${markdown.trimEnd()}
</script>
<script src="${scriptPath}"></script>
${FLOW_END}`;
};

for (const { folder } of plans) {
  const wireframePath = path.join(planDir, folder, 'wireframe.html');
  const html = fs.readFileSync(wireframePath, 'utf-8');
  const start = html.indexOf(FLOW_START);
  const end = html.indexOf(FLOW_END);
  if (start < 0 || end < start) {
    console.warn(
      `[plan-index] ${folder}/wireframe.html: ${FLOW_START} 표시가 없어 유저 플로우를 넣지 않았다`,
    );
    continue;
  }
  const markdown = fs.readFileSync(path.join(planDir, folder, 'userflow.md'), 'utf-8');
  const scriptPath = path
    .relative(path.join(planDir, folder), path.join(planDir, 'userflow.js'))
    .split(path.sep)
    .join('/');
  const block = renderFlowBlock(markdown, scriptPath);
  fs.writeFileSync(wireframePath, html.slice(0, start) + block + html.slice(end + FLOW_END.length));
  console.warn(`[plan-index] docs/plan/${folder}/wireframe.html — 유저 플로우`);
}
