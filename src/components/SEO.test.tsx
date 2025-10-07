import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import SEO from '@/components/SEO';

describe('SEO Component', () => {
  it('should render meta tags with correct title', () => {
    render(
      <SEO 
        title="Test Page" 
        description="Test description"
      />
    );
    
    // Check if document title is updated
    expect(document.title).toContain('Test Page');
  });

  it('should include brand name in title', () => {
    render(
      <SEO 
        title="Product Management" 
        description="Test description"
      />
    );
    
    expect(document.title).toContain('Insha Kanue');
  });

  it('should set canonical URL', () => {
    render(
      <SEO 
        title="Test" 
        description="Test"
      />
    );
    
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toBeTruthy();
  });

  it('should set Open Graph tags', () => {
    render(
      <SEO 
        title="Test Page" 
        description="Test description"
        image="/test-image.jpg"
      />
    );
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    expect(ogTitle?.getAttribute('content')).toContain('Test Page');
    expect(ogDescription?.getAttribute('content')).toBe('Test description');
    expect(ogImage?.getAttribute('content')).toContain('/test-image.jpg');
  });

  it('should set Twitter Card tags', () => {
    render(
      <SEO 
        title="Test Page" 
        description="Test description"
      />
    );
    
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    
    expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
    expect(twitterTitle?.getAttribute('content')).toContain('Test Page');
  });
});
