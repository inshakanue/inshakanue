import { describe, it, expect } from 'vitest';
import { addInternalLinks, calculateReadingTime, suggestTags } from './internalLinking';

describe('addInternalLinks', () => {
  it('should add internal links for matching keywords', () => {
    const content = 'This article discusses AI Product Manager skills.';
    const result = addInternalLinks(content, '/blog/test');
    
    expect(result).toContain('<a href="/"');
    expect(result).toContain('AI Product Manager');
    expect(result).toContain('class="internal-link text-primary hover:underline"');
  });

  it('should not link to the current page', () => {
    const content = 'Check out our blog for more articles.';
    const result = addInternalLinks(content, '/blog');
    
    // Should not add link when current URL includes the link URL
    expect(result).toBe(content);
  });

  it('should only link the first occurrence of a keyword', () => {
    const content = 'AI Product Manager tips for AI Product Manager success.';
    const result = addInternalLinks(content, '/blog/test');
    
    // Count occurrences of the link
    const linkCount = (result.match(/<a href/g) || []).length;
    expect(linkCount).toBe(1);
  });

  it('should handle case-insensitive matching', () => {
    const content = 'Learn about ai product manager roles.';
    const result = addInternalLinks(content, '/blog/test');
    
    expect(result).toContain('<a href="/"');
  });

  it('should not modify content without matching keywords', () => {
    const content = 'This is some random content without keywords.';
    const result = addInternalLinks(content, '/blog/test');
    
    expect(result).toBe(content);
  });
});

describe('calculateReadingTime', () => {
  it('should calculate reading time for short content', () => {
    const content = 'Short content with few words.';
    const time = calculateReadingTime(content);
    
    expect(time).toBe(1); // Minimum 1 minute
  });

  it('should calculate reading time for medium content', () => {
    const content = Array(400).fill('word').join(' ');
    const time = calculateReadingTime(content);
    
    expect(time).toBe(2); // 400 words / 200 wpm = 2 minutes
  });

  it('should calculate reading time for long content', () => {
    const content = Array(1000).fill('word').join(' ');
    const time = calculateReadingTime(content);
    
    expect(time).toBe(5); // 1000 words / 200 wpm = 5 minutes
  });

  it('should round up partial minutes', () => {
    const content = Array(250).fill('word').join(' ');
    const time = calculateReadingTime(content);
    
    expect(time).toBe(2); // 250 words / 200 wpm = 1.25, rounded to 2
  });
});

describe('suggestTags', () => {
  it('should extract frequent keywords as tags', () => {
    const title = 'Product Management Best Practices';
    const content = 'Product management requires product thinking and management skills. Product managers need management experience.';
    const tags = suggestTags(content, title);
    
    expect(tags).toContain('product');
    expect(tags).toContain('management');
    expect(tags.length).toBeLessThanOrEqual(5);
  });

  it('should filter out common words', () => {
    const title = 'Test Article';
    const content = 'This is a test article with the most common words like and or but.';
    const tags = suggestTags(content, title);
    
    expect(tags).not.toContain('the');
    expect(tags).not.toContain('and');
    expect(tags).not.toContain('with');
  });

  it('should only return words with 4+ characters', () => {
    const title = 'AI ML Testing';
    const content = 'AI ML testing with big data and new tech.';
    const tags = suggestTags(content, title);
    
    tags.forEach(tag => {
      expect(tag.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('should return maximum 5 tags', () => {
    const title = 'Comprehensive Guide';
    const content = Array(100).fill('innovation technology development implementation strategy architecture').join(' ');
    const tags = suggestTags(content, title);
    
    expect(tags.length).toBeLessThanOrEqual(5);
  });

  it('should handle empty content', () => {
    const tags = suggestTags('', '');
    
    expect(tags).toEqual([]);
  });
});
