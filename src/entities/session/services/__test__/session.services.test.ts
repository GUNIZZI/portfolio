import type { SessionRepository } from '../../repositories/session.repositories';
import { createAdminSession, verifyAdminSession } from '../session.services';

const repository = vi.hoisted(() => ({
    signIn: vi.fn<SessionRepository['signIn']>(),
    createSessionCookie: vi.fn<SessionRepository['createSessionCookie']>(),
    verifySessionCookie: vi.fn<SessionRepository['verifySessionCookie']>(),
}));

vi.mock('@/shared/util/serverEnv', () => ({
    getServerEnv: () => ({ ADMIN_UID: 'admin-uid' }),
}));

vi.mock('../../repositories/session.repositories', () => ({ sessionRepository: repository }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe('createAdminSession', () => {
    it('관리자 계정이면 세션 쿠키 값을 만든다', async () => {
        repository.signIn.mockResolvedValue({ uid: 'admin-uid', idToken: 'token' });
        repository.createSessionCookie.mockResolvedValue('cookie');

        await expect(createAdminSession('a@example.com', 'pw')).resolves.toBe('cookie');
        expect(repository.createSessionCookie).toHaveBeenCalledWith('token');
    });

    it('계정이나 비밀번호가 틀리면 세션을 만들지 않는다', async () => {
        repository.signIn.mockResolvedValue(null);

        await expect(createAdminSession('a@example.com', 'pw')).resolves.toBeNull();
        expect(repository.createSessionCookie).not.toHaveBeenCalled();
    });

    it('Firebase Auth 에 있는 계정이어도 관리자가 아니면 세션을 만들지 않는다', async () => {
        repository.signIn.mockResolvedValue({ uid: 'someone-else', idToken: 'token' });

        await expect(createAdminSession('b@example.com', 'pw')).resolves.toBeNull();
        expect(repository.createSessionCookie).not.toHaveBeenCalled();
    });
});

describe('verifyAdminSession', () => {
    it('쿠키가 없으면 검증하지 않고 세션이 없다고 본다', async () => {
        await expect(verifyAdminSession(undefined)).resolves.toBeNull();
        expect(repository.verifySessionCookie).not.toHaveBeenCalled();
    });

    it('검증에 실패하면 세션이 없다고 본다', async () => {
        repository.verifySessionCookie.mockResolvedValue(null);

        await expect(verifyAdminSession('cookie')).resolves.toBeNull();
    });

    it('관리자가 아닌 계정의 쿠키는 받지 않는다', async () => {
        repository.verifySessionCookie.mockResolvedValue({ uid: 'someone-else' });

        await expect(verifyAdminSession('cookie')).resolves.toBeNull();
    });

    it('관리자의 쿠키면 세션을 돌려준다', async () => {
        repository.verifySessionCookie.mockResolvedValue({ uid: 'admin-uid' });

        await expect(verifyAdminSession('cookie')).resolves.toEqual({ uid: 'admin-uid' });
    });
});
