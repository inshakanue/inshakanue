// Image optimization utilities for better performance and SEO

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (src: string, widths: number[]): string => {
  return widths
    .map(width => `${src}?w=${width} ${width}w`)
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (breakpoints: { maxWidth: string; size: string }[]): string => {
  return breakpoints
    .map(bp => `(max-width: ${bp.maxWidth}) ${bp.size}`)
    .join(', ');
};

/**
 * Validate image alt text for SEO
 */
export const validateAltText = (alt: string): { valid: boolean; suggestions: string[] } => {
  const suggestions: string[] = [];
  
  if (!alt || alt.trim().length === 0) {
    suggestions.push('Add descriptive alt text for accessibility and SEO');
    return { valid: false, suggestions };
  }
  
  if (alt.length < 10) {
    suggestions.push('Alt text should be more descriptive (at least 10 characters)');
  }
  
  if (alt.length > 125) {
    suggestions.push('Alt text is too long (max 125 characters recommended)');
  }
  
  if (/image of|picture of|photo of/i.test(alt)) {
    suggestions.push('Avoid phrases like "image of" or "picture of" in alt text');
  }
  
  return { valid: suggestions.length === 0, suggestions };
};

/**
 * Generate optimized image props
 */
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  options?: Partial<ImageProps>
): ImageProps => {
  return {
    src,
    alt,
    loading: options?.loading || 'lazy',
    width: options?.width,
    height: options?.height,
    className: options?.className,
  };
};
