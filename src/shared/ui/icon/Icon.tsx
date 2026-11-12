import type { ReactNode } from 'react';

import { cn } from '@/shared/util/cn';

/** 선으로 그린 24px 아이콘. 모양은 원본 디자인(sample/)의 SVG 그대로다 */
const ICONS = {
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  send: (
    <>
      <path d="M21 3L10 14" />
      <path d="M21 3l-7 18-4-7-7-4z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  github: (
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
      <path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-2 1.2-3 2.7-3s2.3 1 2.3 3V17" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-9-9.2C1.9 7.2 4.4 4 7.6 4c2 0 3.4 1.1 4.4 2.6C13 5.1 14.4 4 16.4 4c3.2 0 5.7 3.2 4.6 6.8-1.5 4.6-9 9.2-9 9.2z" />
  ),
  star: <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />,
  cake: (
    <>
      <path d="M4 21h16" />
      <path d="M5 21v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8" />
      <path d="M5 15c2 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3 1.5 4 0" />
      <path d="M8 11V8M12 11V8M16 11V8" />
      <path d="M8 5v.5M12 4v.5M16 5v.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="16.5" cy="7" r="2.8" />
      <path d="M17 12.5c2.8.3 4.5 2.4 4.5 5.5" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

interface OwnProps {
  name: IconName;
  /** 한 변의 길이(px) */
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** 장식용 아이콘. 뜻을 전해야 하면 감싸는 요소에 aria-label 을 단다 */
export default function Icon({ name, size = 24, strokeWidth = 1.8, className }: OwnProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {ICONS[name]}
    </svg>
  );
}
