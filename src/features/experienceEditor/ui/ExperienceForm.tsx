'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';

import {
    createExperienceAction,
    updateExperienceAction,
} from '@/entities/experience/actions/experience.actions';
import type { ExperienceType } from '@/entities/experience/model/experience.schemas';
import {
    EXPERIENCE_SAVE_STATUS,
    type ExperienceEditorData,
} from '@/entities/experience/model/experience.types';
import { Button } from '@/shared/ui/button/button';
import Panel from '@/shared/ui/panel/Panel';
import { Separator } from '@/shared/ui/separator/separator';
import { Switch } from '@/shared/ui/switch/switch';
import TextField from '@/shared/ui/textField/TextField';
import { useToast } from '@/shared/ui/toast/ToastProvider';

import { EDITOR_MESSAGE, EXPERIENCE_ROUTE } from '../model/experienceEditor.constants';
import { ExperienceFormSchema } from '../model/experienceEditor.schemas';
import type { ExperienceFormValue, ProjectOption } from '../model/experienceEditor.types';
import { createEmptyProject, toFormValue } from '../model/experienceEditor.utils';
import ExperienceDeleteButton from './ExperienceDeleteButton';
import ProjectRow, { ROW_TARGET, type RowTarget, toRowTargetId } from './ProjectRow';

interface OwnProps {
    /** 고칠 경력. 등록 화면이면 null */
    experience: ExperienceEditorData | null;
    /** 프로젝트 연결에서 고를 수 있는 프로젝트. 페이지가 읽어 넘긴다 */
    projects: ProjectOption[];
}

/**
 * 경력 등록(S-02) · 수정(S-03) 폼. 회사 정보와 그 회사에서 한 프로젝트 목록을 함께 저장한다.
 * 저장된 내용이 바뀌면 폼을 새로 만든다. 저장하고 돌아왔을 때 저장하기 전의 값을 기준으로 삼지 않게 한다.
 */
export default function ExperienceForm({ experience, projects }: OwnProps) {
    return (
        <ExperienceFormBody
            key={JSON.stringify(experience)}
            experience={experience}
            projects={projects}
        />
    );
}

/** 줄을 더하고 빼고 옮긴 뒤 포커스를 보낼 곳. 줄의 자리와 그 안의 요소, 또는 더하기 버튼이다 */
type FocusTarget = { index: number; target: RowTarget } | 'add';

/**
 * 폼의 본체. react-hook-form 으로 값을 갖고, 검증과 오류 문구는 zod 스키마가 낸다.
 * (Kozipsa docs/form.md, 2026-11-18 사용자 결정)
 * 규칙에 맞을 때만 저장할 수 있고, 수정 화면에서는 고친 내용도 있어야 한다.
 * 저장하면 경력 목록으로 돌아가 토스트를 띄운다. 취소하거나 나가도 묻지 않고, 고친 내용은 남기지 않는다.
 */
function ExperienceFormBody({ experience, projects }: OwnProps) {
    const [initial] = useState(() =>
        toFormValue(
            experience?.content ?? null,
            projects.map((project) => project.id),
        ),
    );
    const form = useForm<ExperienceFormValue, unknown, ExperienceType>({
        resolver: zodResolver(ExperienceFormSchema),
        // 고칠 때마다, 그리고 포커스가 나갈 때 그 항목을 검증한다. 빈 필수 항목은 지나간 뒤에 알린다
        mode: 'all',
        defaultValues: initial,
    });
    const {
        control,
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        getFieldState,
        formState: { errors, isValid, isDirty },
    } = form;
    const { fields, prepend, move, remove } = useFieldArray({ control, name: 'projects' });
    const isCurrent = useWatch({ control, name: 'isCurrent' });
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const toast = useToast();
    const formId = useId();
    const focusTargetRef = useRef<FocusTarget | null>(null);

    // 화면을 떠나면 처음 값으로 되돌린다. Next 는 떠난 화면을 지우지 않고 숨겨 두어, 그대로 두면 다시 왔을 때 입력이 남아 있다.
    // (node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md 「Forms, inputs, and state」)
    useLayoutEffect(
        () => () => {
            reset(initial);
        },
        [reset, initial],
    );

    // 줄이 바뀌어 그려진 뒤에 포커스를 보낸다. 옮긴 줄의 버튼이 비활성이 되면 포커스가 사라지기 때문이다
    useEffect(() => {
        const focusTarget = focusTargetRef.current;
        if (!focusTarget) return;
        focusTargetRef.current = null;

        if (focusTarget === 'add') {
            document.getElementById(`${formId}-add`)?.focus();
            return;
        }
        document
            .getElementById(toRowTargetId(`${formId}-${focusTarget.index}`, focusTarget.target))
            ?.focus();
    }, [fields, formId]);

    const isEdit = experience !== null;
    const isBlocked = (isEdit && !isDirty) || !isValid;

    /**
     * 퇴사를 다시 검증한다. 입사나 재직 중을 바꾸면 퇴사의 오류가 달라진다.
     * 아직 손대지 않은 빈 퇴사는 건드리지 않는다. 지나가기 전에는 빈 필수 항목을 알리지 않는다
     */
    function revalidateEndYear() {
        if (getFieldState('endYear').isTouched || getValues('endYear') !== '') {
            void trigger('endYear');
        }
    }

    function hndlProjectAdd() {
        focusTargetRef.current = { index: 0, target: ROW_TARGET.NAME };
        // 맨 위에 놓는다. 공개 화면이 최근 프로젝트를 위에 그린다
        prepend(createEmptyProject(), { shouldFocus: false });
    }

    function hndlProjectMove(index: number, offset: -1 | 1) {
        // 누른 버튼에 포커스를 남긴다. 끝에 닿아 그 버튼이 비활성이 되면 반대쪽 버튼으로 보낸다
        const target = index + offset;
        const isAtEnd = target === 0 || target === fields.length - 1;
        const pressed: RowTarget = offset === -1 ? ROW_TARGET.UP : ROW_TARGET.DOWN;
        const opposite: RowTarget = offset === -1 ? ROW_TARGET.DOWN : ROW_TARGET.UP;
        focusTargetRef.current = { index: target, target: isAtEnd ? opposite : pressed };
        move(index, target);
    }

    function hndlProjectRemove(index: number) {
        // 그다음 줄로 포커스를 보낸다. 끝 줄을 뺐으면 앞 줄로, 줄이 없으면 더하기 버튼으로 보낸다
        const isLast = index === fields.length - 1;
        if (fields.length === 1) {
            focusTargetRef.current = 'add';
        } else {
            // 뺀 뒤에는 그다음 줄이 이 자리로 올라온다
            focusTargetRef.current = { index: isLast ? index - 1 : index, target: ROW_TARGET.NAME };
        }
        remove(index);
    }

    /** 스키마를 통과한 내용을 받는다. 글자로 적은 연도와 수는 스키마가 숫자로 바꿔 준다 */
    function hndlValid(content: ExperienceType) {
        if (isBlocked || isPending) return;

        startTransition(async () => {
            const status = experience
                ? await updateExperienceAction(experience.id, content)
                : await createExperienceAction(content);

            if (status === EXPERIENCE_SAVE_STATUS.SAVED) {
                toast.success(isEdit ? EDITOR_MESSAGE.SAVED : EDITOR_MESSAGE.CREATED);
                router.push(EXPERIENCE_ROUTE.LIST);
                return;
            }
            toast.error(
                status === EXPERIENCE_SAVE_STATUS.NOT_FOUND
                    ? EDITOR_MESSAGE.NOT_FOUND
                    : EDITOR_MESSAGE.SAVE_FAILED,
            );
        });
    }

    return (
        <Panel className="p-6">
            <FormProvider {...form}>
                <form
                    aria-label={isEdit ? '경력 수정' : '경력 등록'}
                    onSubmit={(event) => {
                        void handleSubmit(hndlValid)(event);
                    }}
                    className="flex flex-col gap-8"
                >
                    <div className="flex flex-col gap-1">
                        {/* 수정 일시의 자리와 모양은 소개 수정과 같다.(src/features/aboutEditor/ui/SectionShell.tsx) */}
                        <div className="flex items-center justify-between gap-2 pb-3">
                            <h2 className="text-2xl font-bold text-strong">회사</h2>
                            {experience?.updatedAtText ? (
                                <span className="text-xs text-muted-foreground">
                                    수정. {experience.updatedAtText}
                                </span>
                            ) : null}
                        </div>
                        <div className="flex items-start gap-4">
                            <TextField
                                beforeLabel="회사명"
                                {...register('company')}
                                error={errors.company?.message}
                                className="flex-1"
                            />
                            {/* 입력과 높이를 맞춰 가운데에 놓는다 */}
                            <div className="flex min-h-9 items-center gap-2">
                                <label
                                    htmlFor={`${formId}-current`}
                                    className="cursor-pointer text-caption font-medium text-muted-foreground"
                                >
                                    재직 중
                                </label>
                                <Controller
                                    control={control}
                                    name="isCurrent"
                                    render={({ field }) => (
                                        <Switch
                                            id={`${formId}-current`}
                                            ref={field.ref}
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                revalidateEndYear();
                                            }}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 md:flex-row md:items-start">
                            <TextField
                                beforeLabel="입사"
                                inputMode="numeric"
                                maxLength={4}
                                {...register('startYear', { onChange: revalidateEndYear })}
                                error={errors.startYear?.message}
                                className="md:w-40"
                            />
                            {/* 재직 중이면 적어 둔 값을 감추고 입력을 막는다. 값은 지우지 않아 끄면 되돌아온다 */}
                            <Controller
                                control={control}
                                name="endYear"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        beforeLabel="퇴사"
                                        placeholder={isCurrent ? '재직 중' : undefined}
                                        inputMode="numeric"
                                        maxLength={4}
                                        ref={field.ref}
                                        name={field.name}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        disabled={isCurrent}
                                        value={isCurrent ? '' : field.value}
                                        error={isCurrent ? undefined : fieldState.error?.message}
                                        className="md:w-40"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <TextField isMultiline {...register('summary')} />
                        </div>
                    </div>
                    <Separator />
                    <fieldset className="flex flex-col gap-3">
                        <div className="mb-5 flex flex-col md:mb-0 md:flex-row md:justify-between">
                            <legend className="mb-3 text-lg font-semibold">
                                프로젝트 목록
                                <span className="ml-2 text-caption font-normal text-muted-foreground">
                                    {fields.length}개
                                </span>
                            </legend>
                            <div className="flex flex-col gap-2">
                                <TextField
                                    beforeLabel="실 프로젝트 수"
                                    afterLabel="개+"
                                    inputMode="numeric"
                                    {...register('totalProjects')}
                                    error={errors.totalProjects?.message}
                                    className="md:w-50"
                                    inputClassName="text-right"
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <Button
                                id={`${formId}-add`}
                                variant="secondary"
                                size="sm"
                                onClick={hndlProjectAdd}
                                className="items-center px-10"
                            >
                                + 프로젝트 등록
                            </Button>
                        </div>
                        <ol className="flex flex-col gap-3">
                            {fields.map((field, index) => (
                                <ProjectRow
                                    // 줄을 옮겨도 입력 중인 내용이 따라가게, 자리가 아니라 줄에 붙은 id 를 쓴다
                                    key={field.id}
                                    // 요소 id 에는 자리를 쓴다. field.id 는 서버와 브라우저가 따로 만든 난수라
                                    // 그려진 HTML 에 넣으면 둘이 어긋난다
                                    rowId={`${formId}-${index}`}
                                    index={index}
                                    isFirst={index === 0}
                                    isLast={index === fields.length - 1}
                                    options={projects}
                                    onMove={(offset) => {
                                        hndlProjectMove(index, offset);
                                    }}
                                    onRemove={() => {
                                        hndlProjectRemove(index);
                                    }}
                                />
                            ))}
                        </ol>
                    </fieldset>
                    <div className="flex flex-wrap items-center justify-end gap-2 py-5">
                        {experience ? (
                            <div className="mr-auto">
                                <ExperienceDeleteButton
                                    id={experience.id}
                                    company={experience.content.company}
                                    size="lg"
                                    isLeaving
                                />
                            </div>
                        ) : null}
                        <Button asChild variant="ghost" size="lg">
                            <Link href={EXPERIENCE_ROUTE.LIST} className="items-center">
                                취소
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isBlocked}
                            isLoading={isPending}
                            className="items-center px-10"
                        >
                            <Save className="size-4.5" aria-hidden="true" />
                            {isEdit ? '저장' : '등록'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Panel>
    );
}
