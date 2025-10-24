import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { getBlogCoverUrl } from '@/utils/storageHelpers';

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  tags: string[];
};

interface RelatedPostsProps {
  currentPostId: string;
  currentPostTags: string[];
  limit?: number;
}

const RelatedPosts = ({ currentPostId, currentPostTags, limit = 3 }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId, currentPostTags]);

  const fetchRelatedPosts = async () => {
    try {
      // Fetch posts that share tags with the current post
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image, published_at, tags')
        .eq('published', true)
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(limit * 3); // Fetch more to filter by tags

      if (error) throw error;

      // Score posts by tag overlap
      const scoredPosts = (data || [])
        .map(post => {
          const tagOverlap = post.tags?.filter(tag => currentPostTags.includes(tag)).length || 0;
          return { ...post, score: tagOverlap };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      setPosts(scoredPosts);
      
      // Generate signed URLs for cover images
      const urls: Record<string, string> = {};
      await Promise.all(
        scoredPosts.map(async (post) => {
          if (post.cover_image) {
            const url = await getBlogCoverUrl(post.cover_image);
            if (url) urls[post.id] = url;
          }
        })
      );
      setSignedUrls(urls);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading || posts.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t">
      <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="card-elevated hover:scale-105 transition-transform duration-300">
            {signedUrls[post.id] && (
              <div className="h-40 overflow-hidden rounded-t-lg">
                <img 
                  src={signedUrls[post.id]} 
                  alt={`Cover image for ${post.title}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2 text-lg">
                <Link to={`/blog/${post.slug}`} className="hover:gradient-text transition-all duration-300">
                  {post.title}
                </Link>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            </CardHeader>
            <CardContent>
              {post.excerpt && (
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <Button variant="ghost" size="sm" asChild className="group p-0 h-auto">
                <Link to={`/blog/${post.slug}`}>
                  Read More
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
