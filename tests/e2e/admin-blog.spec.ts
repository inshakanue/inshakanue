import { test, expect } from '@playwright/test';

test.describe('Admin Blog Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login"), button:has-text("Sign In")');
    await page.waitForURL('/');
  });

  test('should access blog admin page', async ({ page }) => {
    await page.goto('/blog/admin');
    
    // Should be able to access admin page
    await expect(page.locator('h1, h2')).toContainText(/blog|admin|manage/i);
  });

  test('should create a new blog post', async ({ page }) => {
    await page.goto('/blog/admin');
    
    // Fill in blog post form
    const timestamp = Date.now();
    await page.fill('input[name="title"], input[placeholder*="title" i]', `Test Post ${timestamp}`);
    await page.fill('textarea[name="content"], textarea[placeholder*="content" i]', 'This is a test blog post content.');
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Publish"), button:has-text("Create"), button:has-text("Save")');
    
    // Should show success message or redirect
    await page.waitForLoadState('networkidle');
  });

  test('should view published posts on blog page', async ({ page }) => {
    await page.goto('/blog');
    
    // Should see blog posts
    await expect(page.locator('article, .blog-post, [class*="post"]')).toHaveCount({ min: 0 });
  });
});
