import Image from 'next/image';

import { Button } from '@/shared/ui/button/button';
import DrawnPath from '@/shared/ui/drawnPath/DrawnPath';
import Icon from '@/shared/ui/icon/Icon';
import { cn } from '@/shared/util/cn';
import { SITE } from '@/config/site';

/**
 * 연락 섹션. 모든 페이지의 푸터 위에 붙는다.(2026-11-16 사용자 결정)
 * 헤더의 Contact 버튼과 푸터의 Contact 가 이 섹션(#contact)으로 온다
 */
export default function Contact() {
    const mailto = `mailto:${SITE.email}`;

    return (
        <section
            id="contact"
            className="mx-auto flex max-w-page scroll-mt-header flex-wrap items-center gap-8 px-gutter py-[clamp(40px,6vw,64px)]"
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
                    <DrawnPath
                        d="M4 12 C 100 3, 200 2, 296 6"
                        className="stroke-primary"
                        strokeWidth={8}
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-5">
                <p className="text-body leading-relaxed text-foreground">
                    함께 하고 싶은 프로젝트가 있나요?
                    <br />
                    가벼운 인사도 좋아요. 편하게 메일 주세요.
                </p>
                <Button
                    asChild
                    effect="sweep"
                    arrow="end"
                    icon={<Icon name="send" size={18} strokeWidth={2} />}
                    className="group self-start"
                >
                    <a href={mailto}>
                        {/*
                      두 문구를 같은 칸에 겹쳐 둔다. 문구가 바뀌어도 버튼 폭이 변하지 않는다.
                      마우스를 올리면 문구가 위로 말려 올라가고 메일 주소가 아래에서 올라온다.
                      가려진 쪽은 invisible 이라 스크린 리더가 한 번에 하나만 읽는다
                    */}
                        <span className="grid justify-items-center overflow-hidden">
                            <span
                                className={cn(
                                    'col-start-1 row-start-1',
                                    'group-hover:invisible group-hover:-translate-y-full',
                                    'group-focus-visible:invisible group-focus-visible:-translate-y-full',
                                    'transition-[translate,visibility] duration-fast ease-move',
                                )}
                            >
                                Get in Touch
                            </span>
                            <span
                                className={cn(
                                    'invisible col-start-1 row-start-1 translate-y-full',
                                    'group-hover:visible group-hover:translate-y-0',
                                    'group-focus-visible:visible group-focus-visible:translate-y-0',
                                    'transition-[translate,visibility] duration-fast ease-move',
                                )}
                            >
                                {SITE.email}
                            </span>
                        </span>
                    </a>
                </Button>
            </div>

            <div className="flex min-w-0 flex-[1_1_220px] items-center justify-end gap-3">
                <p
                    aria-hidden="true"
                    className="-rotate-8 font-hand text-hand-sm leading-none font-bold whitespace-pre-line"
                >
                    {'Good\nIdeas\nStart with\na Conversation'}
                </p>
                {/* 손은 흰 선으로 그린 그림이라 밝은 바탕에서 보이지 않는다. 라이트에서는 선이 짙은 그림으로 바꿔 끼운다 */}
                <Image
                    src="/images/characters/peace.png"
                    alt=""
                    width={96}
                    height={117}
                    className="h-auto w-24 theme-light:hidden"
                />
                <Image
                    src="/images/characters/peace-light.png"
                    alt=""
                    width={96}
                    height={117}
                    className="hidden h-auto w-24 theme-light:block"
                />
            </div>
        </section>
    );
}
