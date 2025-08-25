import { test, expect } from '@playwright/test';

test.describe('Interview Application E2E', () => {
  test('should load the interviews page', async ({ page }) => {
    await page.goto('/interviews');
    
    // Check if the main elements are present
    await expect(page.getByText('Interview Manager')).toBeVisible();
    await expect(page.getByText('Upload New Interview')).toBeVisible();
    await expect(page.getByText('All Interviews')).toBeVisible();
  });

  test('should show upload interface', async ({ page }) => {
    await page.goto('/interviews');
    
    // Check upload area
    await expect(page.getByText('Drop your interview file here')).toBeVisible();
    await expect(page.getByText('Choose File')).toBeVisible();
  });

  test('should display interview cards', async ({ page }) => {
    await page.goto('/interviews');
    
    // Wait for interviews to load (mock data)
    await page.waitForSelector('[data-testid="interview-card"]', { timeout: 5000 });
    
    // Check if interview cards are displayed
    const cards = await page.locator('[data-testid="interview-card"]');
    await expect(cards).toHaveCount(3); // Mock data has 3 interviews
  });

  test('should navigate to interview detail page', async ({ page }) => {
    await page.goto('/interviews');
    
    // Click on first interview card
    await page.locator('[data-testid="interview-card"]').first().click();
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/\/interviews\/\d+/);
    await expect(page.getByText('Media Player')).toBeVisible();
  });

  test('should search interviews', async ({ page }) => {
    await page.goto('/interviews');
    
    // Type in search box
    await page.fill('input[placeholder="Search interviews..."]', 'Software');
    
    // Should filter results
    await expect(page.getByText('Software_Developer_Interview_1.mp4')).toBeVisible();
  });
});
