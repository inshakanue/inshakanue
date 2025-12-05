import { useEffect } from 'react';

interface SocialPreviewProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Enhanced social media meta tags for better sharing previews
 */
export const SocialPreview = ({
  title,
  description,
  image = 'https://inshakanue.space/og-default-blog.jpg',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SocialPreviewProps) => {
  useEffect(() => {
    // Guard against SSR/non-browser environments
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.href;
    
    // Open Graph
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:type', content: type },
      { property: 'og:url', content: currentUrl },
    ];

    // Twitter Card
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ];

    // Article specific
    if (type === 'article' && author) {
      ogTags.push({ property: 'article:author', content: author });
      if (publishedTime) {
        ogTags.push({ property: 'article:published_time', content: publishedTime });
      }
      if (modifiedTime) {
        ogTags.push({ property: 'article:modified_time', content: modifiedTime });
      }
    }

    const allTags = [...ogTags, ...twitterTags];

    allTags.forEach(tag => {
      const key = 'property' in tag ? 'property' : 'name';
      const value = tag[key as keyof typeof tag] as string;
      
      let meta = document.querySelector(`meta[${key}="${value}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(key, value);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', tag.content);
    });

    return () => {
      allTags.forEach(tag => {
        const key = 'property' in tag ? 'property' : 'name';
        const value = tag[key as keyof typeof tag] as string;
        const meta = document.querySelector(`meta[${key}="${value}"]`);
        if (meta) {
          document.head.removeChild(meta);
        }
      });
    };
  }, [title, description, image, type, author, publishedTime, modifiedTime]);

  return null;
};
