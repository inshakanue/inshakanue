import { test, expect } from '@playwright/test';

test.describe('Public User Journey', () => {
  test('should navigate homepage and view content', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('h1')).toContainText('AI Product Manager');
    
    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate to blog and view posts', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to blog
    await page.click('text=Blog');
    await expect(page).toHaveURL('/blog');
    
    // Check blog page loaded
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('should view contact section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact section
    await page.click('text=Contact');
    
    // Check contact form exists
    await expect(page.locator('form')).toBeVisible();
  });
});
