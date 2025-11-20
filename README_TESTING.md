# Testing Documentation

This project includes comprehensive unit tests and E2E tests to ensure code quality and functionality.

## Test Structure

```
src/
├── test/
│   ├── setup.ts                 # Vitest setup and global mocks
│   └── test-utils.tsx           # Custom render utilities
├── utils/
│   └── internalLinking.test.ts  # Unit tests for linking utils
├── components/
│   └── SEO.test.tsx             # Component integration tests
└── hooks/
    └── useAdminStatus.test.tsx  # Hook tests

tests/
└── e2e/
    ├── public-user.spec.ts      # Public user journey tests
    ├── auth.spec.ts             # Authentication flow tests
    ├── admin-blog.spec.ts       # Admin blog management tests
    ├── protected-routes.spec.ts # Route protection tests
    └── blog-navigation.spec.ts  # Blog navigation tests
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug

# Run specific test file
npm run test:e2e tests/e2e/auth.spec.ts
```

## Test Coverage

### Business Logic (Unit Tests)

- **Internal Linking** (`internalLinking.ts`)
  - ✅ Keyword matching and link generation
  - ✅ Avoiding current page links
  - ✅ First occurrence only linking
  - ✅ Reading time calculation
  - ✅ Tag suggestion from content

### Components (Integration Tests)

- **SEO Component**
  - ✅ Meta tag rendering
  - ✅ Open Graph tags
  - ✅ Twitter Card tags
  - ✅ Canonical URL

- **Hooks**
  - ✅ useAdminStatus - admin detection
  - ✅ Auth state management

### User Journeys (E2E Tests)

1. **Public User**
   - Homepage navigation
   - Blog browsing
   - Contact form submission

2. **Authentication**
   - Sign up flow
   - Login with valid/invalid credentials
   - Session persistence
   - Logout

3. **Admin**
   - Blog post creation
   - Blog post editing
   - Blog post deletion

4. **Protected Routes**
   - Unauthenticated redirect
   - Admin access control

## Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFile';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />);
    // Add assertions
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should complete user journey', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Click Me');
  await expect(page).toHaveURL('/expected-page');
});
```

## Best Practices

1. **Unit Tests**
   - Test business logic in isolation
   - Mock external dependencies
   - Keep tests fast and focused

2. **Integration Tests**
   - Test component behavior
   - Include user interactions
   - Verify UI state changes

3. **E2E Tests**
   - Test complete user journeys
   - Focus on critical paths
   - Use realistic data

4. **General**
   - Write descriptive test names
   - One assertion per test when possible
   - Clean up test data
   - Keep tests independent

## CI/CD Integration

Tests run automatically on:
- Every push to the repository
- Pull request creation
- Before deployments

Coverage reports are generated and can be viewed in the `coverage/` directory after running `npm run test:coverage`.

## Troubleshooting

### Tests Failing Locally

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Update test snapshots:
   ```bash
   npm test -- -u
   ```

### E2E Tests Failing

1. Ensure dev server is running:
   ```bash
   npm run dev
   ```

2. Check browser compatibility:
   ```bash
   npx playwright install
   ```

3. View test artifacts:
   - Screenshots: `test-results/`
   - Videos: `test-results/`
   - HTML report: `playwright-report/`
