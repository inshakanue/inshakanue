import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  tags: string[] | null;
  reading_time_minutes: number | null;
}

export const LatestBlogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, cover_image, published_at, tags, reading_time_minutes")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching latest posts:", error);
          setError(true);
          return;
        }
        
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching latest posts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Don't render anything if there's an error
  if (error) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Latest Blog Posts</h2>
            <p className="text-muted-foreground">
              Insights, thoughts, and learnings from my journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-muted rounded-t-lg" />
                <CardHeader className="pb-3">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-8 fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Latest Blog Posts</h2>
          <p className="text-muted-foreground">
            Insights, thoughts, and learnings from my journey
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {post.cover_image && post.cover_image.startsWith('http') && (
                  <div className="overflow-hidden h-40">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    {post.reading_time_minutes && post.reading_time_minutes > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.reading_time_minutes} min</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={`${tag}-${idx}`} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center fade-in-up">
          <Button asChild className="gap-2">
            <Link to="/blog">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};