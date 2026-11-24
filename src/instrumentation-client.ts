import { emitRouteStart, type RouteStartType } from '@/shared/util/routeStart';

/**
 * Next 가 페이지를 옮기기 시작할 때 부른다. Link 와 router.push 를 가리지 않는다.
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md)
 * 페이지 전환의 붓질과 관리 화면의 진행 선이 이 순간부터 그리기 시작한다
 */
export function onRouterTransitionStart(url: string, navigationType: RouteStartType) {
    emitRouteStart(url, navigationType);
}
