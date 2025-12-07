import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

const StructuredData = ({ data }: StructuredDataProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = `structured-data-${Date.now()}`;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(script.id);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [data]);

  return null;
};

// Predefined structured data schemas - use functions to avoid window access at module load
export const getPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Insha Kanue',
  jobTitle: 'AI Product Manager',
  description: '8+ years of experience building AI-powered products and machine learning solutions',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://inshakanue.space',
  image: 'https://lovable.dev/opengraph-image-p98pqg.png',
  sameAs: [
    'https://www.linkedin.com/in/inshakanue',
    'https://github.com/inshakanue',
    'https://twitter.com/inshakanue',
  ],
  knowsAbout: [
    'AI Product Management',
    'Machine Learning',
    'Data Strategy',
    'Product Development',
    'LLM Integration',
    'Prompt Engineering',
    'A/B Testing',
    'Agile Methodologies',
  ],
  alumniOf: {
    '@type': 'Organization',
    name: 'HRS Group',
  },
});

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Insha Kanue Portfolio',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://inshakanue.space',
  logo: 'https://lovable.dev/opengraph-image-p98pqg.png',
  founder: {
    '@type': 'Person',
    name: 'Insha Kanue',
  },
});

export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Insha Kanue - AI Product Manager',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://inshakanue.space',
  description: 'Personal portfolio showcasing AI product management expertise and achievements',
  author: {
    '@type': 'Person',
    name: 'Insha Kanue',
  },
});

// Legacy exports - these are now getter functions for backwards compatibility
export const PersonSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Insha Kanue',
  jobTitle: 'AI Product Manager',
  description: '8+ years of experience building AI-powered products and machine learning solutions',
  url: 'https://inshakanue.space',
  image: 'https://lovable.dev/opengraph-image-p98pqg.png',
  sameAs: [
    'https://www.linkedin.com/in/inshakanue',
    'https://github.com/inshakanue',
    'https://twitter.com/inshakanue',
  ],
  knowsAbout: [
    'AI Product Management',
    'Machine Learning',
    'Data Strategy',
    'Product Development',
    'LLM Integration',
    'Prompt Engineering',
    'A/B Testing',
    'Agile Methodologies',
  ],
  alumniOf: {
    '@type': 'Organization',
    name: 'HRS Group',
  },
};

export const OrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Insha Kanue Portfolio',
  url: 'https://inshakanue.space',
  logo: 'https://lovable.dev/opengraph-image-p98pqg.png',
  founder: {
    '@type': 'Person',
    name: 'Insha Kanue',
  },
};

export const WebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Insha Kanue - AI Product Manager',
  url: 'https://inshakanue.space',
  description: 'Personal portfolio showcasing AI product management expertise and achievements',
  author: {
    '@type': 'Person',
    name: 'Insha Kanue',
  },
};

export const createBlogPostSchema = (post: {
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  image?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  image: post.image || 'https://lovable.dev/opengraph-image-p98pqg.png',
  datePublished: post.publishedAt,
  dateModified: post.modifiedAt || post.publishedAt,
  author: {
    '@type': 'Person',
    name: post.author,
  },
  publisher: {
    '@type': 'Person',
    name: 'Insha Kanue',
    logo: {
      '@type': 'ImageObject',
      url: 'https://lovable.dev/opengraph-image-p98pqg.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': post.url,
  },
});

export const BreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export default StructuredData;
