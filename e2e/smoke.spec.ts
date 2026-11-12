import { expect, type Page, test } from '@playwright/test';

/**
 * 부드러운 스크롤이 멈출 때까지 기다린다.
 * 스크롤 도중에 다른 요소를 누르면 Playwright 가 스크롤을 멈춰 세워 섹션이 제자리에 닿지 못한다.
 */
async function waitForScrollEnd(page: Page) {
    await page.evaluate(
        () =>
            new Promise<void>((resolve) => {
                let last = window.scrollY;
                let stillFrames = 0;
                const tick = () => {
                    stillFrames = window.scrollY === last ? stillFrames + 1 : 0;
                    last = window.scrollY;
                    if (stillFrames > 10) resolve();
                    else requestAnimationFrame(tick);
                };
                tick();
            }),
    );
}

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

test('메뉴로 섹션에 가면 헤더가 화면 위에 붙고 그 메뉴를 강조한다', async ({ page, isMobile }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: '주 메뉴' });
    // 좁은 화면에서는 메뉴가 패널 안에 있어 버튼으로 먼저 연다
    const openMenu = async () => {
        if (isMobile) await page.getByRole('button', { name: '메뉴 열기' }).click();
    };

    await openMenu();
    await expect(menu.getByRole('link', { name: 'Home' })).toHaveAttribute(
        'aria-current',
        'location',
    );

    await menu.getByRole('link', { name: 'Projects' }).click();
    await expect(
        page.getByRole('heading', { level: 2, name: 'FEATURED PROJECTS' }),
    ).toBeInViewport();
    await expect(page.getByRole('banner')).toBeInViewport();
    await openMenu();
    await expect(menu.getByRole('link', { name: 'Projects' })).toHaveAttribute(
        'aria-current',
        'location',
    );
    await expect(menu.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    await expect(page.getByRole('banner')).toBeInViewport();
    await expect(
        page.getByRole('heading', { level: 2, name: 'FEATURED PROJECTS' }),
    ).toBeInViewport();
});

test('소개 숫자가 최종 값으로 끝난다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { level: 2, name: 'ABOUT ME' }).scrollIntoViewIfNeeded();
    for (const value of ['40+', '20+', '7+']) {
        await expect(page.locator('#about').getByText(value, { exact: true }).last()).toBeVisible();
    }
});

test('좁은 화면에서 메뉴 버튼으로 패널을 열고, 항목을 누르거나 Esc 로 닫는다', async ({
    page,
    isMobile,
}) => {
    test.skip(!isMobile, '햄버거 메뉴는 768px 미만에만 있다');
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: '주 메뉴' });
    const openButton = page.getByRole('button', { name: '메뉴 열기' });
    await expect(menu).toBeHidden();

    await openButton.click();
    await expect(menu.getByRole('link', { name: 'Contact' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(openButton).toBeFocused();

    await openButton.click();
    await menu.getByRole('link', { name: 'About' }).click();
    await expect(menu).toBeHidden();
    await expect(page.getByRole('heading', { level: 2, name: 'ABOUT ME' })).toBeInViewport();
});

test('메뉴로 간 섹션이 짧아도 그 메뉴를 강조한다', async ({ page, isMobile }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: '주 메뉴' });

    for (const [name, heading] of [
        ['Skills', 'MY SKILLS'],
        ['About', 'ABOUT ME'],
        ['Projects', 'FEATURED PROJECTS'],
    ] as const) {
        // 좁은 화면에서는 메뉴가 패널 안에 있어 버튼으로 먼저 연다
        if (isMobile) await page.getByRole('button', { name: '메뉴 열기' }).click();
        await menu.getByRole('link', { name }).click();
        await expect(page.getByRole('heading', { level: 2, name: heading })).toBeInViewport();
        await waitForScrollEnd(page);

        if (isMobile) await page.getByRole('button', { name: '메뉴 열기' }).click();
        await expect(menu.getByRole('link', { name })).toHaveAttribute('aria-current', 'location');
        if (isMobile) await page.keyboard.press('Escape');
    }
});
