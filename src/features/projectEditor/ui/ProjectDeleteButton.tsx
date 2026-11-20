'use client';

import { type ComponentProps, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Trash2 } from 'lucide-react';

import { deleteProjectAction } from '@/entities/project/actions/project.actions';
import { PROJECT_SAVE_STATUS } from '@/entities/project/model/project.types';
import { useConfirmDialog } from '@/shared/ui/alertDialog/ConfirmDialogProvider';
import { Button } from '@/shared/ui/button/button';
import { useToast } from '@/shared/ui/toast/ToastProvider';
import { cn } from '@/shared/util/cn';

import { EDITOR_MESSAGE, PROJECT_ROUTE } from '../model/projectEditor.constants';

interface OwnProps {
    id: string;
    /** 지울 프로젝트의 제목. 확인 창과 버튼의 이름에 넣는다 */
    title: string;
    size: ComponentProps<typeof Button>['size'];
    /** 지운 뒤 프로젝트 목록으로 가는가. 수정 화면에서 켠다. 목록에서는 그 자리에 머문다 */
    isLeaving?: boolean;
    /** 버튼에 붙는다. 쓰는 곳마다 모양이 달라 여기서 정한다. 목록의 칸에서는 폭을 좁혀 아이콘만 한 네모로 그린다 */
    className?: string;
}

/**
 * 프로젝트 삭제 버튼. 누르면 확인 창(P-01)을 띄운다. 확인 창은 처음 포커스를 취소에 두고, 닫으면 이 버튼으로 돌려준다.
 * 프로젝트 문서와 썸네일 파일을 함께 지운다.
 */
export default function ProjectDeleteButton({
    id,
    title,
    size,
    isLeaving = false,
    className,
}: OwnProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const toast = useToast();
    const { addConfirmDialog } = useConfirmDialog();

    function hndlDelete() {
        startTransition(async () => {
            const status = await deleteProjectAction(id);
            if (status === PROJECT_SAVE_STATUS.FAILED || status === PROJECT_SAVE_STATUS.INVALID) {
                toast.error(EDITOR_MESSAGE.FAILED);
                return;
            }
            // 이미 지워진 프로젝트여도 목록에서는 없어져야 한다. 화면을 지금 상태로 맞춘다
            if (status === PROJECT_SAVE_STATUS.SAVED) {
                toast.success(EDITOR_MESSAGE.DELETED);
            } else {
                toast.warning(EDITOR_MESSAGE.NOT_FOUND);
            }
            if (isLeaving) {
                router.push(PROJECT_ROUTE.LIST);
            } else {
                router.refresh();
            }
        });
    }

    function hndlAsk() {
        addConfirmDialog({
            variant: 'delete',
            title: '프로젝트를 삭제할까요?',
            description: `「${title}」 과 썸네일을 지웁니다. 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            onConfirm: hndlDelete,
        });
    }

    return (
        <Button
            variant="destructive"
            size={size}
            aria-label={`${title} 삭제`}
            isLoading={isPending}
            className={cn('items-center', className)}
            onClick={hndlAsk}
        >
            {/* 크기는 버튼의 size 를 따른다 */}
            <Trash2 aria-hidden="true" />
        </Button>
    );
}
