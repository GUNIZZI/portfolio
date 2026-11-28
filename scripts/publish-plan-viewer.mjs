/**
 * 기획 뷰어를 사이트와 함께 내보낸다. docs/plan 의 뷰어 파일을 public/plan 으로 복사한다.
 *
 * Next 는 public 아래만 주소로 내보낸다. 원본을 docs/plan 한 곳에 두려고 실행할 때마다 복사한다.
 * public/plan 은 결과물이라 저장소에 올리지 않는다.(.gitignore)
 *
 * 브라우저가 여는 파일(.html · .css · .js)만 옮긴다.
 * .md 는 옮기지 않는다. 유저 플로우는 plan-index 가 와이어프레임에 담아 둔다.(scripts/build-plan-index.mjs)
 *
 * 뷰어(index.html)의 복사본에만 Google Analytics 추적 코드를 넣는다. 원본에는 넣지 않는다.
 * 측정 id 는 공개 화면과 같은 NEXT_PUBLIC_GA_MEASUREMENT_ID 다. 없으면 넣지 않아 로컬에서는 모으지 않는다.
 * 뷰어는 주소 해시로 문서를 바꿔 GA 가 이동을 스스로 세지 못한다.
 * 뷰어가 내는 `plan:view` 이벤트마다 /plan/<기획 폴더> 로 조회 1건을 보낸다.(scripts/build-plan-index.mjs)
 * 이 주소의 앞부분은 src/entities/analytics/model/analytics.constants.ts 의 ANALYTICS_PLAN_PATH_PREFIX 와 같아야 한다.
 *
 * dev 와 build 앞에서 실행한다.(package.json)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, '../docs/plan');
const targetDir = path.join(__dirname, '../public/plan');

const VIEWER_EXTENSIONS = new Set(['.html', '.css', '.js']);

/** 추적 코드를 넣는 파일. 와이어프레임을 뷰어 없이 바로 연 방문은 세지 않는다 */
const VIEWER_FILE = path.join(sourceDir, 'index.html');

/** 조회를 모으는 주소의 앞부분. 뒤에 기획 폴더의 경로가 붙는다 */
const PLAN_PATH_PREFIX = '/plan/';

/** GA4 측정 id 의 모양. 이 모양이 아니면 HTML 에 넣지 않는다 */
const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

const measurementId = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] ?? '';
const isTracked = MEASUREMENT_ID_PATTERN.test(measurementId);

// 처음 조회는 스스로 보내지 않게 끈다(send_page_view). 문서마다의 주소로 직접 보낸다
const TRACKING_SNIPPET = `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', { send_page_view: false });
window.addEventListener('plan:view', event => {
  gtag('event', 'page_view', {
    page_location: location.origin + '${PLAN_PATH_PREFIX}' + event.detail.key,
    page_title: document.title + ' — ' + event.detail.key,
  });
});
</script>
`;

/** 뷰어의 <head> 끝에 추적 코드를 넣는다 */
const withTracking = (html) => {
    if (!html.includes('</head>')) {
        throw new Error('index.html 에 </head> 가 없어 추적 코드를 넣을 수 없다');
    }
    return html.replace('</head>', `${TRACKING_SNIPPET}</head>`);
};

// 원본에서 지운 파일이 남지 않게 비우고 다시 채운다
fs.rmSync(targetDir, { recursive: true, force: true });

const copyViewerFiles = (dir) => {
    let count = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const sourcePath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            count += copyViewerFiles(sourcePath);
            continue;
        }
        if (!VIEWER_EXTENSIONS.has(path.extname(entry.name))) continue;
        const targetPath = path.join(targetDir, path.relative(sourceDir, sourcePath));
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        if (isTracked && sourcePath === VIEWER_FILE) {
            fs.writeFileSync(targetPath, withTracking(fs.readFileSync(sourcePath, 'utf-8')));
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
        count += 1;
    }
    return count;
};

const count = copyViewerFiles(sourceDir);
console.warn(
    `[plan-publish] public/plan — 파일 ${count}개 · 추적 코드 ${isTracked ? '넣음' : '넣지 않음'}`,
);
