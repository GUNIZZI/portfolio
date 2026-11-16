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
    /** Contact 버튼이 가는 곳. 연락 섹션이 없는 페이지에서는 홈의 연락 섹션(/#contact)을 준다 */
    contactHref?: string;
}

export default function Header({ currentHref, contactHref = '#contact' }: OwnProps) {
    return (
        <HeaderBar
            name={SITE.name}
            currentHref={currentHref}
            action={
                <Button href={contactHref} intent="brand" size="md">
                    Contact
                    <Icon name="arrowRight" size={16} strokeWidth={2} />
                </Button>
            }
        />
    );
}
