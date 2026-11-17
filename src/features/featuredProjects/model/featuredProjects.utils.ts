/** 마우스가 카드에 들어오거나 나간 쪽. 변 4개와 모서리 4개다 */
export type CardEdge =
    'top' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left' | 'topLeft';

/** 오른쪽(0°)부터 시계 방향으로 45° 씩. 화면은 아래가 +y 라 45° 가 오른쪽 아래다 */
const EDGES_CLOCKWISE: readonly CardEdge[] = [
    'right',
    'bottomRight',
    'bottom',
    'bottomLeft',
    'left',
    'topLeft',
    'top',
    'topRight',
];

/**
 * 카드 안의 한 점이 가운데에서 어느 쪽에 있는지 8방향으로 가른다.
 * 가로로 긴 카드에서도 모서리가 모서리로 잡히도록, 폭과 높이로 나눈 비율(0~1)로 받는다
 * @param ratioX 왼쪽 끝 0, 오른쪽 끝 1
 * @param ratioY 위쪽 끝 0, 아래쪽 끝 1
 */
export function toCardEdge(ratioX: number, ratioY: number): CardEdge {
    const angle = Math.atan2(ratioY - 0.5, ratioX - 0.5);
    const sector = Math.round(angle / (Math.PI / 4));
    return EDGES_CLOCKWISE[(sector + 8) % 8] ?? 'topLeft';
}

interface EdgeMask {
    /** 마스크 그라데이션의 각도. 검은(보이는) 쪽이 이 변에 붙는다 */
    angle: number;
    /** 테두리가 다 가려지는 자리 */
    hidden: string;
    /** 테두리가 다 보이는 자리 */
    shown: string;
}

/**
 * 변마다의 마스크 설정. 마스크는 카드의 2배 크기이고, 자리를 hidden 에서 shown 으로 옮기면
 * 경계선이 그 변에서 시작해 맞은편으로 카드를 한 번 지나간다.
 */
export const EDGE_MASK: Record<CardEdge, EdgeMask> = {
    top: { angle: 180, hidden: '0% 100%', shown: '0% 0%' },
    topRight: { angle: 225, hidden: '0% 100%', shown: '100% 0%' },
    right: { angle: 270, hidden: '0% 0%', shown: '100% 0%' },
    bottomRight: { angle: 315, hidden: '0% 0%', shown: '100% 100%' },
    bottom: { angle: 0, hidden: '0% 0%', shown: '0% 100%' },
    bottomLeft: { angle: 45, hidden: '100% 0%', shown: '0% 100%' },
    left: { angle: 90, hidden: '100% 0%', shown: '0% 0%' },
    topLeft: { angle: 135, hidden: '100% 100%', shown: '0% 0%' },
};

/** 변에 맞는 마스크 그림 */
export function toEdgeMaskImage(edge: CardEdge): string {
    return `linear-gradient(${EDGE_MASK[edge].angle}deg, black 50%, transparent 50%)`;
}
