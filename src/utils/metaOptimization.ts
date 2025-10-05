// Meta tag optimization utilities

/**
 * Optimize title for SEO
 * - Keep under 60 characters
 * - Include primary keyword
 * - Add brand name
 */
export const optimizeTitle = (title: string, brandName = 'Insha Kanue'): string => {
  const maxLength = 60;
  const separator = ' | ';
  
  // If title already includes brand, return as is (if under limit)
  if (title.includes(brandName)) {
    return title.length <= maxLength ? title : title.substring(0, maxLength - 3) + '...';
  }
  
  // Add brand name if there's room
  const titleWithBrand = `${title}${separator}${brandName}`;
  if (titleWithBrand.length <= maxLength) {
    return titleWithBrand;
  }
  
  // Truncate title to fit with brand
  const availableLength = maxLength - separator.length - brandName.length;
  return `${title.substring(0, availableLength - 3)}...${separator}${brandName}`;
};

/**
 * Optimize meta description for SEO
 * - Keep between 150-160 characters
 * - Include target keyword
 * - End with call to action
 */
export const optimizeDescription = (description: string, maxLength = 160): string => {
  if (description.length <= maxLength) {
    return description;
  }
  
  // Truncate at last complete sentence before maxLength
  const truncated = description.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  
  if (lastPeriod > maxLength * 0.8) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  // Truncate at last space
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
};

/**
 * Generate keywords from content
 */
export const generateKeywords = (title: string, content: string, maxKeywords = 10): string[] => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which'
  ]);

  const text = `${title} ${content}`.toLowerCase();
  const words = text.match(/\b[a-z]{3,}\b/g) || [];
  
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    if (!commonWords.has(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  return Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

/**
 * Validate canonical URL
 */
export const getCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://inshakanue.lovable.app';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
