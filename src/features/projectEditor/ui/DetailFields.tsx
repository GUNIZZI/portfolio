'use client';

import { useEffect, useRef } from 'react';

import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import {
    PROJECT_SCOPE_AREA_LABEL,
    PROJECT_SCOPE_LEVEL_LABEL,
} from '@/entities/project/model/project.constants';
import {
    PROJECT_SCOPE_LEVEL,
    type ProjectContentType,
} from '@/entities/project/model/project.schemas';
import { Button } from '@/shared/ui/button/button';
import ChipListField from '@/shared/ui/chipListField/ChipListField';
import { Select } from '@/shared/ui/select/select';
import { Switch } from '@/shared/ui/switch/switch';
import TextField from '@/shared/ui/textField/TextField';

import type { ProjectFormValue } from '../model/projectEditor.types';
import { createEmptyLink, createEmptyTeamPart, SCOPE_AREAS } from '../model/projectEditor.utils';

/**
 * 담당 범위에서 「없음」 을 고르는 항목의 값. 폼에는 빈 문자열로 둔다.
 * Select 의 항목은 빈 값을 가질 수 없어 목록 안에서만 이 값을 쓴다
 */
const NO_SCOPE_CODE = '__none__';

const SCOPE_LEVEL_LIST = [
    { code: NO_SCOPE_CODE, name: '없음' },
    ...Object.values(PROJECT_SCOPE_LEVEL).map((level) => ({
        code: level,
        name: PROJECT_SCOPE_LEVEL_LABEL[level],
    })),
];

/**
 * 팀 · 링크의 줄 1개. 카드 면으로 묶어 줄마다 구분한다.
 * 소개의 목록 줄과 같은 모양이다.(src/features/aboutEditor/ui/ListField.tsx)
 */
const ROW_CLASS_NAME = 'flex flex-wrap items-start gap-2 rounded-lg bg-card p-4';

/** 줄 안에서 포커스를 받는 자리. 줄을 빼거나 옮긴 뒤 포커스를 보낼 곳을 가리킨다 */
const ROW_TARGET = { FIRST: 'first', UP: 'up', DOWN: 'down' } as const;
type RowTarget = (typeof ROW_TARGET)[keyof typeof ROW_TARGET];

/** 줄을 더하고 빼고 옮긴 뒤 포커스를 보낼 곳. 줄의 자리와 그 안의 요소, 또는 더하기 버튼이다 */
type FocusTarget = { index: number; target: RowTarget } | 'add';

function toTargetId(listId: string, index: number, target: RowTarget): string {
    return `${listId}-${index}-${target}`;
}

/**
 * 줄을 더하고 빼고 옮긴 뒤의 포커스를 맡는다. 줄이 바뀌어 그려진 뒤에 보낸다.
 * 옮긴 줄의 버튼이 끝에 닿아 비활성이 되거나 뺀 줄이 사라지면 포커스가 사라지기 때문이다.
 * 경력의 프로젝트 줄과 같은 방식이다.(src/features/experienceEditor/ui/ExperienceForm.tsx)
 * @param listId - 줄의 요소 id 앞에 붙는 값
 * @param rows - 지금의 줄. 바뀌면 포커스를 보낸다
 */
function useRowFocus(listId: string, rows: readonly unknown[]) {
    const focusTargetRef = useRef<FocusTarget | null>(null);

    useEffect(() => {
        const focusTarget = focusTargetRef.current;
        if (!focusTarget) return;
        focusTargetRef.current = null;

        const id =
            focusTarget === 'add'
                ? `${listId}-add`
                : toTargetId(listId, focusTarget.index, focusTarget.target);
        document.getElementById(id)?.focus();
    }, [rows, listId]);

    return {
        /** 새 줄의 첫 입력으로 보낸다 */
        focusAdded(index: number) {
            focusTargetRef.current = { index, target: ROW_TARGET.FIRST };
        },
        /** 누른 버튼에 포커스를 남긴다. 끝에 닿아 그 버튼이 비활성이 되면 반대쪽 버튼으로 보낸다 */
        focusMoved(index: number, offset: -1 | 1) {
            const target = index + offset;
            const isAtEnd = target === 0 || target === rows.length - 1;
            const pressed = offset === -1 ? ROW_TARGET.UP : ROW_TARGET.DOWN;
            const opposite = offset === -1 ? ROW_TARGET.DOWN : ROW_TARGET.UP;
            focusTargetRef.current = { index: target, target: isAtEnd ? opposite : pressed };
        },
        /** 그다음 줄로 보낸다. 끝 줄을 뺐으면 앞 줄로, 줄이 없으면 더하기 버튼으로 보낸다 */
        focusRemoved(index: number) {
            if (rows.length === 1) {
                focusTargetRef.current = 'add';
                return;
            }
            const isLast = index === rows.length - 1;
            focusTargetRef.current = {
                index: isLast ? index - 1 : index,
                target: ROW_TARGET.FIRST,
            };
        },
    };
}

interface RowActionsAttributes {
    listId: string;
    index: number;
    /** 줄의 이름. 버튼의 이름 앞에 붙는다 — `1번째 팀 역할` */
    name: string;
    isFirst: boolean;
    isLast: boolean;
    onMove: (offset: -1 | 1) => void;
    onRemove: () => void;
}

/** 줄의 위 · 아래 · 빼기 버튼 */
function RowActions({
    listId,
    index,
    name,
    isFirst,
    isLast,
    onMove,
    onRemove,
}: RowActionsAttributes) {
    return (
        <div className="flex min-h-9 items-center gap-1">
            <Button
                id={toTargetId(listId, index, ROW_TARGET.UP)}
                variant="secondary"
                size="2xs"
                aria-label={`${name} 위로`}
                disabled={isFirst}
                onClick={() => {
                    onMove(-1);
                }}
                className="flex w-6.5 items-center justify-center p-0"
            >
                <ArrowUp className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
                id={toTargetId(listId, index, ROW_TARGET.DOWN)}
                variant="secondary"
                size="2xs"
                aria-label={`${name} 아래로`}
                disabled={isLast}
                onClick={() => {
                    onMove(1);
                }}
                className="flex w-6.5 items-center justify-center p-0"
            >
                <ArrowDown className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
                variant="destructive"
                size="2xs"
                aria-label={`${name} 빼기`}
                onClick={onRemove}
                className="flex w-6.5 items-center justify-center p-0"
            >
                <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
        </div>
    );
}

interface OwnProps {
    /** 요소 id 앞에 붙는 값. 폼의 id 다 */
    formId: string;
}

/**
 * 프로젝트의 상세 항목. 팀 · 역할 · 담당 범위 · 기간 · 기술 · 링크다. 공개 화면의 상세가 메타로 그린다.
 * 모두 비워 둘 수 있고, 비운 항목은 상세가 그리지 않는다.(docs/plan/admin/README.md 「등록 · 수정」)
 * 값과 오류 문구는 감싼 폼(FormProvider)에서 읽는다.(ProjectForm.tsx)
 */
export default function DetailFields({ formId }: OwnProps) {
    const {
        control,
        register,
        trigger,
        getValues,
        getFieldState,
        formState: { errors },
    } = useFormContext<ProjectFormValue, unknown, ProjectContentType>();
    const team = useFieldArray({ control, name: 'team' });
    const links = useFieldArray({ control, name: 'links' });
    const isOngoing = useWatch({ control, name: 'isOngoing' });
    const teamListId = `${formId}-team`;
    const linkListId = `${formId}-links`;
    const teamFocus = useRowFocus(teamListId, team.fields);
    const linkFocus = useRowFocus(linkListId, links.fields);

    /**
     * 기간의 끝을 다시 검증한다. 시작이나 진행 중을 바꾸면 끝의 오류가 달라진다.
     * 아직 손대지 않은 빈 끝은 건드리지 않는다
     */
    function revalidatePeriodEnd() {
        if (getFieldState('period.end').isTouched || getValues('period.end') !== '') {
            void trigger('period.end');
        }
    }

    /** 기간의 시작을 다시 검증한다. 끝을 적으면 시작이 필수가 된다 */
    function revalidatePeriodStart() {
        void trigger('period.start');
    }

    return (
        <div className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-lg font-semibold">
                    팀
                    <span className="ml-2 text-caption font-normal text-muted-foreground">
                        역할별 인원
                    </span>
                </legend>
                <ol className="flex flex-col gap-2">
                    {team.fields.map((field, index) => {
                        const name = `${index + 1}번째 팀 역할`;
                        return (
                            // 줄을 옮겨도 입력 중인 내용이 따라가게, 자리가 아니라 줄에 붙은 id 를 쓴다
                            <li key={field.id} className={ROW_CLASS_NAME}>
                                <TextField
                                    id={toTargetId(teamListId, index, ROW_TARGET.FIRST)}
                                    aria-label={`${name} 이름`}
                                    afterLabel="역할"
                                    placeholder="프론트엔드"
                                    {...register(`team.${index}.part`)}
                                    error={errors.team?.[index]?.part?.message}
                                    className="min-w-40 flex-1"
                                />
                                <TextField
                                    aria-label={`${name} 인원`}
                                    afterLabel="명"
                                    inputMode="numeric"
                                    {...register(`team.${index}.count`)}
                                    error={errors.team?.[index]?.count?.message}
                                    className="w-28"
                                    inputClassName="text-right"
                                />
                                <RowActions
                                    listId={teamListId}
                                    index={index}
                                    name={name}
                                    isFirst={index === 0}
                                    isLast={index === team.fields.length - 1}
                                    onMove={(offset) => {
                                        teamFocus.focusMoved(index, offset);
                                        team.move(index, index + offset);
                                    }}
                                    onRemove={() => {
                                        teamFocus.focusRemoved(index);
                                        team.remove(index);
                                    }}
                                />
                            </li>
                        );
                    })}
                </ol>
                <div className="text-center">
                    <Button
                        id={`${teamListId}-add`}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            teamFocus.focusAdded(team.fields.length);
                            team.append(createEmptyTeamPart(), { shouldFocus: false });
                        }}
                        className="items-center px-10"
                    >
                        팀 역할 추가
                    </Button>
                </div>
            </fieldset>

            <div className="flex flex-col gap-1">
                <h3 className="mb-3 text-lg font-semibold">역할과 기간</h3>
                <TextField
                    beforeLabel="역할"
                    placeholder="프론트엔드 개발"
                    {...register('role')}
                    error={errors.role?.message}
                />
                <div className="flex flex-col gap-1 md:flex-row md:items-start">
                    <TextField
                        beforeLabel="시작일"
                        placeholder="2025.06"
                        inputMode="decimal"
                        maxLength={7}
                        {...register('period.start', { onChange: revalidatePeriodEnd })}
                        error={errors.period?.start?.message}
                        className="md:w-48"
                    />
                    {/* 진행 중이면 적어 둔 값을 감추고 입력을 막는다. 값은 지우지 않아 끄면 되돌아온다 */}
                    <Controller
                        control={control}
                        name="period.end"
                        render={({ field, fieldState }) => (
                            <TextField
                                beforeLabel="종료일"
                                placeholder={isOngoing ? '진행 중' : '2026.01'}
                                inputMode="decimal"
                                maxLength={7}
                                ref={field.ref}
                                name={field.name}
                                onChange={(event) => {
                                    field.onChange(event);
                                    revalidatePeriodStart();
                                }}
                                onBlur={field.onBlur}
                                disabled={isOngoing}
                                value={isOngoing ? '' : field.value}
                                error={isOngoing ? undefined : fieldState.error?.message}
                                className="md:w-48"
                            />
                        )}
                    />
                    {/* 입력과 높이를 맞춰 가운데에 놓는다 */}
                    <div className="flex min-h-9 items-center gap-2 md:pl-2">
                        <label
                            htmlFor={`${formId}-ongoing`}
                            className="cursor-pointer text-caption font-medium text-muted-foreground"
                        >
                            진행 중
                        </label>
                        <Controller
                            control={control}
                            name="isOngoing"
                            render={({ field }) => (
                                <Switch
                                    id={`${formId}-ongoing`}
                                    ref={field.ref}
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        revalidatePeriodEnd();
                                        revalidatePeriodStart();
                                    }}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-lg font-semibold">
                    담당 범위
                    <span className="ml-2 text-caption font-normal text-muted-foreground">
                        직접 맡은 항목을 선택해 주세요.
                    </span>
                </legend>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {SCOPE_AREAS.map((area) => (
                        <Controller
                            key={area}
                            control={control}
                            name={`scope.${area}`}
                            render={({ field }) => (
                                <Select
                                    aria-label={`${PROJECT_SCOPE_AREA_LABEL[area]} 단계`}
                                    beforeLabel={PROJECT_SCOPE_AREA_LABEL[area]}
                                    list={SCOPE_LEVEL_LIST}
                                    // 고르지 않은 영역은 「없음」 으로 그린다
                                    value={field.value === '' ? NO_SCOPE_CODE : field.value}
                                    onChange={(code) => {
                                        field.onChange(code === NO_SCOPE_CODE ? '' : code);
                                    }}
                                />
                            )}
                        />
                    ))}
                </div>
            </fieldset>

            <Controller
                control={control}
                name="stack"
                render={({ field }) => (
                    <ChipListField
                        label="기술"
                        items={field.value}
                        onChange={field.onChange}
                        min={0}
                        addLabel="기술 이름"
                    />
                )}
            />

            <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-lg font-semibold">
                    링크
                    <span className="ml-2 text-caption font-normal text-muted-foreground">
                        서비스 · 저장소
                    </span>
                </legend>
                <ol className="flex flex-col gap-2">
                    {links.fields.map((field, index) => {
                        const name = `${index + 1}번째 링크`;
                        return (
                            <li key={field.id} className={ROW_CLASS_NAME}>
                                <TextField
                                    id={toTargetId(linkListId, index, ROW_TARGET.FIRST)}
                                    aria-label={`${name} 이름`}
                                    afterLabel="이름"
                                    placeholder="서비스"
                                    {...register(`links.${index}.label`)}
                                    error={errors.links?.[index]?.label?.message}
                                    className="w-48"
                                />
                                <TextField
                                    aria-label={`${name} 주소`}
                                    afterLabel="주소"
                                    placeholder="https://"
                                    inputMode="url"
                                    {...register(`links.${index}.href`)}
                                    error={errors.links?.[index]?.href?.message}
                                    className="min-w-60 flex-1"
                                />
                                <RowActions
                                    listId={linkListId}
                                    index={index}
                                    name={name}
                                    isFirst={index === 0}
                                    isLast={index === links.fields.length - 1}
                                    onMove={(offset) => {
                                        linkFocus.focusMoved(index, offset);
                                        links.move(index, index + offset);
                                    }}
                                    onRemove={() => {
                                        linkFocus.focusRemoved(index);
                                        links.remove(index);
                                    }}
                                />
                            </li>
                        );
                    })}
                </ol>
                <div className="text-center">
                    <Button
                        id={`${linkListId}-add`}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            linkFocus.focusAdded(links.fields.length);
                            links.append(createEmptyLink(), { shouldFocus: false });
                        }}
                        className="items-center px-10"
                    >
                        + 링크 추가
                    </Button>
                </div>
            </fieldset>
        </div>
    );
}
