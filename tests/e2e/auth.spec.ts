import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';

  test('should sign up a new user', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill signup form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Click sign up button
    await page.click('button:has-text("Sign Up")');
    
    // Should redirect to homepage after signup
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // Click login button
    await page.click('button:has-text("Login"), button:has-text("Sign In")');
    
    // Should redirect to homepage
    await page.waitForURL('/');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill with invalid credentials
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Try to login
    await page.click('button:has-text("Login"), button:has-text("Sign In")');
    
    // Should show error message
    await expect(page.locator('text=/invalid|error|wrong/i')).toBeVisible({ timeout: 5000 });
  });

  test('should persist session after page reload', async ({ page, context }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login"), button:has-text("Sign In")');
    await page.waitForURL('/');
    
    // Reload page
    await page.reload();
    
    // Should still be logged in (not redirected to /auth)
    await expect(page).toHaveURL('/');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login"), button:has-text("Sign In")');
    await page.waitForURL('/');
    
    // Find and click logout button
    await page.click('button:has-text("Logout"), button:has-text("Sign Out")');
    
    // Should redirect to auth page or homepage
    await page.waitForLoadState('networkidle');
  });
});
