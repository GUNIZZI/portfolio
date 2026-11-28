import Link from 'next/link';

import { RotateCw } from 'lucide-react';

import { Button } from '@/shared/ui/button/button';

import { ERROR_DOODLES } from '../model/statusScreen.constants';
import StatusScreen from './StatusScreen';
import StatusVisual from './StatusVisual';

interface OwnProps {
    /** 다시 시도. 에러가 난 구간을 다시 불러와 그린다 */
    onRetry: () => void;
}

/**
 * 페이지를 그리다 에러가 났을 때 보이는 화면. 404 화면과 같은 틀을 쓴다.(2026-11-20 사용자 결정)
 * 에러 경계(`error.tsx`) 안에서 그려져 클라이언트에서 돈다
 */
export default function ServerError({ onRetry }: OwnProps) {
    return (
        <StatusScreen
            code="500"
            title="Something Broke"
            description="페이지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
            actions={
                <>
                    <Button asChild variant="outline" effect="sweep" arrow="start">
                        <Link href="/">Back to Home</Link>
                    </Button>
                    <Button effect="sweep" icon={<RotateCw aria-hidden="true" />} onClick={onRetry}>
                        Try Again
                    </Button>
                </>
            }
            visual={
                <StatusVisual
                    src="/images/characters/error.png"
                    alt="깨진 브라우저 창을 들고 머리를 긁적이며 갸웃하는 안경 쓴 개발자 캐릭터 일러스트"
                    className="aspect-549/494 max-w-130"
                    sizes="(max-width: 920px) 100vw, 520px"
                    doodles={ERROR_DOODLES}
                />
            }
        />
    );
}
