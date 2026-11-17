'use client';

import { type ChangeEvent, useActionState, useState } from 'react';

import { login } from '@/entities/session/actions/session.actions';
import { LOGIN_STATUS, type LoginStateData } from '@/entities/session/model/session.types';
import Button from '@/shared/ui/button/Button';
import Input from '@/shared/ui/input/Input';

import { LOGIN_NOTICE } from '../model/adminAuth.constants';

const INITIAL_STATE: LoginStateData = { status: LOGIN_STATUS.IDLE };

/** 이메일 · 비밀번호 로그인 폼. 2개를 모두 입력해야 버튼을 누를 수 있다 */
export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, INITIAL_STATE);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const notice = state.status === LOGIN_STATUS.IDLE ? null : LOGIN_NOTICE[state.status];
    const isFilled = email.trim() !== '' && password !== '';

    function hndlEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function hndlPasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    return (
        <form action={formAction} className="flex flex-col gap-5">
            <Input
                label="이메일"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={hndlEmailChange}
            />
            <Input
                label="비밀번호"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={hndlPasswordChange}
            />
            <Button
                type="submit"
                effect="none"
                disabled={!isFilled || isPending}
                className="justify-center"
            >
                {isPending ? '로그인하는 중' : '로그인'}
            </Button>
            {/* 문구가 없을 때도 요소를 둔다. 나중에 생긴 role="status" 는 스크린 리더가 읽지 않는다 */}
            <div role="status">
                {notice && !isPending ? (
                    <div className="rounded-card border border-border-card bg-card px-4 py-3">
                        <p className="text-body font-semibold text-strong">{notice.title}</p>
                        <p className="mt-1 text-caption text-muted">{notice.description}</p>
                    </div>
                ) : null}
            </div>
        </form>
    );
}
