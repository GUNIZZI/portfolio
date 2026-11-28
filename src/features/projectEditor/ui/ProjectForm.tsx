'use client';

import { useId, useLayoutEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import {
    createProjectAction,
    discardProjectImageAction,
    updateProjectAction,
} from '@/entities/project/actions/project.actions';
import { PROJECT_CATEGORIES, PROJECT_IMAGE } from '@/entities/project/model/project.constants';
import type { ProjectContentType } from '@/entities/project/model/project.schemas';
import {
    PROJECT_SAVE_STATUS,
    type ProjectEditorData,
} from '@/entities/project/model/project.types';
import { Button } from '@/shared/ui/button/button';
import { Field, FieldError } from '@/shared/ui/field/field';
import Panel from '@/shared/ui/panel/Panel';
import { Select } from '@/shared/ui/select/select';
import { Separator } from '@/shared/ui/separator/separator';
import { Switch } from '@/shared/ui/switch/switch';
import TextField from '@/shared/ui/textField/TextField';
import TiptapEditor from '@/shared/ui/tiptapEditor/TiptapEditor';
import { useToast } from '@/shared/ui/toast/ToastProvider';

import { EDITOR_MESSAGE, PROJECT_ROUTE } from '../model/projectEditor.constants';
import { ProjectFormSchema } from '../model/projectEditor.schemas';
import type { ProjectFormValue } from '../model/projectEditor.types';
import { toFormValue } from '../model/projectEditor.utils';
import { useImageUpload } from '../model/useImageUpload';
import DetailFields from './DetailFields';
import ProjectDeleteButton from './ProjectDeleteButton';
import ThumbnailField from './ThumbnailField';

/** 분류 셀렉트의 항목. 정해 둔 분류다 */
const CATEGORY_LIST = PROJECT_CATEGORIES.map((category) => ({
    code: category,
    name: category,
}));

interface OwnProps {
    /** 고칠 프로젝트. 등록 화면이면 null */
    project: ProjectEditorData | null;
}

/**
 * 프로젝트 등록(S-02) · 수정(S-03) 폼.
 * 저장된 내용이 바뀌면 폼을 새로 만든다. 저장하고 돌아왔을 때 저장하기 전의 값을 기준으로 삼지 않게 한다.
 */
export default function ProjectForm({ project }: OwnProps) {
    return <ProjectFormBody key={JSON.stringify(project)} project={project} />;
}

/**
 * 폼의 본체. react-hook-form 으로 값을 갖고, 검증과 오류 문구는 zod 스키마가 낸다.(docs/architecture.md 4.3절)
 * 규칙에 맞을 때만 저장할 수 있고, 수정 화면에서는 고친 내용도 있어야 한다.
 * 저장하면 프로젝트 목록으로 돌아가 토스트를 띄운다. 취소하거나 나가도 묻지 않고, 고친 내용은 남기지 않는다.
 */
function ProjectFormBody({ project }: OwnProps) {
    const [initial] = useState(() => toFormValue(project?.content ?? null));
    const form = useForm<ProjectFormValue, unknown, ProjectContentType>({
        resolver: zodResolver(ProjectFormSchema),
        // 고칠 때마다, 그리고 포커스가 나갈 때 그 항목을 검증한다. 빈 필수 항목은 지나간 뒤에 알린다
        mode: 'all',
        defaultValues: initial,
    });
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isValid, isDirty },
    } = form;
    const image = useWatch({ control, name: 'image' });
    const isPublished = useWatch({ control, name: 'published' });
    const { isUploading, error: uploadError, uploadImage, clearError } = useImageUpload();
    /** 본문에 넣는 이미지. 썸네일과 따로 올리고 오류도 따로 보여 준다 */
    const bodyUpload = useImageUpload();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const toast = useToast();
    const formId = useId();
    /** 이 화면에서 올리고 아직 저장하지 않은 썸네일의 주소. 쓰지 않게 되면 저장소에서 지운다 */
    const pendingImageRef = useRef<string | null>(null);

    /** 올려 두고 쓰지 않게 된 썸네일 파일을 지운다. 지우지 못해도 화면은 막지 않는다 */
    function discardPendingImage() {
        const src = pendingImageRef.current;
        if (!src) return;
        pendingImageRef.current = null;
        void discardProjectImageAction(src);
    }

    // 화면을 떠나면 처음 값으로 되돌리고, 저장하지 않은 썸네일을 지운다.
    // Next 는 떠난 화면을 지우지 않고 숨겨 두어, 그대로 두면 다시 왔을 때 입력이 남아 있다.
    // (node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md 「Forms, inputs, and state」)
    useLayoutEffect(
        () => () => {
            const src = pendingImageRef.current;
            pendingImageRef.current = null;
            if (src) void discardProjectImageAction(src);
            reset(initial);
        },
        [reset, initial],
    );

    const isEdit = project !== null;
    const isBlocked = (isEdit && !isDirty) || !isValid || isUploading || bodyUpload.isUploading;

    async function hndlImageSelect(file: File) {
        const uploaded = await uploadImage(file);
        if (!uploaded) return;

        // 앞서 올린 파일은 이제 쓰지 않는다
        discardPendingImage();
        pendingImageRef.current = uploaded.src;
        // 적어 둔 대체 텍스트는 남긴다. 처음 올린 것이면 비어 있다
        const alt = getValues('image')?.alt ?? '';
        setValue('image', { ...uploaded, alt }, { shouldDirty: true, shouldValidate: true });
    }

    function hndlImageRemove() {
        discardPendingImage();
        clearError();
        setValue('image', null, { shouldDirty: true, shouldValidate: true });
    }

    function hndlPublishedChange(checked: boolean) {
        setValue('published', checked, { shouldDirty: true, shouldValidate: true });
        // 비공개로 바꾸면 홈에서도 숨긴다.(docs/plan/admin/README.md 「홈 노출」)
        if (!checked) {
            setValue('featured', false, { shouldDirty: true, shouldValidate: true });
        }
    }

    /** 스키마를 통과한 내용을 받는다 */
    function hndlValid(content: ProjectContentType) {
        if (isBlocked || isPending) return;

        startTransition(async () => {
            const status = project
                ? await updateProjectAction(project.id, content)
                : await createProjectAction(content);

            if (status === PROJECT_SAVE_STATUS.SAVED) {
                // 저장한 썸네일은 이제 프로젝트의 것이다. 떠날 때 지우지 않는다
                pendingImageRef.current = null;
                toast.success(isEdit ? EDITOR_MESSAGE.SAVED : EDITOR_MESSAGE.CREATED);
                router.push(PROJECT_ROUTE.LIST);
                return;
            }
            toast.error(
                status === PROJECT_SAVE_STATUS.NOT_FOUND
                    ? EDITOR_MESSAGE.NOT_FOUND
                    : EDITOR_MESSAGE.FAILED,
            );
        });
    }

    return (
        <Panel className="p-6">
            <FormProvider {...form}>
                <form
                    aria-label={isEdit ? '프로젝트 수정' : '프로젝트 등록'}
                    onSubmit={(event) => {
                        void handleSubmit(hndlValid)(event);
                    }}
                    className="flex flex-col gap-8"
                >
                    <div className="flex flex-col gap-1">
                        {/* 수정 일시의 모양은 소개 · 경력 수정과 같다.(src/features/aboutEditor/ui/SectionShell.tsx) */}
                        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-3">
                            <h2 className="text-2xl font-bold text-strong">기본 정보</h2>
                            {/* 공개 여부와 홈 표시 설정은 제목 줄의 오른쪽 끝에 둔다. 긴 폼을 내려가지 않고 바꾼다.(2026-11-20 사용자 결정) */}
                            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
                                {project?.updatedAtText ? (
                                    <span className="text-xs text-muted-foreground">
                                        마지막 수정 {project.updatedAtText}
                                    </span>
                                ) : null}
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor={`${formId}-published`}
                                        className="cursor-pointer text-caption font-medium text-muted-foreground"
                                    >
                                        공개
                                    </label>
                                    <Controller
                                        control={control}
                                        name="published"
                                        render={({ field }) => (
                                            <Switch
                                                id={`${formId}-published`}
                                                ref={field.ref}
                                                checked={field.value}
                                                onCheckedChange={hndlPublishedChange}
                                                onBlur={field.onBlur}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor={`${formId}-featured`}
                                        className="cursor-pointer text-caption font-medium text-muted-foreground"
                                    >
                                        홈에 표시
                                    </label>
                                    <Controller
                                        control={control}
                                        name="featured"
                                        render={({ field }) => (
                                            <Switch
                                                id={`${formId}-featured`}
                                                ref={field.ref}
                                                // 비공개 프로젝트는 홈에 나오지 않는다
                                                checked={isPublished && field.value}
                                                disabled={!isPublished}
                                                aria-describedby={`${formId}-featured-help`}
                                                onCheckedChange={field.onChange}
                                                onBlur={field.onBlur}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <TextField
                            size="xl"
                            beforeLabel="제목"
                            {...register('title')}
                            error={errors.title?.message}
                        />
                        <div className="flex flex-col gap-1 md:flex-row md:items-start">
                            {/* 정해 둔 분류에서 고른다. 같은 분류를 다른 철자로 적지 않게 한다 */}
                            <Controller
                                control={control}
                                name="category"
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.error ? true : undefined}
                                        className="md:w-72"
                                    >
                                        <Select
                                            aria-label="분류"
                                            beforeLabel="분류"
                                            placeholder="선택"
                                            list={CATEGORY_LIST}
                                            value={field.value}
                                            onChange={field.onChange}
                                            aria-invalid={fieldState.error ? true : undefined}
                                            aria-describedby={`${formId}-category-error`}
                                        />
                                        <FieldError id={`${formId}-category-error`}>
                                            {fieldState.error?.message}
                                        </FieldError>
                                    </Field>
                                )}
                            />
                            <TextField
                                beforeLabel="요약"
                                {...register('summary')}
                                error={errors.summary?.message}
                                className="flex-1"
                            />
                        </div>
                        <TextField
                            beforeLabel="상세 주소"
                            placeholder="비워 두면 프로젝트 상세 페이지로 연결됩니다."
                            {...register('href')}
                            error={errors.href?.message}
                        />
                    </div>
                    <Separator />
                    <fieldset className="flex flex-col gap-1">
                        <legend className="mb-3 text-lg font-semibold">대표 이미지</legend>
                        <ThumbnailField
                            image={image}
                            isUploading={isUploading}
                            error={uploadError}
                            onSelect={(file) => {
                                void hndlImageSelect(file);
                            }}
                            onRemove={hndlImageRemove}
                        />
                        {/* 썸네일이 있을 때만 보이고, 그때는 필수다 */}
                        {image ? (
                            <TextField
                                beforeLabel="대체 텍스트"
                                {...register('image.alt')}
                                error={errors.image?.alt?.message}
                            />
                        ) : null}
                    </fieldset>
                    <Separator />
                    <DetailFields formId={formId} />
                    <Separator />
                    <div className="flex flex-col gap-3">
                        <h3 id={`${formId}-body`} className="text-lg font-semibold">
                            본문
                            <span className="ml-2 text-caption font-normal text-muted-foreground">
                                입력한 내용은 프로젝트 상세 페이지에 표시됩니다.
                            </span>
                        </h3>
                        <Controller
                            control={control}
                            name="body"
                            render={({ field }) => (
                                <TiptapEditor
                                    label="본문"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    onImageUpload={bodyUpload.uploadImage}
                                    imageAccept={PROJECT_IMAGE.CONTENT_TYPES.join(',')}
                                    className="h-100 md:h-150"
                                />
                            )}
                        />
                        <FieldError>{bodyUpload.error}</FieldError>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2 py-5">
                        {project ? (
                            <div className="mr-auto">
                                <ProjectDeleteButton
                                    id={project.id}
                                    title={project.content.title}
                                    size="lg"
                                    isLeaving
                                />
                            </div>
                        ) : null}
                        <Button asChild variant="ghost" size="lg">
                            <Link href={PROJECT_ROUTE.LIST} className="items-center">
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
