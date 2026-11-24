/** 페이지를 옮기기 시작할 때 window 에 내는 이벤트의 이름 */
const ROUTE_START_EVENT = 'app:route-start';

/** 옮기는 방식. traverse 는 브라우저의 뒤로 · 앞으로 가기다 */
export type RouteStartType = 'push' | 'replace' | 'traverse';

export interface RouteStartData {
    /** 옮겨 갈 주소. 경로와 ? 뒤만 담는다 */
    pathname: string;
    search: string;
    type: RouteStartType;
}

/**
 * 페이지를 옮기기 시작했음을 알린다. 링크를 누른 직후이고, 새 페이지는 아직 오지 않았다.
 * Next 가 부르는 src/instrumentation-client.ts 만 쓴다
 */
export function emitRouteStart(url: string, type: RouteStartType) {
    const { pathname, search } = new URL(url, window.location.href);
    window.dispatchEvent(
        new CustomEvent<RouteStartData>(ROUTE_START_EVENT, { detail: { pathname, search, type } }),
    );
}

/**
 * 페이지를 옮기기 시작하는 순간을 듣는다. 새 페이지가 올 때까지 화면에 진행 중임을 나타낼 때 쓴다.
 * @returns 듣기를 그만두는 함수
 */
export function subscribeRouteStart(listener: (data: RouteStartData) => void): () => void {
    function hndlRouteStart(event: Event) {
        if (event instanceof CustomEvent) listener(event.detail as RouteStartData);
    }
    window.addEventListener(ROUTE_START_EVENT, hndlRouteStart);
    return () => {
        window.removeEventListener(ROUTE_START_EVENT, hndlRouteStart);
    };
}
