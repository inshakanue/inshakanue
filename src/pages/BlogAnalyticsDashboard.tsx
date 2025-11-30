import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { ArrowLeft, ArrowUpDown } from "lucide-react";

interface BlogPostAnalytics {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  published_at: string | null;
  views: number;
  likes: number;
  total_shares: number;
  linkedin_shares: number;
  twitter_shares: number;
  bluesky_shares: number;
  whatsapp_shares: number;
  link_copies: number;
}

type SortField = 'title' | 'views' | 'likes' | 'total_shares' | 'published_at';
type SortDirection = 'asc' | 'desc';

const BlogAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: authLoading, user } = useAdminStatus();
  
  const [posts, setPosts] = useState<BlogPostAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('published_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the analytics dashboard.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!authLoading && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have admin privileges to access this page.",
        variant: "destructive",
      });
      navigate("/blog");
      return;
    }
  }, [authLoading, isAdmin, user, navigate, toast]);

  useEffect(() => {
    if (isAdmin && !authLoading) {
      fetchAnalytics();
    }
  }, [isAdmin, authLoading]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all blog posts
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select("id, title, slug, published, published_at")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Fetch analytics for each post
      const analyticsPromises = (postsData || []).map(async (post) => {
        // Get views count
        const { count: viewsCount } = await supabase
          .from("blog_post_views")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        // Get likes count
        const { count: likesCount } = await supabase
          .from("blog_post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        // Get shares by platform
        const { data: sharesData } = await supabase
          .from("blog_post_shares")
          .select("platform")
          .eq("post_id", post.id);

        const linkedin = sharesData?.filter(s => s.platform === 'linkedin').length || 0;
        const twitter = sharesData?.filter(s => s.platform === 'twitter').length || 0;
        const bluesky = sharesData?.filter(s => s.platform === 'bluesky').length || 0;
        const whatsapp = sharesData?.filter(s => s.platform === 'whatsapp').length || 0;
        const copyLink = sharesData?.filter(s => s.platform === 'copy_link').length || 0;

        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          published: post.published,
          published_at: post.published_at,
          views: viewsCount || 0,
          likes: likesCount || 0,
          total_shares: (sharesData?.length || 0),
          linkedin_shares: linkedin,
          twitter_shares: twitter,
          bluesky_shares: bluesky,
          whatsapp_shares: whatsapp,
          link_copies: copyLink,
        };
      });

      const analyticsData = await Promise.all(analyticsPromises);
      setPosts(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle null dates
    if (sortField === 'published_at') {
      if (!aVal) return 1;
      if (!bVal) return -1;
      aVal = new Date(aVal as string).getTime();
      bVal = new Date(bVal as string).getTime();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-custom">
            <div className="flex justify-center items-center min-h-[50vh]">
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link to="/blog/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog Admin
            </Link>
          </Button>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-3xl">Blog Post Analytics Dashboard</CardTitle>
              <p className="text-muted-foreground">Track views, likes, and shares for all blog posts</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('title')}
                          className="font-semibold"
                        >
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-center p-4">Status</th>
                      <th className="text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('published_at')}
                          className="font-semibold"
                        >
                          Published
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('views')}
                          className="font-semibold"
                        >
                          Views
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('likes')}
                          className="font-semibold"
                        >
                          Likes
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('total_shares')}
                          className="font-semibold"
                        >
                          Total Shares
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-center p-4">LinkedIn</th>
                      <th className="text-center p-4">Twitter</th>
                      <th className="text-center p-4">Bluesky</th>
                      <th className="text-center p-4">WhatsApp</th>
                      <th className="text-center p-4">Link Copies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPosts.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center p-8 text-muted-foreground">
                          No blog posts found
                        </td>
                      </tr>
                    ) : (
                      sortedPosts.map((post) => (
                        <tr key={post.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <Link
                              to={`/blog/${post.slug}`}
                              className="hover:text-primary transition-colors font-medium"
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                post.published
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="p-4 text-center text-sm text-muted-foreground">
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="p-4 text-center font-semibold">{post.views}</td>
                          <td className="p-4 text-center font-semibold">{post.likes}</td>
                          <td className="p-4 text-center font-semibold">{post.total_shares}</td>
                          <td className="p-4 text-center text-muted-foreground">{post.linkedin_shares}</td>
                          <td className="p-4 text-center text-muted-foreground">{post.twitter_shares}</td>
                          <td className="p-4 text-center text-muted-foreground">{post.bluesky_shares}</td>
                          <td className="p-4 text-center text-muted-foreground">{post.whatsapp_shares}</td>
                          <td className="p-4 text-center text-muted-foreground">{post.link_copies}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogAnalyticsDashboard;
