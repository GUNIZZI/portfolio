import Image from 'next/image';

import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';
import Panel from '@/shared/ui/panel/Panel';

import { ABOUT_LINES, ABOUT_STATS } from '../model/about.constants';

export default function About() {
  return (
    <section id="about" className="mx-auto mt-6 max-w-page scroll-mt-6 px-gutter">
      <Panel className="flex flex-wrap items-stretch overflow-hidden">
        <div className="relative flex min-h-60 min-w-0 flex-[1_1_300px] items-end justify-center pt-4">
          <p
            aria-hidden="true"
            className="absolute top-6 left-5 z-raised -rotate-10 font-hand text-hand leading-none font-bold whitespace-pre-line"
          >
            {"Let's\nBuild\nSomething\nGreat!"}
          </p>
          <div className="relative ml-[20%] aspect-[640/470] w-[78%] max-w-75">
            <svg
              viewBox="0 0 100 74"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 z-base size-full"
            >
              <path
                d="M50 2 L58 14 L72 4 L72 20 L90 14 L84 30 L100 34 L86 44 L98 58 L80 58 L84 74 L16 74 L20 58 L2 58 L14 44 L0 34 L16 30 L10 14 L28 20 L28 4 L42 14 Z"
                className="fill-doodle-yellow"
              />
            </svg>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="absolute top-[40%] -right-[6%] z-float w-[12%]"
            >
              <path
                d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
                className="fill-doodle-yellow"
              />
            </svg>
            <Image
              src="/images/characters/about.png"
              alt="윙크하며 엄지를 든 개발자 캐릭터 일러스트"
              fill
              sizes="300px"
              className="z-raised object-contain"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-[2_1_340px] flex-col justify-center gap-4 p-[clamp(24px,3vw,40px)]">
          <MarkerHeading underline="brand">ABOUT ME</MarkerHeading>
          <p className="text-body leading-relaxed text-foreground">
            {ABOUT_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <Button href="/about" intent="outlineBrand" size="md" className="self-start">
            More About Me
            <Icon name="arrowRight" size={16} strokeWidth={2} />
          </Button>
        </div>

        <ul className="grid min-w-0 flex-[1_1_320px] grid-cols-3 items-center p-6">
          {ABOUT_STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-center gap-1.5 border-l border-divider p-2 text-center"
            >
              <Icon name={stat.icon} size={32} strokeWidth={1.6} />
              <strong className="text-stat">{stat.value}</strong>
              <span className="text-caption text-foreground">{stat.label}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}
