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
