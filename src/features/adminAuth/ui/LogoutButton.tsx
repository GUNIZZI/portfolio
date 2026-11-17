import { logout } from '@/entities/session/actions/session.actions';
import Button from '@/shared/ui/button/Button';

/** 로그아웃 버튼. 세션을 지우고 로그인 화면으로 간다 */
export default function LogoutButton() {
    return (
        <form action={logout}>
            <Button type="submit" intent="outline" size="md" effect="none" className="items-center">
                로그아웃
            </Button>
        </form>
    );
}
