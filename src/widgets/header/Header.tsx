import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';
import Logo from '@/shared/ui/logo/Logo';
import { cn } from '@/shared/util/cn';
import { NAV_ITEMS } from '@/config/nav';
import { SITE } from '@/config/site';

/** 지금 보고 있는 메뉴. 스크롤에 따라 바꾸는 것은 모션 단계에서 한다 */
const CURRENT_HREF = '#top';

export default function Header() {
  return (
    <header className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-4 px-gutter py-5">
      <Logo name={SITE.name} role={SITE.role} />
      <nav
        aria-label="주 메뉴"
        className="flex flex-wrap items-center gap-x-[clamp(12px,3vw,36px)] gap-y-1 text-sm font-medium"
      >
        {NAV_ITEMS.map((item) => {
          const isCurrent = item.href === CURRENT_HREF;
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn('py-2', isCurrent && 'border-b-2 border-accent text-accent')}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <Button href="#contact" intent="brand" size="md">
        Let&apos;s Talk
        <Icon name="arrowRight" size={16} strokeWidth={2} />
      </Button>
    </header>
  );
}
