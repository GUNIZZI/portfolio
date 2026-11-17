import { SquareArrowRightExit } from 'lucide-react';

import { logout } from '@/entities/session/actions/session.actions';

/** 로그아웃 버튼. 세션을 지우고 로그인 화면으로 간다 */
export default function LogoutButton() {
    return (
        <form action={logout} className="flex items-center">
            <button
                type="submit"
                className="text-sm text-muted-foreground hover:text-strong"
                title="로그아웃"
            >
                <SquareArrowRightExit className="size-4" />
            </button>
        </form>
    );
}
