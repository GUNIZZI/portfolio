import Link from 'next/link';

import { Button } from '@/shared/ui/button/button';

import { NOT_FOUND_DOODLES } from '../model/statusScreen.constants';
import StatusScreen from './StatusScreen';
import StatusVisual from './StatusVisual';

/** 없는 주소에서 보이는 화면 */
export default function NotFound() {
    return (
        <StatusScreen
            code="404"
            title="Page Not Found"
            description="요청하신 페이지를 찾을 수 없어요."
            actions={
                <Button asChild effect="sweep" arrow="start">
                    <Link href="/">Back to Home</Link>
                </Button>
            }
            visual={
                <StatusVisual
                    src="/images/characters/notfound.png"
                    alt="깨진 브라우저 창을 띄워 놓고 어깨를 으쓱하며 윙크하는 안경 쓴 개발자 캐릭터 일러스트"
                    className="aspect-691/461 max-w-170"
                    sizes="(max-width: 920px) 100vw, 680px"
                    doodles={NOT_FOUND_DOODLES}
                />
            }
        />
    );
}
