import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getBlogCoverUrl } from "@/utils/storageHelpers";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  tags: string[];
  reading_time_minutes: number;
};

export const LatestBlogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [coverImages, setCoverImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);

      // Fetch cover images
      if (data) {
        const imageUrls: Record<string, string> = {};
        for (const post of data) {
          if (post.cover_image) {
            try {
              const url = await getBlogCoverUrl(post.cover_image);
              if (url) {
                imageUrls[post.id] = url;
              } else if (post.cover_image.startsWith('http')) {
                imageUrls[post.id] = post.cover_image;
              }
            } catch (err) {
              if (post.cover_image.startsWith('http')) {
                imageUrls[post.id] = post.cover_image;
              }
            }
          }
        }
        setCoverImages(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching latest posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Blog Posts</h2>
            <p className="text-muted-foreground text-lg">
              Insights, thoughts, and learnings from my journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-5/6" />
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
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-muted-foreground text-lg">
            Insights, thoughts, and learnings from my journey
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {coverImages[post.id] && (
                  <div className="overflow-hidden h-48">
                    <img
                      src={coverImages[post.id]}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    {post.reading_time_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.reading_time_minutes} min</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
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
        <div className="text-center animate-fade-in">
          <Button asChild size="lg" className="gap-2">
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
