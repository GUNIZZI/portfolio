import { Button } from '@/shared/ui/button/button';
import { SITE } from '@/config/site';

import HeaderBar from './HeaderBar';

/**
 * 공개 화면의 헤더. 레이아웃이 한 번 그리고, 페이지를 옮겨도 그대로 남는다.(src/app/(site)/layout.tsx)
 * 지금 메뉴는 HeaderBar 가 주소에서 읽는다
 */
export default function Header() {
    return (
        <HeaderBar
            name={SITE.name}
            action={
                // 연락 섹션은 모든 페이지에 있다(widgets/contact)
                <Button asChild variant="brand" size="md" effect="sweep" arrow="end">
                    <a href="#contact">Contact</a>
                </Button>
            }
        />
    );
}
