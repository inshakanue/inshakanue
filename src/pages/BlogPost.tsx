import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData, { createBlogPostSchema } from "@/components/StructuredData";
import RelatedPosts from "@/components/RelatedPosts";
import { SocialPreview } from "@/components/SocialPreview";
import { SocialShare } from "@/components/SocialShare";
import { FloatingShareButton } from "@/components/FloatingShareButton";
import { FloatingLikeButton } from "@/components/FloatingLikeButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Edit, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addInternalLinks } from "@/utils/internalLinking";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { getBlogCoverUrl } from "@/utils/storageHelpers";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
  tags: string[];
  reading_time_minutes: number;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, loading: isAdminLoading } = useAdminStatus();
  
  // Shared like state
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (slug && !isAdminLoading) {
      fetchPost();
    }
  }, [slug, isAdmin, isAdminLoading]);

  useEffect(() => {
    if (post?.id) {
      fetchLikeData();
    }
  }, [post?.id]);

  const fetchLikeData = async () => {
    if (!post?.id) return;
    
    try {
      // Fetch total like count
      const { count, error: countError } = await supabase
        .from("blog_post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      if (countError) throw countError;
      setLikeCount(count || 0);

      // Check if current user has liked
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("blog_post_likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") throw error;
        setIsLiked(!!data);
      } else {
        // Check localStorage for anonymous likes
        const likedPosts = JSON.parse(
          localStorage.getItem("likedPosts") || "[]"
        );
        setIsLiked(likedPosts.includes(post.id));
      }
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  const handleLike = async () => {
    if (isLoading || !post?.id) return;

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isLiked) {
        // Unlike
        if (user) {
          const { error } = await supabase
            .from("blog_post_likes")
            .delete()
            .eq("post_id", post.id)
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          const likedPosts = JSON.parse(
            localStorage.getItem("likedPosts") || "[]"
          );
          const updated = likedPosts.filter((id: string) => id !== post.id);
          localStorage.setItem("likedPosts", JSON.stringify(updated));
        }

        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like
        if (user) {
          const { error } = await supabase
            .from("blog_post_likes")
            .insert({ post_id: post.id, user_id: user.id });

          if (error) throw error;
        } else {
          const likedPosts = JSON.parse(
            localStorage.getItem("likedPosts") || "[]"
          );
          likedPosts.push(post.id);
          localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        }

        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error: any) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPost = async () => {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug);
      
      // If not admin, filter to published only
      if (!isAdmin) {
        query = query.eq("published", true);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error || !data) throw error || new Error("Post not found");
      setPost(data);
      
      // Generate URL for cover image using storage helper (handles public URLs and signed URLs)
      if (data.cover_image) {
        try {
          const signed = await getBlogCoverUrl(data.cover_image);
          setCoverImageUrl(signed ?? null);
        } catch (err) {
          // Fallback: if the stored value is already a full URL, use it directly
          if (data.cover_image.startsWith('http')) {
            setCoverImageUrl(data.cover_image);
          } else {
            setCoverImageUrl(null);
          }
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching post:", error);
      }
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <SEO title="Loading..." description="Loading blog post..." />
        <div className="min-h-screen">
          <Header />
          <main className="pt-24 pb-16">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
                  <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
                  <div className="h-96 bg-muted rounded mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <SEO 
        title={`${post.title} - Insha Kanue`}
        description={post.excerpt || post.content.substring(0, 160)}
        image={coverImageUrl || undefined}
        type="article"
        article={{
          publishedTime: post.published_at || undefined,
          modifiedTime: post.created_at,
          author: post.author_name,
        }}
      />
      <SocialPreview
        title={post.title}
        description={post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        image={coverImageUrl || undefined}
        type="article"
        author={post.author_name}
        publishedTime={post.published_at || post.created_at}
        modifiedTime={post.created_at}
      />
      <StructuredData 
        data={createBlogPostSchema({
          title: post.title,
          description: post.excerpt || post.content.substring(0, 160),
          publishedAt: post.published_at || post.created_at,
          modifiedAt: post.created_at,
          author: post.author_name,
          image: coverImageUrl || undefined,
          url: window.location.href,
        })} 
      />
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <article className="container-custom">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs />
            {/* Back Button */}
            <Button variant="ghost" size="sm" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            {/* Post Header */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                {post.reading_time_minutes && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.reading_time_minutes} min read</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <span>By {post.author_name}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
              {isAdmin && (
                <div className="mt-6">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/blog/admin?edit=${post.id}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Post
                    </Link>
                  </Button>
                </div>
              )}
            </header>

            {/* Cover Image */}
            {coverImageUrl && (
              <div className="mb-12 rounded-lg overflow-hidden">
                <img
                  src={coverImageUrl}
                  alt={`Cover image for ${post.title}`}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Social Share */}
            <SocialShare
              url={window.location.href}
              title={post.title}
              description={post.excerpt || undefined}
              likeCount={likeCount}
              isLiked={isLiked}
              isLoading={isLoading}
              onLike={handleLike}
            />

            {/* Post Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert mt-8">
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(
                    addInternalLinks(post.content, window.location.pathname),
                    { ADD_ATTR: ['target'] }
                  )
                }}
              />
            </div>

            {/* Related Posts */}
            {post.tags && post.tags.length > 0 && (
              <RelatedPosts 
                currentPostId={post.id} 
                currentPostTags={post.tags}
                limit={3}
              />
            )}
          </div>
        </article>
        <FloatingLikeButton 
          likeCount={likeCount}
          isLiked={isLiked}
          isLoading={isLoading}
          onLike={handleLike}
        />
        <FloatingShareButton
          url={window.location.href}
          title={post.title}
          description={post.excerpt || undefined}
        />
      </main>
      <Footer />
    </div>
  </>
  );
};

export default BlogPost;
