import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';
import type { NavHref } from '@/config/nav';
import { SITE } from '@/config/site';

import HeaderBar from './HeaderBar';

interface OwnProps {
    /**
     * 이 페이지의 메뉴. 강조해서 보여 준다.
     * 주소를 읽어 알아내지 않고 페이지가 직접 알려 준다. 주소를 읽으면 /work/[id] 같은 경로를 미리 그려 둘 수 없다
     */
    currentHref: NavHref;
}

export default function Header({ currentHref }: OwnProps) {
    return (
        <HeaderBar
            name={SITE.name}
            currentHref={currentHref}
            action={
                // 연락 섹션은 모든 페이지에 있다(widgets/contact)
                <Button href="#contact" intent="brand" size="md">
                    Contact
                    <Icon name="arrowRight" size={16} strokeWidth={2} />
                </Button>
            }
        />
    );
}
