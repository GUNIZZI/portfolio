/** 헤더 메뉴. 한 페이지 안의 섹션으로 이동한다. */
export const NAV_ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
] as const;

/** 푸터 메뉴 */
export const FOOTER_NAV_ITEMS = NAV_ITEMS.filter((item) => item.label !== 'Skills');
