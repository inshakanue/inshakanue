import { supabase } from '@/integrations/supabase/client';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generates a dynamic sitemap with all blog posts and pages
 */
export const generateSitemap = async (): Promise<string> => {
  const baseUrl = window.location.origin;
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push(
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9,
    }
  );

  try {
    // Fetch all published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, tags')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && posts) {
      posts.forEach((post) => {
        urls.push({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.updated_at || post.published_at || new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.8,
        });
      });

      // Fetch all unique tags
      const allTags = new Set<string>();
      posts.forEach((post: any) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => allTags.add(tag));
        }
      });

      // Add tag pages to sitemap
      allTags.forEach((tag) => {
        urls.push({
          loc: `${baseUrl}/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
};

/**
 * Downloads the generated sitemap as an XML file
 */
export const downloadSitemap = async () => {
  const xml = await generateSitemap();
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
