import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';
import { cn } from '@/shared/util/cn';
import { SITE } from '@/config/site';

import { HERO_TAG_TONE_CLASS, HERO_TAGS } from '../model/hero.constants';
import HeroVisual from './HeroVisual';

export default function Hero() {
  return (
    <section className="mx-auto flex max-w-page flex-wrap items-end gap-6 px-gutter pt-2">
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-4.5 pb-10">
        <div className="flex flex-wrap items-end gap-4">
          <span className="inline-block -rotate-6 font-hand text-greeting font-bold">Hey,</span>
          <span className="font-marker text-hero-sub">I&apos;m</span>
          <svg width="56" height="44" viewBox="0 0 56 44" aria-hidden="true">
            <path
              d="M6 38 L4 10 L18 24 L28 4 L38 24 L52 10 L50 38 Z"
              fill="none"
              className="stroke-doodle-yellow"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-marker text-hero font-normal tracking-[-0.01em]">{SITE.name}</h1>
        <svg
          viewBox="0 0 400 20"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="-mt-2.5 h-4.5 w-[min(100%,380px)]"
        >
          <path
            d="M4 14 C 120 4, 260 2, 396 8"
            fill="none"
            className="stroke-accent"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>

        <p className="font-marker text-role">{SITE.role}</p>
        <p className="max-w-90 text-lead leading-normal text-foreground">{SITE.description}</p>

        <ul className="flex flex-wrap gap-2 text-caption">
          {HERO_TAGS.map((tag) => (
            <li
              key={tag.label}
              className="flex items-center gap-1.5 rounded-lg bg-chip px-3 py-1.5"
            >
              <span aria-hidden="true" className={cn('font-bold', HERO_TAG_TONE_CLASS[tag.tone])}>
                +
              </span>
              {tag.label}
            </li>
          ))}
          <li className="flex items-center px-1 py-1.5 text-muted">... and more</li>
        </ul>

        <div className="mt-2 flex flex-wrap gap-4">
          <Button href="#projects">
            View My Projects
            <Icon name="arrowRight" size={18} strokeWidth={2.2} />
          </Button>
          <Button href="#top" intent="outline">
            Download Resume
            <Icon name="download" size={18} strokeWidth={2} />
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-caption text-muted">
          <svg
            width="18"
            height="24"
            viewBox="0 0 18 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="1.5" y="1.5" width="15" height="23" rx="7.5" />
            <path d="M9 6v5" strokeLinecap="round" />
          </svg>
          Scroll Down
        </div>
      </div>

      <HeroVisual />
    </section>
  );
}
