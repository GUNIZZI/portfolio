/* 와이어프레임의 「유저 플로우」 구간을 그린다. 각 wireframe.html 이 상대 경로로 불러온다.
   구간 안의 #userflow-src 는 scripts/build-plan-index.js 가 userflow.md 를 그대로 넣은 것이다.
   본문은 marked, 도표는 mermaid 가 그린다.
   일반 스크립트로 두고 import() 로 불러온다. 파일을 더블클릭해 열면 브라우저가 type="module" 의 src 를 막기 때문이다. */
(async () => {
  const MARKED_URL = 'https://cdn.jsdelivr.net/npm/marked@18.0.14/lib/marked.esm.js';
  const MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.esm.min.mjs';

  // userflow.md 의 노드 class 이름과 짝을 이룬다. 이름을 바꾸면 기획 문서의 도표도 함께 고친다.
  const CLASS_DEF = [
    'classDef screen fill:#eff6ff,stroke:#3b82f6,color:#1e3a8a,font-weight:600',
    'classDef dialog fill:#f5f3ff,stroke:#8b5cf6,color:#4c1d95,font-weight:600',
    'classDef step fill:#ffffff,stroke:#a1a1aa,color:#18181b',
    'classDef decision fill:#fffbeb,stroke:#f59e0b,color:#78350f',
    'classDef api fill:#f4f4f5,stroke:#52525b,color:#27272a',
    'classDef warn fill:#fef2f2,stroke:#ef4444,color:#7f1d1d',
    'classDef done fill:#ecfdf5,stroke:#10b981,color:#064e3b,font-weight:600',
  ];
  const LEGEND = [
    ['화면 S-', 'screen'],
    ['다이얼로그 P-', 'dialog'],
    ['판정', 'decision'],
    ['API', 'api'],
    ['예외 상태', 'warn'],
    ['종료', 'done'],
    ['점선: 앞 단계로 돌아감', 'back'],
  ];

  const source = document.getElementById('userflow-src');
  const body = document.querySelector('#flow .flow-body');
  if (!source || !body) return;

  try {
    const [{ marked }, { default: mermaid }] = await Promise.all([import(MARKED_URL), import(MERMAID_URL)]);
    body.innerHTML = marked.parse(source.textContent);

    // 구간 제목이 이미 있으므로 문서 제목은 버리고, 나머지 제목은 한 단계씩 내린다
    body.querySelector('h1')?.remove();
    for (const h of body.querySelectorAll('h2, h3')) {
      const lower = document.createElement(h.tagName === 'H2' ? 'h3' : 'h4');
      lower.innerHTML = h.innerHTML;
      h.replaceWith(lower);
    }
    // .md 는 배포하지 않으므로 링크 대신 파일 이름만 보여 준다
    for (const a of body.querySelectorAll('a[href$=".md"]')) {
      const code = document.createElement('code');
      code.textContent = a.textContent;
      a.replaceWith(code);
    }
    for (const code of body.querySelectorAll('pre > code.language-mermaid')) {
      const pre = code.parentElement;
      pre.className = 'mermaid';
      pre.textContent = code.textContent.replace(/^(flowchart [A-Z]{2})\n/, (head) => head + CLASS_DEF.join('\n') + '\n');
    }

    const legend = document.createElement('div');
    legend.className = 'flow-legend';
    for (const [label, kind] of LEGEND) {
      const chip = document.createElement('span');
      chip.className = 'fk-' + kind;
      chip.textContent = label;
      legend.append(chip);
    }
    body.prepend(legend);

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontSize: '14px',
        lineColor: '#71717a',
        edgeLabelBackground: '#ffffff',
        primaryColor: '#ffffff',
        primaryBorderColor: '#a1a1aa',
        primaryTextColor: '#18181b',
        clusterBkg: '#fafafa',
        clusterBorder: '#d4d4d8',
      },
      flowchart: { padding: 12 },
    });
    await mermaid.run({ querySelector: '#flow pre.mermaid' });
  } catch (err) {
    body.textContent = '유저 플로우를 그리지 못했다. 인터넷 연결을 확인한다. (' + err.message + ')';
  }
})();
