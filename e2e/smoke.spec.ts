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

test('메뉴로 페이지를 옮기면 그 페이지의 메뉴를 강조한다', async ({ page, isMobile }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: '주 메뉴' });
    // 좁은 화면에서는 메뉴가 패널 안에 있어 버튼으로 먼저 연다
    const openMenu = async () => {
        if (isMobile) await page.getByRole('button', { name: '메뉴 열기' }).click();
    };

    await openMenu();
    await expect(menu.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');

    for (const [name, url, heading] of [
        ['About', /\/about$/, 'ABOUT ME'],
        ['Projects', /\/project$/, 'ALL PROJECTS'],
    ] as const) {
        await menu.getByRole('link', { name }).click();
        await expect(page).toHaveURL(url);
        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
        await openMenu();
        await expect(menu.getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
        await expect(menu.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    }

    await menu.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'GUNI' })).toBeVisible();
});

test('헤더는 스크롤해도 화면 위에 붙어 있고, 지금 페이지의 메뉴를 누르면 맨 위로 간다', async ({
    page,
    isMobile,
}) => {
    await page.goto('/');
    await page.getByRole('heading', { level: 2, name: 'ABOUT ME' }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('banner')).toBeInViewport();

    if (isMobile) await page.getByRole('button', { name: '메뉴 열기' }).click();
    await page
        .getByRole('navigation', { name: '주 메뉴' })
        .getByRole('link', { name: 'Home' })
        .click();
    await expect(page.getByRole('heading', { level: 1, name: 'GUNI' })).toBeInViewport();
    await expect(page).toHaveURL(/\/(#top)?$/);
});

test('소개 숫자가 0 보다 크다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { level: 2, name: 'ABOUT ME' }).scrollIntoViewIfNeeded();
    // 숫자는 관리 화면에서 바꿀 수 있어 값을 고정하지 않는다. 눈에 보이는 숫자 3개가 0 보다 큰지만 본다
    const numbers = page.locator('#about strong [aria-hidden="true"]');
    await expect(numbers).toHaveCount(3);
    for (const number of await numbers.all()) {
        await expect(number).toHaveText(/^[1-9]\d*/);
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

    // Contact 는 같은 페이지의 연락 섹션으로 간다. 패널이 닫힌 뒤에 이동한다
    await openButton.click();
    await menu.getByRole('link', { name: 'Contact' }).click();
    await expect(menu).toBeHidden();
    await expect(page.getByRole('heading', { level: 2, name: 'Get in Touch!' })).toBeInViewport();
});

test('소개 페이지에 제목과 경력이 있고, 최근 경력만 펼쳐져 있다', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1, name: 'ABOUT ME' })).toBeVisible();
    for (const name of ['EXPERIENCE', 'HOW I WORK', 'SKILLS', 'Get in Touch!']) {
        await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }

    // 2014년 이후에 시작한 회사는 프로젝트가 보이고, 그 이전은 접혀 있다
    await expect(page.getByText('Ris-K(PaaS)')).toBeVisible();
    await expect(page.getByText('LG G2 Micro site')).toBeHidden();

    await page.getByText('프로젝트 27개').click();
    await expect(page.getByText('LG G2 Micro site')).toBeVisible();
});

test('어느 페이지에서든 Contact 를 누르면 그 페이지의 연락 섹션으로 간다', async ({
    page,
    isMobile,
}) => {
    // 작업 상세의 주소는 저장소가 발급한 id 라 고정하지 않는다. 목록의 첫 카드에서 읽는다
    await page.goto('/project');
    const detailPath = await page.getByRole('link', { name: /열기$/ }).first().getAttribute('href');
    expect(detailPath).toMatch(/^\/project\/[^/]+$/);

    for (const path of ['/', '/about', '/project', detailPath ?? '']) {
        await page.goto(path);
        if (isMobile) await page.getByRole('button', { name: '메뉴 열기' }).click();
        const scope = isMobile
            ? page.getByRole('navigation', { name: '주 메뉴' })
            : page.getByRole('banner');
        await scope.getByRole('link', { name: 'Contact' }).click();
        await expect(
            page.getByRole('heading', { level: 2, name: 'Get in Touch!' }),
        ).toBeInViewport();
        // 다른 페이지로 옮기지 않는다
        expect(new URL(page.url()).pathname).toBe(path);
    }
});

test('홈에서 More About Me를 눌러 소개 페이지에 간다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'More About Me' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'ABOUT ME' })).toBeVisible();
});

test('소개 페이지에서 경력을 한 번에 모두 펼치고 닫는다', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('LG G2 Micro site')).toBeHidden();

    await page.getByRole('button', { name: '전체 펼치기' }).click();
    await expect(page.getByText('LG G2 Micro site')).toBeVisible();
    await expect(page.getByText('여러 쇼핑몰', { exact: true }).last()).toBeVisible();

    await page.getByRole('button', { name: '전체 닫기' }).click();
    await expect(page.getByText('LG G2 Micro site')).toBeHidden();
    await expect(page.getByText('Ris-K(PaaS)')).toBeHidden();
    await expect(page.getByRole('button', { name: '전체 펼치기' })).toBeVisible();
});

// 작업은 저장소에 있고 관리 화면에서 바뀐다. 개수 · 이름 · 분류를 고정하지 않고 화면에서 읽어 확인한다
test('작업 목록을 분류로 거르면 주소에 남고, 그 주소로 열면 같은 목록이 나온다', async ({
    page,
}) => {
    await page.goto('/project');
    const cards = page.getByRole('main').getByRole('article');
    await expect(cards.first()).toBeVisible();
    const total = await cards.count();

    // 첫 버튼은 「전체」 다. 그다음의 첫 분류로 거른다
    const filters = page.locator('button[aria-pressed]');
    const category = filters.nth(1);
    const name = (await category.textContent())?.trim() ?? '';
    expect(name).not.toBe('');

    await category.click();
    await expect(category).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => new URL(page.url()).searchParams.get('category')).toBe(name);

    // 거른 주소로 바로 열면 거른 목록이 나온다. 여기서 센 수를 기준으로 삼는다.
    // 누른 직후에는 빠지는 카드가 아직 화면에 있어 수를 바로 세지 못한다
    await page.goto(page.url());
    await expect(cards.first()).toBeVisible();
    const filtered = await cards.count();
    expect(filtered).toBeLessThanOrEqual(total);
    await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
    );

    await page.getByRole('button', { name: '전체' }).click();
    await expect(cards).toHaveCount(total);
    await expect(page).toHaveURL(/\/project$/);

    // 다시 눌러도 주소로 열었을 때와 같은 목록이 나온다
    await page.getByRole('button', { name, exact: true }).click();
    await expect(cards).toHaveCount(filtered);
});

test('작업 카드에서 상세로 가면 제목과 메타가 있고, 다음 작업으로 넘어간다', async ({ page }) => {
    await page.goto('/project');
    const cards = page.getByRole('main').getByRole('article');
    await expect(cards.first()).toBeVisible();
    const total = await cards.count();
    const title = (await cards.first().getByRole('heading', { level: 3 }).textContent()) ?? '';

    await cards.first().getByRole('link', { name: /열기$/ }).click();
    await expect(page).toHaveURL(/\/project\/[^/]+$/);
    const firstUrl = page.url();
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible();
    await expect(page.getByRole('main').locator('dl').first()).toBeVisible();

    // 첫 작업이라 이전은 없다. 작업이 하나뿐이면 다음도 없다
    const pager = page.getByRole('navigation', { name: '다른 프로젝트' });
    await expect(pager.getByRole('link', { name: /이전 프로젝트/ })).toHaveCount(0);
    if (total < 2) return;

    await pager.getByRole('link', { name: /다음 프로젝트/ }).click();
    await expect(page).not.toHaveURL(firstUrl);
    await expect(page).toHaveURL(/\/project\/[^/]+$/);
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(title);
});

test('프로젝트 상세에서 목록으로 돌아가면 목록의 맨 위로 간다', async ({ page, isMobile }) => {
    await page.goto('/project');
    const detailLink = page.getByRole('link', { name: /열기$/ }).first();

    for (const goBack of ['header', 'backLink'] as const) {
        await detailLink.click();
        await expect(page).toHaveURL(/\/project\/[^/]+$/);
        // 상세의 아래쪽에서 눌러도 목록은 맨 위에서 열린다
        await page.getByRole('contentinfo').scrollIntoViewIfNeeded();

        if (goBack === 'header') {
            if (isMobile) await page.getByRole('button', { name: '메뉴 열기' }).click();
            const projects = page
                .getByRole('navigation', { name: '주 메뉴' })
                .getByRole('link', { name: 'Projects' });
            await expect(projects).toHaveAttribute('aria-current', 'page');
            await projects.click();
        } else {
            await page.getByRole('link', { name: 'All Projects' }).click();
        }

        await expect(page).toHaveURL(/\/project$/);
        await expect(
            page.getByRole('heading', { level: 1, name: 'ALL PROJECTS' }),
        ).toBeInViewport();
    }
});

test('없는 작업의 주소로 들어오면 찾을 수 없다고 알린다', async ({ page }) => {
    await page.goto('/project/none');
    await expect(page.getByRole('heading', { level: 1, name: /Page Not Found/ })).toBeVisible();
});
