import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import TagCloud from "@/components/TagCloud";
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
  tags: string[];
  reading_time_minutes: number;
};
const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminStatus();
  const { toast } = useToast();
  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("blog_posts").select("id, title, slug, excerpt, cover_image, author_name, published_at, created_at, tags, reading_time_minutes").eq("published", true).order("published_at", {
        ascending: false
      });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching posts:", error);
      }
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return (
    <>
      <SEO 
        title="Blog - Insha Kanue | AI Product Management Insights"
        description="Insights on Data/AI product management, machine learning, and technology leadership from an experienced AI Product Manager."
      />
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <Breadcrumbs />
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                My <span className="gradient-text">Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Insights on Data/AI product management and technology leadership</p>
              {isAdmin && (
                <Button asChild>
                  <Link to="/blog/admin">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Write New Post
                  </Link>
                </Button>
              )}
            </div>

            {/* Blog Posts Grid */}
            {loading ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <Card key={i} className="card-elevated animate-pulse">
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
                  </Card>)}
              </div> : posts.length === 0 ? <Card className="card-elevated text-center py-12">
                <CardContent>
                  <p className="text-xl text-muted-foreground mb-4">
                    No blog posts yet. Check back soon!
                  </p>
                  {isAdmin && (
                    <Button asChild>
                      <Link to="/blog/admin">Write your first post</Link>
                    </Button>
                  )}
                </CardContent>
              </Card> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => <Card key={post.id} className="card-elevated fade-in-up hover:scale-105 transition-transform duration-300" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                    {post.cover_image && <div className="h-48 overflow-hidden rounded-t-lg">
                        <img src={post.cover_image} alt={`Cover image for ${post.title}`} className="w-full h-full object-cover" loading="lazy" />
                      </div>}
                    <CardHeader>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Link to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                                {tag}
                              </Link>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <CardTitle className="line-clamp-2 hover:gradient-text transition-all duration-300">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.published_at)}</span>
                        {post.reading_time_minutes && (
                          <>
                            <span>•</span>
                            <Clock className="w-4 h-4" />
                            <span>{post.reading_time_minutes} min read</span>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {post.excerpt && <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>}
                      <Button variant="ghost" size="sm" asChild className="group">
                        <Link to={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>)}
              </div>}

              {/* Tag Cloud */}
              <TagCloud />
          </div>
        </div>
        </main>
        <Footer />
      </div>
    </>
  );
};
export default Blog;