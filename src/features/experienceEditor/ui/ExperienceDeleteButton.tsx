'use client';

import { type ComponentProps, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Trash2 } from 'lucide-react';

import { deleteExperienceAction } from '@/entities/experience/actions/experience.actions';
import { EXPERIENCE_SAVE_STATUS } from '@/entities/experience/model/experience.types';
import { useConfirmDialog } from '@/shared/ui/alertDialog/ConfirmDialogProvider';
import { Button } from '@/shared/ui/button/button';
import { useToast } from '@/shared/ui/toast/ToastProvider';

import { EDITOR_MESSAGE, EXPERIENCE_ROUTE } from '../model/experienceEditor.constants';

interface OwnProps {
    id: string;
    /** 지울 회사의 이름. 확인 창과 버튼의 이름에 넣는다 */
    company: string;
    size: ComponentProps<typeof Button>['size'];
    /** 지운 뒤 경력 목록으로 가는가. 수정 화면에서 켠다. 목록에서는 그 자리에 머문다 */
    isLeaving?: boolean;
}

/**
 * 경력 삭제 버튼. 누르면 확인 창(P-01)을 띄운다. 확인 창은 처음 포커스를 취소에 두고, 닫으면 이 버튼으로 돌려준다.
 * 회사와 그 안의 프로젝트 목록을 함께 지운다. 이어 둔 프로젝트는 지우지 않는다.
 */
export default function ExperienceDeleteButton({ id, company, size, isLeaving = false }: OwnProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const toast = useToast();
    const { addConfirmDialog } = useConfirmDialog();

    function hndlDelete() {
        startTransition(async () => {
            const status = await deleteExperienceAction(id);
            if (status === EXPERIENCE_SAVE_STATUS.FAILED) {
                toast.error(EDITOR_MESSAGE.DELETE_FAILED);
                return;
            }
            // 이미 지워진 경력이어도 목록에서는 없어져야 한다. 화면을 지금 상태로 맞춘다
            if (status === EXPERIENCE_SAVE_STATUS.SAVED) {
                toast.success(EDITOR_MESSAGE.DELETED);
            } else {
                toast.warning(EDITOR_MESSAGE.NOT_FOUND);
            }
            if (isLeaving) {
                router.push(EXPERIENCE_ROUTE.LIST);
            } else {
                router.refresh();
            }
        });
    }

    function hndlAsk() {
        addConfirmDialog({
            variant: 'delete',
            title: '경력을 삭제할까요?',
            description: `「${company}」 과 그 안의 프로젝트 목록을 지웁니다. 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            onConfirm: hndlDelete,
        });
    }

    return (
        <Button
            variant="destructive"
            size={size}
            aria-label={`${company} 삭제`}
            isLoading={isPending}
            className="items-center"
            onClick={hndlAsk}
        >
            {/* 크기는 버튼의 size 를 따른다 */}
            <Trash2 aria-hidden="true" />
        </Button>
    );
}
