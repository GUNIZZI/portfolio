import Button from '@/shared/ui/button/Button';
import Icon from '@/shared/ui/icon/Icon';
import Logo from '@/shared/ui/logo/Logo';
import { SITE } from '@/config/site';

import HeaderBar from './HeaderBar';

export default function Header() {
    return (
        <HeaderBar
            logo={<Logo name={SITE.name} role={SITE.role} />}
            action={
                <Button href="#contact" intent="brand" size="md">
                    Contact
                    <Icon name="arrowRight" size={16} strokeWidth={2} />
                </Button>
            }
        />
    );
}
