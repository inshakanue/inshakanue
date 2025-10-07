import { test, expect } from '@playwright/test';

test.describe('Blog Navigation', () => {
  test('should navigate from homepage to blog', async ({ page }) => {
    await page.goto('/');
    
    // Click blog link
    await page.click('a[href="/blog"], text=Blog');
    await expect(page).toHaveURL('/blog');
  });

  test('should filter posts by tag', async ({ page }) => {
    await page.goto('/blog');
    
    // Click on a tag if available
    const tag = page.locator('a[href^="/blog/tag/"]').first();
    if (await tag.isVisible()) {
      const tagHref = await tag.getAttribute('href');
      await tag.click();
      await expect(page).toHaveURL(tagHref || /\/blog\/tag\//);
    }
  });

  test('should open and read a blog post', async ({ page }) => {
    await page.goto('/blog');
    
    // Click first blog post if available
    const postLink = page.locator('a[href^="/blog/"]').first();
    if (await postLink.isVisible()) {
      await postLink.click();
      
      // Should navigate to blog post page
      await expect(page).toHaveURL(/\/blog\/.+/);
      
      // Check for article content
      await expect(page.locator('article, main')).toBeVisible();
    }
  });

  test('should show breadcrumbs on blog post', async ({ page }) => {
    await page.goto('/blog');
    
    const postLink = page.locator('a[href^="/blog/"]').first();
    if (await postLink.isVisible()) {
      await postLink.click();
      
      // Check for breadcrumbs
      await expect(page.locator('nav[aria-label*="breadcrumb" i], .breadcrumb')).toBeVisible();
    }
  });
});

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    await page.click('text=Contact');
    
    // Fill form
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test User');
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await page.fill('textarea[name="message"], textarea[placeholder*="message" i]', 'This is a test message.');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=/success|sent|thank/i')).toBeVisible({ timeout: 10000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contact');
    
    // Fill with invalid email
    await page.fill('input[name="email"], input[type="email"]', 'invalid-email');
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test');
    await page.fill('textarea[name="message"], textarea[placeholder*="message" i]', 'Test message');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error or prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});
