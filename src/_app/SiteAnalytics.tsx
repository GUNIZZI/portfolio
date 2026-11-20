import { GoogleAnalytics } from '@next/third-parties/google';

/**
 * 공개 화면의 방문을 Google Analytics 로 모으는 추적 코드. 공개 화면의 레이아웃과 페이지에만 둔다.
 * 관리 화면에는 두지 않는다.(docs/plan/admin/dashboard/README.md 「수집」)
 * 페이지를 새로 받지 않고 옮기는 이동은 GA 가 주소가 바뀐 것을 보고 센다.
 * 측정 id 가 없으면 아무것도 그리지 않는다. 로컬에서는 id 를 넣지 않아 모으지 않는다.
 */
export default function SiteAnalytics() {
    const measurementId = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'];
    if (!measurementId) {
        return null;
    }
    return <GoogleAnalytics gaId={measurementId} />;
}
