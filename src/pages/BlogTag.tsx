import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string;
  published_at: string | null;
  tags: string[];
};

const BlogTag = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (tag) {
      fetchPostsByTag();
    }
  }, [tag]);

  const fetchPostsByTag = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image, author_name, published_at, tags')
        .eq('published', true)
        .contains('tags', [tag])
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const tagDisplayName = tag?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  return (
    <>
      <SEO 
        title={`${tagDisplayName} Articles - Insha Kanue Blog`}
        description={`Read all articles about ${tagDisplayName} by Insha Kanue. Expert insights on AI product management and technology.`}
      />
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <Breadcrumbs />
              
              {/* Header */}
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Tag className="w-8 h-8 text-primary" />
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                    <span className="gradient-text">{tagDisplayName}</span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with "{tagDisplayName}"
                </p>
              </div>

              {/* Posts Grid */}
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="card-elevated animate-pulse">
                      <div className="h-48 bg-muted rounded-t-lg"></div>
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <Card className="card-elevated text-center py-12">
                  <CardContent>
                    <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground mb-4">
                      No articles found with this tag.
                    </p>
                    <Button asChild>
                      <Link to="/blog">Browse All Articles</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <Card
                      key={post.id}
                      className="card-elevated fade-in-up hover:scale-105 transition-transform duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {post.cover_image && (
                        <div className="h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.tags.map((postTag) => (
                            <Badge key={postTag} variant="secondary" className="text-xs">
                              {postTag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="line-clamp-2 hover:gradient-text transition-all duration-300">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <Button variant="ghost" size="sm" asChild className="group">
                          <Link to={`/blog/${post.slug}`}>
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogTag;
