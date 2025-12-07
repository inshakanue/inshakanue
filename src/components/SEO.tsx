/**
 * SEO COMPONENT
 * 
 * BUSINESS CONTEXT:
 * Manages all meta tags, Open Graph, Twitter Cards, and canonical URLs for SEO
 * and social media sharing. This component is critical for:
 * 1. Google search rankings (meta description, keywords, structured data)
 * 2. Social media previews (LinkedIn, Twitter, Facebook shares)
 * 3. Duplicate content prevention (canonical URLs)
 * 
 * KEY BUSINESS OBJECTIVES:
 * - Rank for "AI Product Manager" and related keywords
 * - Generate professional social media preview cards when shared
 * - Support blog post article markup for rich search results
 * - Maintain consistent brand messaging across all pages
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Dynamically updates <head> meta tags based on page
 * - Uses React hooks to respond to route changes
 * - Supports both website and article schema types
 * - Implements best practices for social sharing
 * 
 * DEFAULT VALUES:
 * - Title: "Insha Kanue - AI Product Manager | ML & AI Strategy Expert"
 * - Description: 160-character optimized description with keywords
 * - Image: OpenGraph preview image for social sharing
 * - Type: 'website' (or 'article' for blog posts)
 * 
 * USAGE:
 * <SEO /> // Homepage with default values
 * <SEO title="Blog Post Title" description="..." type="article" />
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;                                    // Page title (60 char limit recommended)
  description?: string;                              // Meta description (160 char limit)
  image?: string;                                    // OpenGraph preview image URL
  article?: {                                        // Article-specific metadata
    publishedTime?: string;                          // ISO 8601 format: "2024-03-15T10:00:00Z"
    modifiedTime?: string;                           // ISO 8601 format for updates
    author?: string;                                 // Author name
    tags?: string[];                                 // Article tags for categorization
  };
  type?: 'website' | 'article' | 'profile';        // OpenGraph type
}

const SEO = ({
  // DEFAULT SEO VALUES optimized for "AI Product Manager" keyword ranking
  title = 'Insha Kanue - AI Product Manager | Machine Learning & AI Strategy',
  description = 'AI Product Manager with 8+ years building machine learning products. Led AI/ML teams at HRS Group, generated €15M+ revenue. Expert in AI product strategy, LLM integration, MLOps, and data-driven product development.',
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',  // Default social preview
  article,
  type = 'website',
}: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    // Guard against SSR/non-browser environments
    if (typeof window === 'undefined') return;
    
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}${location.pathname}`;  // Full URL for this page
    /**
     * UPDATE DOCUMENT TITLE
     * Shows in browser tab and is the primary ranking signal for Google.
     * Format: "Page Name - Brand Name" for optimal SEO.
     */
    document.title = title;

    /**
     * UPDATE OR CREATE META TAG HELPER
     * Reusable function to set meta tag content.
     * Creates new tag if doesn't exist, updates if it does.
     * 
     * @param name - Meta tag name or property
     * @param content - Meta tag content value
     * @param isProperty - Use 'property' attribute instead of 'name' (for OpenGraph)
     */
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    /**
     * BASIC SEO META TAGS
     * Core tags that Google uses for search results and rankings.
     */
    updateMetaTag('description', description);              // Shows in search results below title
    updateMetaTag('author', 'Insha Kanue');                 // Attribution
    updateMetaTag('keywords', 'AI Product Manager, Machine Learning Product Manager, ML Product Management, AI Strategy, LLM Integration, MLOps, Data Science Product Manager, AI/ML Products, Product Management AI');

    /**
     * OPEN GRAPH TAGS
     * Used by LinkedIn, Facebook, Slack, and other platforms for rich previews.
     * These create the cards you see when sharing a link.
     */
    updateMetaTag('og:title', title, true);                 // Card title
    updateMetaTag('og:description', description, true);     // Card description
    updateMetaTag('og:image', image, true);                 // Card image (1200x630 recommended)
    updateMetaTag('og:url', canonicalUrl, true);            // Canonical URL for this page
    updateMetaTag('og:type', type, true);                   // 'website' or 'article'
    updateMetaTag('og:site_name', 'Insha Kanue Portfolio', true);

    /**
     * TWITTER CARD TAGS
     * Specific to Twitter/X platform for rich preview cards.
     * Uses larger image format for maximum visual impact.
     */
    updateMetaTag('twitter:card', 'summary_large_image');   // Large image card type
    updateMetaTag('twitter:title', title);                   // Card title
    updateMetaTag('twitter:description', description);       // Card description
    updateMetaTag('twitter:image', image);                   // Card image

    /**
     * ARTICLE-SPECIFIC META TAGS
     * Only added for blog posts (type === 'article').
     * Helps Google understand content freshness and authorship.
     */
    if (article && type === 'article') {
      if (article.publishedTime) {
        updateMetaTag('article:published_time', article.publishedTime, true);
      }
      if (article.modifiedTime) {
        updateMetaTag('article:modified_time', article.modifiedTime, true);
      }
      if (article.author) {
        updateMetaTag('article:author', article.author, true);
      }
      if (article.tags) {
        // Multiple tags for article categorization
        article.tags.forEach(tag => {
          updateMetaTag('article:tag', tag, true);
        });
      }
    }

    /**
     * CANONICAL URL
     * Tells search engines the "official" URL for this content.
     * Prevents duplicate content penalties if same content appears on multiple URLs.
     */
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    /**
     * CLEANUP
     * Keep meta tags for subsequent navigations (SPA behavior).
     * Tags will be updated, not removed, when navigating between pages.
     */
    return () => {
      // Intentionally empty - meta tags persist between route changes
    };
  }, [title, description, image, location.pathname, article, type]);

  // This is a non-rendering component (updates <head> only)
  return null;
};

export default SEO;
