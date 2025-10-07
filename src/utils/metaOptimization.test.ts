import { describe, it, expect } from 'vitest';
import { optimizeTitle, optimizeDescription, generateKeywords, getCanonicalUrl } from './metaOptimization';

describe('optimizeTitle', () => {
  it('should add brand name if under 60 characters', () => {
    const result = optimizeTitle('Product Management');
    expect(result).toBe('Product Management | Insha Kanue');
    expect(result.length).toBeLessThanOrEqual(60);
  });

  it('should not duplicate brand name', () => {
    const result = optimizeTitle('Test | Insha Kanue');
    expect(result).toBe('Test | Insha Kanue');
  });

  it('should truncate long titles', () => {
    const longTitle = 'This is a very long title that exceeds the maximum character limit for SEO';
    const result = optimizeTitle(longTitle);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result).toContain('...');
  });
});

describe('optimizeDescription', () => {
  it('should return description if under max length', () => {
    const desc = 'Short description.';
    const result = optimizeDescription(desc);
    expect(result).toBe(desc);
  });

  it('should truncate at last sentence before max length', () => {
    const desc = 'First sentence. Second sentence is longer and goes over the limit. Third sentence would be too much to include in this meta description for optimal SEO performance.';
    const result = optimizeDescription(desc, 160);
    expect(result.length).toBeLessThanOrEqual(160);
  });

  it('should truncate at last space if no sentence break', () => {
    const desc = 'A' + 'long'.repeat(50);
    const result = optimizeDescription(desc, 160);
    expect(result.length).toBeLessThanOrEqual(163); // 160 + '...'
    expect(result).toContain('...');
  });
});

describe('generateKeywords', () => {
  it('should extract keywords from title and content', () => {
    const keywords = generateKeywords('AI Product Manager', 'Learn about AI and machine learning for product management');
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords.length).toBeLessThanOrEqual(10);
  });

  it('should filter common words', () => {
    const keywords = generateKeywords('Test', 'the and or but with');
    expect(keywords).not.toContain('the');
    expect(keywords).not.toContain('and');
  });
});

describe('getCanonicalUrl', () => {
  it('should format URL correctly with leading slash', () => {
    const result = getCanonicalUrl('/blog/test');
    expect(result).toBe('https://inshakanue.lovable.app/blog/test');
  });

  it('should add leading slash if missing', () => {
    const result = getCanonicalUrl('blog/test');
    expect(result).toBe('https://inshakanue.lovable.app/blog/test');
  });
});
