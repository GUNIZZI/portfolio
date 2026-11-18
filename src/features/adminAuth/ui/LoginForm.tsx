'use client';

import { type ChangeEvent, useActionState, useEffect, useRef, useState } from 'react';

import { login } from '@/entities/session/actions/session.actions';
import { LOGIN_STATUS, type LoginStateData } from '@/entities/session/model/session.types';
import { Button } from '@/shared/ui/button/button';
import { Input } from '@/shared/ui/input/input';

import { LOGIN_NOTICE } from '../model/adminAuth.constants';

const INITIAL_STATE: LoginStateData = { status: LOGIN_STATUS.IDLE };

/** 이메일 · 비밀번호 로그인 폼. 2개를 모두 입력해야 버튼을 누를 수 있다 */
export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, INITIAL_STATE);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // 화면의 스크립트가 준비되기 전에 들어간 값은 onChange 를 거치지 않는다.
    // 준비된 직후 입력칸의 값을 한 번 읽어 맞춘다. 맞추지 않으면 값이 보이는데도 버튼이 꺼져 있다
    useEffect(() => {
        setEmail(emailRef.current?.value ?? '');
        setPassword(passwordRef.current?.value ?? '');
    }, []);

    const notice = state.status === LOGIN_STATUS.IDLE ? null : LOGIN_NOTICE[state.status];
    const isFilled = email.trim() !== '' && password !== '';

    function hndlEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function hndlPasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    return (
        <form action={formAction} className="flex flex-col gap-2">
            <Input
                ref={emailRef}
                name="email"
                type="email"
                size="md"
                autoComplete="username"
                value={email}
                onChange={hndlEmailChange}
                placeholder="이메일"
            />
            <Input
                ref={passwordRef}
                name="password"
                type="password"
                size="md"
                autoComplete="current-password"
                value={password}
                onChange={hndlPasswordChange}
                placeholder="비밀번호"
            />
            <Button
                type="submit"
                size="lg"
                effect="none"
                disabled={!isFilled || isPending}
                className="mt-3 justify-center"
            >
                {isPending ? '로그인하는 중' : '로그인'}
            </Button>
            {/* 문구가 없을 때도 요소를 둔다. 나중에 생긴 role="status" 는 스크린 리더가 읽지 않는다 */}
            <div role="status">
                {notice && !isPending ? (
                    <div className="rounded-card border border-border-card bg-card px-4 py-3">
                        <p className="text-body font-semibold text-strong">{notice.title}</p>
                        <p className="mt-1 text-caption text-muted-foreground">
                            {notice.description}
                        </p>
                    </div>
                ) : null}
            </div>
        </form>
    );
}
