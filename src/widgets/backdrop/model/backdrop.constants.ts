/**
 * 가장자리 붓 자국. 모든 페이지의 배경에 깔린다. 위치와 모양은 원본 디자인(sample/)의 값 그대로다.
 * lag 는 본문보다 뒤처지는 비율이다. 0.5 면 본문의 절반 속도로 움직인다.
 */
export const BRUSHES = [
    {
        position: 'top-10 left-0 h-130 w-[clamp(24px,4vw,56px)]',
        viewBox: '0 0 60 400',
        d: 'M0 0 C 30 40, 50 90, 26 150 C 10 190, 40 240, 30 300 C 24 340, 12 370, 0 400 Z',
        fill: 'fill-brush-sky',
        lag: 0.75,
    },
    {
        position: 'top-0 right-0 h-90 w-[clamp(24px,4vw,56px)]',
        viewBox: '0 0 60 400',
        d: 'M60 0 C 30 30, 20 80, 40 130 C 54 170, 22 220, 34 280 C 40 320, 50 360, 60 400 Z',
        fill: 'fill-brush-violet',
        lag: 0.8,
    },
    {
        position: 'top-452.5 left-0 h-75 w-[clamp(20px,3vw,44px)]',
        viewBox: '0 0 60 300',
        d: 'M0 0 C 28 50, 36 120, 18 180 C 8 220, 20 260, 0 300 Z',
        fill: 'fill-brush-sky',
        lag: 0.85,
    },
    {
        position: 'right-0 bottom-50 h-65 w-[clamp(20px,3vw,44px)]',
        viewBox: '0 0 60 300',
        d: 'M60 0 C 34 60, 28 120, 44 180 C 52 220, 40 260, 60 300 Z',
        fill: 'fill-brush-violet',
        lag: 0.7,
    },
] as const;
