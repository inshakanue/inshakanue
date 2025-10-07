import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users from admin page', async ({ page }) => {
    // Try to access admin page without authentication
    await page.goto('/blog/admin');
    
    // Should redirect to auth page
    await page.waitForURL(/\/auth/);
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should allow authenticated admin to access admin routes', async ({ page }) => {
    // Login as admin
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login"), button:has-text("Sign In")');
    await page.waitForURL('/');
    
    // Navigate to admin page
    await page.goto('/blog/admin');
    
    // Should be able to access
    await expect(page).toHaveURL('/blog/admin');
  });

  test('should allow public access to blog page', async ({ page }) => {
    // Access blog without authentication
    await page.goto('/blog');
    
    // Should be accessible
    await expect(page).toHaveURL('/blog');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should allow public access to homepage', async ({ page }) => {
    await page.goto('/');
    
    // Should be accessible
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
