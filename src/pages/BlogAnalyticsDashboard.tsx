import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { ArrowLeft, ArrowUpDown, CalendarIcon, X, Download, Eye, Heart, Share2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
type DateFilter = 'all' | 'last7' | 'last30' | 'custom';

const BlogAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: authLoading, user } = useAdminStatus();
  
  const [posts, setPosts] = useState<BlogPostAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('published_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [resumeDownloads, setResumeDownloads] = useState(0);

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
  }, [isAdmin, authLoading, dateFilter, customStartDate, customEndDate]);

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined = now;

    switch (dateFilter) {
      case 'last7':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        startDate = customStartDate;
        endDate = customEndDate || now;
        break;
      case 'all':
      default:
        startDate = undefined;
        endDate = undefined;
    }

    return { startDate, endDate };
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();

      // Fetch resume downloads count
      let resumeQuery = supabase
        .from("resume_downloads")
        .select("*", { count: "exact", head: true });
      
      if (startDate) {
        resumeQuery = resumeQuery.gte("downloaded_at", startDate.toISOString());
      }
      if (endDate) {
        resumeQuery = resumeQuery.lte("downloaded_at", endDate.toISOString());
      }
      
      const { count: resumeCount } = await resumeQuery;
      setResumeDownloads(resumeCount || 0);

      // Fetch all blog posts
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select("id, title, slug, published, published_at")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Fetch analytics for each post
      const analyticsPromises = (postsData || []).map(async (post) => {
        // Build query with date filtering
        let viewsQuery = supabase
          .from("blog_post_views")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        
        if (startDate) {
          viewsQuery = viewsQuery.gte("viewed_at", startDate.toISOString());
        }
        if (endDate) {
          viewsQuery = viewsQuery.lte("viewed_at", endDate.toISOString());
        }
        
        const { count: viewsCount } = await viewsQuery;

        // Get likes count with date filtering
        let likesQuery = supabase
          .from("blog_post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        
        if (startDate) {
          likesQuery = likesQuery.gte("created_at", startDate.toISOString());
        }
        if (endDate) {
          likesQuery = likesQuery.lte("created_at", endDate.toISOString());
        }
        
        const { count: likesCount } = await likesQuery;

        // Get shares by platform with date filtering
        let sharesQuery = supabase
          .from("blog_post_shares")
          .select("platform")
          .eq("post_id", post.id);
        
        if (startDate) {
          sharesQuery = sharesQuery.gte("shared_at", startDate.toISOString());
        }
        if (endDate) {
          sharesQuery = sharesQuery.lte("shared_at", endDate.toISOString());
        }
        
        const { data: sharesData } = await sharesQuery;

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

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="card-elevated">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resume Downloads</p>
                    <p className="text-2xl font-bold">{resumeDownloads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.views, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                    <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.likes, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Share2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Shares</p>
                    <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.total_shares, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-3xl">Blog Post Analytics</CardTitle>
              <p className="text-muted-foreground">Track views, likes, and shares for all blog posts</p>
              
              {/* Date Filter Controls */}
              <div className="flex flex-wrap gap-2 mt-6">
                <Button
                  variant={dateFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilter('all')}
                >
                  All Time
                </Button>
                <Button
                  variant={dateFilter === 'last7' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilter('last7')}
                >
                  Last 7 Days
                </Button>
                <Button
                  variant={dateFilter === 'last30' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateFilter('last30')}
                >
                  Last 30 Days
                </Button>
                
                {/* Custom Date Range */}
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={dateFilter === 'custom' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "justify-start text-left font-normal",
                          !customStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, "MMM d, yyyy") : "Start Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={(date) => {
                          setCustomStartDate(date);
                          if (date) setDateFilter('custom');
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <span className="text-muted-foreground">to</span>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={dateFilter === 'custom' ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          "justify-start text-left font-normal",
                          !customEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? format(customEndDate, "MMM d, yyyy") : "End Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={(date) => {
                          setCustomEndDate(date);
                          if (date) setDateFilter('custom');
                        }}
                        disabled={(date) => customStartDate ? date < customStartDate : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {dateFilter === 'custom' && (customStartDate || customEndDate) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCustomStartDate(undefined);
                        setCustomEndDate(undefined);
                        setDateFilter('all');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
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
