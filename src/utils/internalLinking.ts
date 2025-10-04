// Utility for automatic internal linking in blog content
export interface InternalLink {
  keyword: string;
  url: string;
  title: string;
}

// Add keywords and their corresponding internal links
export const internalLinks: InternalLink[] = [
  { keyword: 'AI Product Manager', url: '/', title: 'Learn more about AI Product Management' },
  { keyword: 'machine learning', url: '/', title: 'AI and ML expertise' },
  { keyword: 'product strategy', url: '/', title: 'Product strategy approach' },
  { keyword: 'blog', url: '/blog', title: 'Read more articles' },
];

/**
 * Automatically adds internal links to content based on keywords
 * Only links the first occurrence of each keyword to avoid over-linking
 */
export const addInternalLinks = (content: string, currentUrl: string): string => {
  let linkedContent = content;
  const usedKeywords = new Set<string>();

  internalLinks.forEach(({ keyword, url, title }) => {
    // Don't link to the current page
    if (currentUrl.includes(url) && url !== '/') return;
    
    // Only link the first occurrence
    if (usedKeywords.has(keyword.toLowerCase())) return;

    // Case-insensitive search for the keyword
    const regex = new RegExp(`\\b(${keyword})\\b`, 'i');
    const match = linkedContent.match(regex);

    if (match) {
      const matchedText = match[0];
      const link = `<a href="${url}" class="internal-link text-primary hover:underline" title="${title}">${matchedText}</a>`;
      linkedContent = linkedContent.replace(regex, link);
      usedKeywords.add(keyword.toLowerCase());
    }
  });

  return linkedContent;
};

/**
 * Calculates reading time based on word count
 * Average reading speed: 200 words per minute
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
};

/**
 * Extracts suggested tags from content based on keyword frequency
 */
export const suggestTags = (content: string, title: string): string[] => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
  
  const text = `${title} ${content}`.toLowerCase();
  const words = text.match(/\b[a-z]{4,}\b/g) || [];
  
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    if (!commonWords.includes(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  // Get top 5 most frequent words
  const suggestedTags = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

  return suggestedTags;
};
