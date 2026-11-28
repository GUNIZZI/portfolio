import { expect, test } from '@playwright/test';

test('로그인하지 않고 관리 화면에 들어가면 로그인 화면으로 간다', async ({ page }) => {
    for (const path of [
        '/admin',
        '/admin/dashboard',
        '/admin/projects',
        '/admin/projects/new',
        '/admin/projects/1',
        '/admin/about',
        '/admin/experiences',
        '/admin/experiences/new',
        '/admin/experiences/1',
        '/admin/colophon',
    ]) {
        await page.goto(path);
        await expect(page).toHaveURL(/\/admin\/login$/);
        await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
    }
});

test('세션 쿠키가 가짜면 관리 화면을 그리지 않고 로그인 화면으로 보낸다', async ({
    page,
    context,
    baseURL,
}) => {
    await context.addCookies([{ name: 'admin_session', value: 'fake', url: baseURL ?? '' }]);
    for (const path of ['/admin', '/admin/dashboard']) {
        await page.goto(path);
        await expect(page).toHaveURL(/\/admin\/login$/);
        await expect(page.getByRole('heading', { level: 1, name: '대시보드' })).toBeHidden();
        await expect(page.getByRole('navigation', { name: '관리 메뉴' })).toBeHidden();
    }
});

test('로그인하지 않으면 썸네일을 올릴 권한을 받지 못한다', async ({
    request,
    context,
    baseURL,
}) => {
    const body = {
        type: 'blob.generate-client-token',
        payload: { pathname: 'projects/a.png', multipart: false, clientPayload: null },
    };

    // 쿠키가 없으면 로그인 화면으로 보낸다. 토큰을 내주지 않는다
    const withoutCookie = await request.post('/admin/api/project-images', {
        data: body,
        maxRedirects: 0,
    });
    expect(withoutCookie.status()).toBe(307);
    expect(withoutCookie.headers()['location']).toMatch(/\/admin\/login$/);

    // 쿠키가 가짜면 401 로 알린다
    await context.addCookies([{ name: 'admin_session', value: 'fake', url: baseURL ?? '' }]);
    const withFakeCookie = await context.request.post('/admin/api/project-images', {
        data: body,
        maxRedirects: 0,
    });
    expect(withFakeCookie.status()).toBe(401);
});

test('이메일과 비밀번호를 모두 입력해야 로그인 버튼을 누를 수 있다', async ({ page }) => {
    await page.goto('/admin/login');
    const button = page.getByRole('button', { name: '로그인' });
    await expect(button).toBeDisabled();

    await page.getByPlaceholder('이메일').fill('admin@example.com');
    await expect(button).toBeDisabled();

    await page.getByPlaceholder('비밀번호').fill('password');
    await expect(button).toBeEnabled();
});

test('로그인 화면에서 사이트로 돌아갈 수 있다', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByRole('link', { name: '사이트로 돌아가기' }).click();
    await expect(page).toHaveURL(/\/$/);
});
