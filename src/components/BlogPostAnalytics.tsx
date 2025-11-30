import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Eye, Heart, Share2, Linkedin, Twitter } from "lucide-react";
import blueskyIcon from "@/assets/bluesky-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.svg";

interface BlogPostAnalyticsProps {
  postId: string;
}

interface AnalyticsData {
  views: number;
  likes: number;
  shares: {
    linkedin: number;
    twitter: number;
    bluesky: number;
    whatsapp: number;
    copy_link: number;
  };
}

export const BlogPostAnalytics = ({ postId }: BlogPostAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    views: 0,
    likes: 0,
    shares: {
      linkedin: 0,
      twitter: 0,
      bluesky: 0,
      whatsapp: 0,
      copy_link: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    // Set up realtime subscriptions for live updates
    const likesChannel = supabase
      .channel(`analytics_likes:${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_post_likes',
          filter: `post_id=eq.${postId}`
        },
        () => fetchAnalytics()
      )
      .subscribe();

    const viewsChannel = supabase
      .channel(`analytics_views:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blog_post_views',
          filter: `post_id=eq.${postId}`
        },
        () => fetchAnalytics()
      )
      .subscribe();

    const sharesChannel = supabase
      .channel(`analytics_shares:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blog_post_shares',
          filter: `post_id=eq.${postId}`
        },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(viewsChannel);
      supabase.removeChannel(sharesChannel);
    };
  }, [postId]);

  const fetchAnalytics = async () => {
    try {
      // Fetch views count
      const { count: viewsCount } = await supabase
        .from("blog_post_views")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      // Fetch likes count
      const { count: likesCount } = await supabase
        .from("blog_post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      // Fetch shares by platform
      const { data: sharesData } = await supabase
        .from("blog_post_shares")
        .select("platform")
        .eq("post_id", postId);

      const sharesByPlatform = {
        linkedin: 0,
        twitter: 0,
        bluesky: 0,
        whatsapp: 0,
        copy_link: 0,
      };

      sharesData?.forEach((share) => {
        const platform = share.platform as keyof typeof sharesByPlatform;
        sharesByPlatform[platform]++;
      });

      setAnalytics({
        views: viewsCount || 0,
        likes: likesCount || 0,
        shares: sharesByPlatform,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 mb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  const totalShares = Object.values(analytics.shares).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-primary" />
        Post Analytics (Admin Only)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-background/80 backdrop-blur rounded-lg p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="text-2xl font-bold">{analytics.views.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-background/80 backdrop-blur rounded-lg p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-500/10">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Likes</p>
              <p className="text-2xl font-bold">{analytics.likes.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-background/80 backdrop-blur rounded-lg p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <Share2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Shares</p>
              <p className="text-2xl font-bold">{totalShares.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background/80 backdrop-blur rounded-lg p-4 border border-border">
        <p className="text-sm font-medium mb-3 text-muted-foreground">Shares by Platform</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            <span className="text-sm">LinkedIn: <strong>{analytics.shares.linkedin}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            <span className="text-sm">X: <strong>{analytics.shares.twitter}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <img src={blueskyIcon} alt="Bluesky" className="w-4 h-4" />
            <span className="text-sm">Bluesky: <strong>{analytics.shares.bluesky}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
            <span className="text-sm">WhatsApp: <strong>{analytics.shares.whatsapp}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Link Copy: <strong>{analytics.shares.copy_link}</strong></span>
          </div>
        </div>
      </div>
    </Card>
  );
};
