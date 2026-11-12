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

test('연락 버튼이 메일 주소로 연결된다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'h2dlhs@naver.com' })).toHaveAttribute(
    'href',
    'mailto:h2dlhs@naver.com',
  );
});
