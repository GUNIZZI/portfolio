import { expect, test } from '@playwright/test';

test('홈이 열리고 본문 랜드마크가 있다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
});

test('히어로 제목을 이름으로 읽는다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'GUNI' })).toBeVisible();
});

test('섹션 제목이 모두 있다', async ({ page }) => {
    await page.goto('/');
    for (const name of ['FEATURED PROJECTS', 'MY SKILLS', 'ABOUT ME', 'Get in Touch!']) {
        await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
});

test('연락 버튼이 메일 주소로 연결되고, 마우스를 올리면 주소를 보여 준다', async ({
    page,
    isMobile,
}) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Get in Touch' })).toBeVisible();
    // 마우스를 올리면 링크의 이름이 주소로 바뀌므로 이름이 아닌 위치로 찾는다
    const button = page.locator('#contact a');
    await expect(button).toHaveAttribute('href', 'mailto:h2dlhs@naver.com');
    await expect(button.getByText('h2dlhs@naver.com')).toBeHidden();

    // 터치 화면에는 마우스 오버가 없어 문구가 바뀌지 않는다
    if (isMobile) return;
    await button.hover();
    await expect(button.getByText('h2dlhs@naver.com')).toBeVisible();
    await expect(button.getByText('Get in Touch')).toBeHidden();
});
