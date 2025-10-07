import { describe, it, expect } from 'vitest';
import { validateAltText, generateSrcSet, generateSizes } from './imageOptimization';

describe('validateAltText', () => {
  it('should validate empty alt text', () => {
    const result = validateAltText('');
    expect(result.valid).toBe(false);
    expect(result.suggestions).toHaveLength(1);
  });

  it('should validate short alt text', () => {
    const result = validateAltText('Short');
    expect(result.valid).toBe(false);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('should validate long alt text', () => {
    const longAlt = 'A'.repeat(130);
    const result = validateAltText(longAlt);
    expect(result.valid).toBe(false);
    expect(result.suggestions.some(s => s.includes('too long'))).toBe(true);
  });

  it('should warn about redundant phrases', () => {
    const result = validateAltText('Image of a sunset over the ocean');
    expect(result.suggestions.some(s => s.includes('Avoid phrases'))).toBe(true);
  });

  it('should validate good alt text', () => {
    const result = validateAltText('Sunset over calm ocean waters');
    expect(result.valid).toBe(true);
    expect(result.suggestions).toHaveLength(0);
  });
});

describe('generateSrcSet', () => {
  it('should generate srcset string', () => {
    const result = generateSrcSet('/image.jpg', [320, 640, 1024]);
    expect(result).toBe('/image.jpg?w=320 320w, /image.jpg?w=640 640w, /image.jpg?w=1024 1024w');
  });
});

describe('generateSizes', () => {
  it('should generate sizes string', () => {
    const breakpoints = [
      { maxWidth: '768px', size: '100vw' },
      { maxWidth: '1024px', size: '50vw' },
    ];
    const result = generateSizes(breakpoints);
    expect(result).toBe('(max-width: 768px) 100vw, (max-width: 1024px) 50vw');
  });
});
