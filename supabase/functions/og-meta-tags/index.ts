import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.searchParams.get('path') || '';
    
    // Check if this is a blog post URL
    const blogPostMatch = pathname.match(/^\/blog\/([^\/]+)$/);
    
    if (!blogPostMatch) {
      return new Response('Not a blog post URL', { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    const slug = blogPostMatch[1];
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      return new Response('Blog post not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Construct full URLs
    const baseUrl = 'https://inshakanue.space';
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const imageUrl = post.cover_image 
      ? `${supabaseUrl}/storage/v1/object/public/blog-images/${post.cover_image}`
      : `${baseUrl}/og-default-blog.jpg`;

    // Extract excerpt from content (first 200 chars, strip HTML)
    const excerpt = post.excerpt || 
      post.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

    // Generate HTML with Open Graph meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Insha Kanue</title>
    <meta name="description" content="${excerpt}">
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${postUrl}">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${excerpt}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Insha Kanue - AI/ML Product Manager">
    <meta property="article:author" content="${post.author_name}">
    <meta property="article:published_time" content="${post.published_at}">
    <meta property="article:modified_time" content="${post.updated_at}">
    ${post.tags?.map((tag: string) => `<meta property="article:tag" content="${tag}">`).join('\n    ')}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${postUrl}">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${excerpt}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Redirect to actual page for browsers -->
    <meta http-equiv="refresh" content="0; url=${postUrl}">
    <script>
      window.location.href = '${postUrl}';
    </script>
</head>
<body>
    <p>Redirecting to <a href="${postUrl}">${post.title}</a>...</p>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating OG tags:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
