/** 헤더 메뉴. 한 페이지 안의 섹션으로 이동한다. 연락은 헤더의 Contact 버튼이 맡는다. */
export const NAV_ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
] as const;

/** 푸터 메뉴 */
export const FOOTER_NAV_ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
] as const;
