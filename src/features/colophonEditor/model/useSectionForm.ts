'use client';

import { type SyntheticEvent, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { type DefaultValues, type Resolver, useForm, type UseFormReturn } from 'react-hook-form';

import { saveColophonSectionAction } from '@/entities/colophon/actions/colophon.actions';
import type { ColophonSection } from '@/entities/colophon/model/colophon.constants';
import { COLOPHON_SECTION_SCHEMAS } from '@/entities/colophon/model/colophon.schemas';
import {
    COLOPHON_SAVE_STATUS,
    type ColophonSectionContent,
} from '@/entities/colophon/model/colophon.types';
import { useToast } from '@/shared/ui/toast/ToastProvider';
import { withObjectParticle } from '@/shared/util/josa';

import { EDITOR_MESSAGE, SECTION_LABEL } from './colophonEditor.constants';

interface SectionForm<Content extends object> {
    /** react-hook-form 의 폼. 값 · 오류 문구 · 입력 잇기를 여기서 꺼낸다 */
    form: UseFormReturn<Content>;
    /** 저장 버튼을 누를 수 없는가. 고친 내용이 없거나 규칙에 맞지 않을 때다 */
    isBlocked: boolean;
    isPending: boolean;
    /** 폼의 onSubmit 에 건다. 스키마를 통과했을 때만 저장한다 */
    hndlSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

/**
 * 섹션 폼 하나의 상태. react-hook-form 으로 값을 갖고, 검증과 오류 문구는 섹션의 zod 스키마가 낸다.
 * (docs/architecture.md 4.3절)
 * 고친 내용이 있고 규칙에 맞을 때만 저장할 수 있다.
 * 저장하면 그 값을 새 기준으로 삼아, 다시 고치기 전까지 저장 버튼을 비활성으로 둔다.
 * 소개 관리의 같은 이름 훅과 하는 일이 같다. 부르는 서버 액션과 스키마만 다르다.(src/features/aboutEditor/model/useSectionForm.ts)
 */
export function useSectionForm<Section extends ColophonSection>(
    section: Section,
    initial: ColophonSectionContent[Section],
): SectionForm<ColophonSectionContent[Section]> {
    type Content = ColophonSectionContent[Section];

    const form = useForm<Content>({
        // 섹션마다 스키마가 달라 타입이 하나로 좁혀지지 않는다. 섹션과 내용의 짝은 ColophonSectionContent 가 맞춘다
        resolver: zodResolver(COLOPHON_SECTION_SCHEMAS[section]) as unknown as Resolver<Content>,
        // 고칠 때마다, 그리고 포커스가 나갈 때 그 항목을 검증한다
        mode: 'all',
        // 처음 값의 타입이 섹션에 따라 달라, react-hook-form 이 요구하는 모양으로 좁혀지지 않는다
        defaultValues: initial as DefaultValues<Content>,
    });
    const [isPending, startTransition] = useTransition();
    const toast = useToast();
    const { isDirty, isValid } = form.formState;

    const hndlValid = (content: Content) => {
        if (isPending) return;

        startTransition(async () => {
            const status = await saveColophonSectionAction(section, content);
            if (status === COLOPHON_SAVE_STATUS.SAVED) {
                // 저장한 값을 새 기준으로 삼는다
                form.reset(content);
                toast.success(`${withObjectParticle(SECTION_LABEL[section])} 저장했습니다`);
                return;
            }
            toast.error(EDITOR_MESSAGE.SAVE_FAILED);
        });
    };

    function hndlSubmit(event: SyntheticEvent<HTMLFormElement>) {
        void form.handleSubmit(hndlValid)(event);
    }

    return { form, isBlocked: !isDirty || !isValid, isPending, hndlSubmit };
}
