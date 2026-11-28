import type { ColophonData } from '@/entities/colophon/model/colophon.types';
import { Button } from '@/shared/ui/button/button';
import MarkerHeading from '@/shared/ui/markerHeading/MarkerHeading';
import Panel from '@/shared/ui/panel/Panel';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table/table';
import { REPOSITORY_URL } from '@/config/site';

import { COLOPHON_FONT_FACE_CLASS, COLOPHON_SECTION_ID } from '../model/colophon.constants';
import ColophonSection from './ColophonSection';
import LayerDiagram from './LayerDiagram';
import ProcessSteps from './ProcessSteps';
import RoleBadge from './RoleBadge';

const CARD_CLASS = 'rounded-card border border-border-card bg-card';

interface OwnProps {
    /** 글과 표의 내용. 페이지가 entity colophon 에서 읽어 넘긴다 */
    data: ColophonData;
}

/**
 * 이 사이트를 만든 과정을 순서대로 보여 주는 페이지의 본문. 섹션은 7개다.
 * 글과 표는 서버에서 그리고, 움직이는 과정 그림과 구조 그림만 클라이언트 컴포넌트다.
 * 목록은 자리를 key 로 쓴다. 항목에 고유한 값이 없고, 제목은 관리 화면에서 고칠 수 있어 겹칠 수 있다.
 */
export default function Colophon({ data }: OwnProps) {
    const { head, process, design, develop, guards, human, stack } = data;

    return (
        <>
            {/* 1. 머리 */}
            <section className="mx-auto flex max-w-page flex-col gap-6 px-gutter pt-10">
                <MarkerHeading as="h1" underline="primary" underlineClassName="w-60">
                    HOW THIS SITE IS BUILT
                </MarkerHeading>
                <p className="max-w-2xl text-lead leading-relaxed text-foreground">
                    {head.summary}
                </p>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <dl className="flex flex-wrap gap-x-10 gap-y-4">
                            {head.stats.map((stat, index) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <dt className="text-caption text-muted-foreground">
                                        {stat.label}
                                    </dt>
                                    <dd className="text-stat font-bold text-strong">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <p className="text-2xs text-muted-foreground">집계. {head.statsDate}</p>
                    </div>
                    <Button asChild variant="outlineBrand" size="md" effect="sweep" arrow="end">
                        <a
                            href={REPOSITORY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub에서 코드 보기 (새 탭)"
                        >
                            GitHub에서 코드 보기
                        </a>
                    </Button>
                </div>
            </section>

            {/* 2. 과정 한눈에 */}
            <ColophonSection
                id={COLOPHON_SECTION_ID.PROCESS}
                title="PROCESS"
                lead="이 순서로 만들었습니다. 단계를 누르면 그 내용으로 내려갑니다."
                underline="brand"
            >
                <ProcessSteps steps={process.items} isLinked />
            </ColophonSection>

            {/* 3. 디자인 */}
            <ColophonSection
                id={COLOPHON_SECTION_ID.DESIGN}
                title="DESIGN"
                lead="취향에서 컨셉을 정하고, 레퍼런스를 모아 GPT 에 시안을 맡겼습니다."
                underline="primary"
            >
                <ol className="grid gap-4 sm:grid-cols-2">
                    {design.items.map((step, index) => (
                        <li key={index} className={`${CARD_CLASS} flex flex-col gap-2.5 p-6`}>
                            <span aria-hidden="true" className="font-marker text-stat text-primary">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-lead font-bold text-strong">{step.title}</h3>
                            <RoleBadge role={step.role} />
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </ColophonSection>

            {/* 4. Claude 가 개발 */}
            <ColophonSection
                id={COLOPHON_SECTION_ID.DEVELOP}
                title="DEVELOP"
                lead="기능은 기획부터 커밋까지 다섯 단계를 거쳐 완성했습니다. 관리자 대시보드를 예로 각 단계에서 한 일을 정리했습니다."
                underline="brand"
            >
                <Panel className="p-[clamp(12px,3vw,28px)]">
                    {/*
                      공용 Table 의 바깥 칸은 키보드로 닿지 않는다. 좁은 화면에서 링크가 없는 행도 가로로 넘겨 읽을 수 있게,
                      스크롤하는 칸을 여기서 만들어 초점을 받게 한다. 행과 칸은 공용 부품 그대로다
                    */}
                    <div
                        role="region"
                        aria-label="개발 과정 표. 화면이 좁으면 좌우로 스크롤할 수 있습니다."
                        tabIndex={0}
                        className="w-full overflow-x-auto"
                    >
                        <table className="w-full text-sm">
                            <TableHeader>
                                <TableRow>
                                    <TableHead scope="col">단계</TableHead>
                                    <TableHead scope="col">작업 내용</TableHead>
                                    <TableHead scope="col">대시보드 적용 사례</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {develop.items.map((step, index) => (
                                    <TableRow key={index}>
                                        <TableHead
                                            scope="row"
                                            className="h-auto p-2 align-top text-strong"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mr-2 font-marker text-primary"
                                            >
                                                {index + 1}
                                            </span>
                                            {step.title}
                                        </TableHead>
                                        {/* 문장이 길어 줄을 바꾼다. 좁은 화면에서는 최소 폭만큼 표가 가로로 스크롤한다 */}
                                        <TableCell className="min-w-56 align-top leading-relaxed whitespace-normal">
                                            {step.work}
                                        </TableCell>
                                        <TableCell className="min-w-56 align-top leading-relaxed whitespace-normal text-muted-foreground">
                                            {step.example}
                                            {step.links.length > 0 ? (
                                                <ul className="mt-1.5 flex flex-col gap-1">
                                                    {step.links.map((link, linkIndex) => (
                                                        <li key={linkIndex}>
                                                            <a
                                                                href={link.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label={`${link.label} (새 탭)`}
                                                                className="text-caption break-all text-strong underline underline-offset-4 hover:text-primary"
                                                            >
                                                                {link.label}
                                                                <span aria-hidden="true"> ↗</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </table>
                    </div>
                </Panel>
            </ColophonSection>

            {/* 5. AI 가 틀리지 않게 한 장치 */}
            <ColophonSection
                id={COLOPHON_SECTION_ID.GUARDS}
                title="GUARDRAILS"
                lead="Claude와 작업할 때도 프로젝트 규칙을 일관되게 적용할 수 있도록 문서와 자동 검사를 마련했습니다."
                underline="primary"
            >
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                    {guards.items.map((guard, index) => (
                        <li key={index} className={`${CARD_CLASS} flex flex-col gap-3 p-5`}>
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="text-lead font-bold text-strong">{guard.name}</h3>
                                <span className="rounded-md bg-chip px-2.5 py-1 text-2xs text-muted-foreground">
                                    {guard.count}
                                </span>
                            </div>
                            <dl className="flex flex-col gap-2 text-sm leading-relaxed">
                                <div>
                                    <dt className="text-2xs font-semibold text-muted-foreground">
                                        점검 항목
                                    </dt>
                                    <dd className="text-foreground">{guard.prevents}</dd>
                                </div>
                                <div>
                                    <dt className="text-2xs font-semibold text-muted-foreground">
                                        적용 예
                                    </dt>
                                    <dd className="text-muted-foreground">{guard.example}</dd>
                                </div>
                            </dl>
                        </li>
                    ))}
                </ul>
            </ColophonSection>

            {/* 6. 사람이 한 일 */}
            <ColophonSection
                id={COLOPHON_SECTION_ID.HUMAN}
                title="HUMAN"
                lead="제가 맡은 일입니다."
                underline="brand"
            >
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {human.items.map((work, index) => (
                        <li key={index} className={`${CARD_CLASS} flex flex-col gap-2.5 p-6`}>
                            <h3 className="text-lead font-bold text-strong">{work.title}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {work.description}
                            </p>
                        </li>
                    ))}
                </ul>
            </ColophonSection>

            {/* 7. 기술과 구조 */}
            <ColophonSection
                id={COLOPHON_SECTION_ID.STACK}
                title="STACK"
                lead="사이트에 사용한 기술, 코드 구조, 글꼴을 정리했습니다. 코드는 상위 계층에서 하위 계층을 참조하는 구조입니다."
                underline="primary"
            >
                <div className="flex flex-col gap-8">
                    <ul className="flex flex-wrap gap-1.5">
                        {stack.techs.map((tech) => (
                            <li
                                key={tech}
                                className="rounded-md bg-chip px-3 py-1.5 text-caption text-foreground"
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>
                    <Panel className="p-[clamp(20px,5vw,48px)]">
                        <div className="mx-auto max-w-2xl">
                            <LayerDiagram />
                        </div>
                    </Panel>
                    <ul className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                        {stack.fonts.map((font, index) => (
                            <li key={index} className={`${CARD_CLASS} flex flex-col gap-2 p-5`}>
                                <span
                                    className={`${COLOPHON_FONT_FACE_CLASS[font.face]} text-stat text-strong`}
                                >
                                    {font.name}
                                </span>
                                <span className="text-sm text-foreground">{font.usage}</span>
                                <span className="text-2xs text-muted-foreground">
                                    {font.license}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </ColophonSection>
        </>
    );
}
