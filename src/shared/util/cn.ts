import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 토큰으로 더한 글자 크기와 모서리 이름. src/style/tokens/ 와 같은 목록이다.
 * 등록하지 않으면 tailwind-merge 가 text-body 를 색으로 읽어 text-strong 과 함께 쓸 때 지운다.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        '2xs',
        'caption',
        'body',
        'lead',
        'stat',
        'hand-sm',
        'hand',
        'hero',
        'hero-sub',
        'greeting',
        'role',
        'section',
        'contact',
        'bubble',
        'note',
      ],
      radius: ['card', 'blob'],
    },
  },
});

/** 조건부 클래스를 합치고 Tailwind 충돌을 정리한다. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
