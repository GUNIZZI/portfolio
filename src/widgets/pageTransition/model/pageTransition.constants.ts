/** 붓질을 그리는 좌표. 붓질이 놓인 면 전체를 가로 100 · 세로 100 으로 본다 */
export const PAINT_VIEW_BOX = '0 0 100 100';

/** 붓질 전체를 기울이는 각도. 획이 오른쪽 위를 향한다 */
export const PAINT_ANGLE = 30;

/** 붓질의 색. 페이지를 옮길 때마다 획마다 이 가운데 하나를 고른다 */
export const PAINT_TONES = [
    'stroke-doodle-violet',
    'stroke-doodle-sky',
    'stroke-brush-violet',
    'stroke-brush-sky',
] as const;

/** 붓이 지나가는 가로 구간. 화면 밖에서 시작해 화면 밖에서 끝나야 양쪽 끝에 칠하지 않은 자리가 남지 않는다 */
const STROKE_FROM = -14;
const STROKE_TO = 114;

/**
 * 붓질 5번. 위에서 아래로 내려오며 좌우로 번갈아 칠한다.
 * y 는 획의 가운데 높이, tilt 는 끝나는 쪽이 처지는 정도, bow 는 가운데가 휘는 정도다. 손으로 그은 것처럼 획마다 조금씩 다르다.
 * 이웃한 획은 기울기가 서로 달라 한쪽 끝에서 벌어진다. 벌어진 간격이 몸통의 굵기(BODY_WIDTH)보다 작아야 한다.
 * 크면 다 칠한 뒤에도 획 사이에 틈이 남는다. 첫 획과 마지막 획은 화면의 위아래 끝도 덮어야 한다
 */
const STROKES = [
    { y: 9, tilt: 2, bow: -2.5 },
    { y: 30, tilt: -2, bow: 2.5 },
    { y: 50, tilt: 2, bow: -2 },
    { y: 70, tilt: -2.5, bow: 2 },
    { y: 91, tilt: 2, bow: -2.5 },
] as const;

/** 몸통의 굵기. 화면을 빈틈없이 덮는 것은 몸통이고, 붓털은 획의 끝과 가장자리에 자국을 남긴다 */
const BODY_WIDTH = 26;

/** 획 하나의 붓털 개수와 붓털 사이의 간격. 붓털이 몸통보다 조금 넓게 퍼져, 획의 위아래 가장자리가 붓털 자국으로 끝난다 */
const BRISTLE_COUNT = 24;
const BRISTLE_GAP = 1.25;

/**
 * 0 이상 1 미만의 값을 차례로 돌려주는 함수를 만든다. 씨앗이 같으면 늘 같은 값이 나온다.
 * 붓털의 굵기와 길이를 고르지 않게 하되, 서버와 브라우저가 같은 모양을 그리게 하려고 Math.random 대신 쓴다
 */
function createRandom(seed: number): () => number {
    let state = seed;
    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

/** 가운데에서 offset 만큼 떨어져 지나가는 선. isBackward 면 오른쪽에서 왼쪽으로 긋는다 */
function getStrokePath(
    stroke: (typeof STROKES)[number],
    offset: number,
    isBackward: boolean,
): string {
    const fromY = stroke.y + offset;
    const toY = stroke.y + offset + stroke.tilt;
    const middleY = stroke.y + offset + stroke.bow;
    return isBackward
        ? `M${STROKE_TO} ${toY} Q50 ${middleY} ${STROKE_FROM} ${fromY}`
        : `M${STROKE_FROM} ${fromY} Q50 ${middleY} ${STROKE_TO} ${toY}`;
}

const random = createRandom(7);

export interface BristleData {
    key: string;
    d: string;
    width: number;
    /** 선을 그리고 비우는 길이들. 선 전체의 길이가 1 이다. 끝으로 갈수록 물감이 말라 끊기는 붓털이 있다 */
    dash: string;
    /** 다른 붓털보다 늦는 정도(0~1). 붓털마다 달라 획의 끝이 가지런하지 않다 */
    lag: number;
}

export interface BrushData {
    key: string;
    /** 몸통이 지나가는 선 */
    d: string;
    bodyWidth: number;
    bristles: BristleData[];
}

/**
 * 선 하나를 그리는 길이. 절반쯤의 붓털은 끝까지 이어지고, 나머지는 뒤쪽에서 한 번 끊겼다 이어진다.
 * 마지막 값 1 은 선 하나만큼의 빈 자리다. 이 자리를 밀어 넣어 선을 가리고 드러낸다
 */
function getDash(): string {
    if (random() < 0.5) return '1 1';
    const head = 0.45 + random() * 0.4;
    const skip = 0.015 + random() * 0.04;
    return `${head} ${skip} ${1 - head - skip} 1`;
}

/**
 * 붓질마다의 몸통과 붓털. 붓털은 몸통과 같은 색이라 몸통 위에서는 보이지 않고, 몸통보다 앞서 나간 끝과
 * 몸통 밖에 놓인 가장자리에서 보인다. 가장자리 3가닥은 더 가늘어, 마른 붓으로 그은 것 같은 획의 가장자리가 된다.
 * 색이 다른 획 위에 겹치면 그 자리에도 붓털 자국이 남는다
 */
export const BRUSHES: BrushData[] = STROKES.map((stroke, strokeIndex) => {
    const isBackward = strokeIndex % 2 === 1;
    const bristles = Array.from({ length: BRISTLE_COUNT }, (_, index) => {
        const offset = (index - (BRISTLE_COUNT - 1) / 2) * BRISTLE_GAP;
        const isEdge = index < 3 || index >= BRISTLE_COUNT - 3;
        return {
            key: `${strokeIndex}-${index}`,
            d: getStrokePath(stroke, offset + (random() - 0.5), isBackward),
            width: isEdge ? 0.2 + random() * 0.35 : 0.25 + random() * 0.8,
            lag: random(),
            dash: getDash(),
        };
    });
    return {
        key: `stroke-${strokeIndex}`,
        d: getStrokePath(stroke, 0, isBackward),
        bodyWidth: BODY_WIDTH,
        bristles,
    };
});

/**
 * 붓질의 박자. 모두 덮는 시간 · 지우는 시간에 대한 비율이다.
 * step 은 다음 획이 출발하는 간격, stroke 는 획 하나를 긋는 시간, bodyLag 는 몸통이 붓털보다 늦는 시간,
 * bristleSpread 는 붓털끼리 어긋나는 시간이다.
 * 마지막 획이 끝나는 시점(step × 4 + stroke × (1 + bodyLag))이 1 을 넘지 않아야 한다. 넘으면 다 덮기 전에 페이지가 바뀐다
 */
export const TEMPO = { step: 0.165, stroke: 0.3, bodyLag: 0.1, bristleSpread: 0.07 } as const;
