import Image from 'next/image';

import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';
import { SITE } from '@/config/site';

export default function Contact() {
  const mailto = `mailto:${SITE.email}`;

  return (
    <section
      id="contact"
      className="mx-auto flex max-w-page scroll-mt-6 flex-wrap items-center gap-8 px-gutter py-[clamp(40px,6vw,64px)]"
    >
      <div className="min-w-0 flex-[1_1_260px]">
        <h2 className="inline-block -rotate-3 font-marker text-contact font-normal">
          Get in Touch!
        </h2>
        <svg
          viewBox="0 0 300 16"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="block h-3.5 w-[min(100%,260px)]"
        >
          <path
            d="M4 12 C 100 3, 200 2, 296 6"
            fill="none"
            className="stroke-accent"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-5">
        <p className="text-body leading-relaxed text-foreground">
          Have a project in mind or just want to say hi?
          <br />
          I&apos;d love to hear from you.
        </p>
        <Button href={mailto} className="group self-start">
          <Icon name="send" size={18} strokeWidth={2} />
          {/* 두 문구를 같은 칸에 겹쳐 둔다. 문구가 바뀌어도 버튼 폭이 변하지 않는다 */}
          <span className="grid justify-items-center">
            <span className="col-start-1 row-start-1 group-hover:invisible group-focus-visible:invisible">
              Get in Touch
            </span>
            <span className="invisible col-start-1 row-start-1 group-hover:visible group-focus-visible:visible">
              {SITE.email}
            </span>
          </span>
          <Icon name="arrowRight" size={16} strokeWidth={2.2} />
        </Button>
      </div>

      <div className="flex min-w-0 flex-[1_1_220px] items-center justify-end gap-3">
        <p
          aria-hidden="true"
          className="-rotate-8 font-hand text-hand-sm leading-none font-bold whitespace-pre-line"
        >
          {'Good\nIdeas\nStart with\na Conversation'}
        </p>
        <Image
          src="/images/characters/peace.png"
          alt=""
          width={96}
          height={117}
          className="h-auto w-24"
        />
      </div>
    </section>
  );
}
