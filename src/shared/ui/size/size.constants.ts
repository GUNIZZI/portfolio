/**
 * 입력과 버튼이 함께 쓰는 크기 눈금. 단계마다 높이와 글자 크기를 묶는다.
 * 같은 단계의 입력과 버튼은 높이가 같아, 한 줄에 놓아도 맞는다.
 * 좌우 여백은 컴포넌트마다 달라 여기 두지 않고, 컴포넌트가 단계별로 덧붙인다.
 * (Kozipsa packages/ui 의 _type/size.ts 에서 가져옴)
 */
export const CONTROL_SIZES = {
    /** 24px */
    '2xs': { height: 'min-h-6', text: 'text-2xs' },
    /** 28px */
    xs: { height: 'min-h-7', text: 'text-xs' },
    /** 36px. 관리 화면의 폼 */
    sm: { height: 'min-h-9', text: 'text-sm' },
    /** 44px */
    md: { height: 'min-h-11', text: 'text-sm' },
    /** 48px */
    lg: { height: 'min-h-12', text: 'text-body' },
    /** 56px */
    xl: { height: 'min-h-14', text: 'text-lead' },
    /** 64px */
    '2xl': { height: 'min-h-16', text: 'text-xl' },
} as const;

export type ControlSize = keyof typeof CONTROL_SIZES;
