import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  type?: 'website' | 'article' | 'profile';
}

const SEO = ({
  title = 'Insha Kanue - AI Product Manager',
  description = 'Experienced AI Product Manager with 7+ years in AI/ML products, digital transformation and revenue growth. Specializing in data-driven product strategies and cross-functional leadership.',
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  article,
  type = 'website',
}: SEOProps) => {
  const location = useLocation();
  const siteUrl = window.location.origin;
  const canonicalUrl = `${siteUrl}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
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

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('author', 'Insha Kanue');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Insha Kanue Portfolio', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Article-specific meta tags
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
        article.tags.forEach(tag => {
          updateMetaTag('article:tag', tag, true);
        });
      }
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Cleanup function
    return () => {
      // Keep meta tags for subsequent navigations
    };
  }, [title, description, image, canonicalUrl, article, type]);

  return null;
};

export default SEO;
