import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Link, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import blueskyIcon from "@/assets/bluesky-icon.png";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  postId: string;
}

export const SocialShare = ({ url, title, description, postId }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = description ? encodeURIComponent(`${title} - ${description}`) : encodedTitle;
  
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLikeMessage, setShowLikeMessage] = useState(false);

  useEffect(() => {
    fetchLikeData();
  }, [postId]);

  const fetchLikeData = async () => {
    try {
      // Fetch total like count
      const { count, error: countError } = await supabase
        .from('blog_post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (countError) throw countError;
      setLikeCount(count || 0);

      // Check if current user has liked
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('blog_post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        setIsLiked(!!data);
      } else {
        // Check localStorage for anonymous likes
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        setIsLiked(likedPosts.includes(postId));
      }
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (isLiked) {
        // Unlike
        if (user) {
          const { error } = await supabase
            .from('blog_post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          // For anonymous, just update localStorage
          const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
          const updated = likedPosts.filter((id: string) => id !== postId);
          localStorage.setItem('likedPosts', JSON.stringify(updated));
        }
        
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        if (user) {
          const { error } = await supabase
            .from('blog_post_likes')
            .insert({ post_id: postId, user_id: user.id });

          if (error) throw error;
        } else {
          // For anonymous, store in localStorage
          const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
          likedPosts.push(postId);
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        }
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        setShowLikeMessage(true);
        setTimeout(() => setShowLikeMessage(false), 3000);
      }
    } catch (error: any) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (platform: 'linkedin' | 'twitter' | 'bluesky') => {
    let shareUrl = '';
    
    if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`;
    } else {
      shareUrl = `https://bsky.app/intent/compose?text=${shareText}%20${encodedUrl}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The blog post link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6 border-y border-border">
      <div className="relative">
        <Button
        variant={isLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`gap-2 transition-all ${
          isLiked 
            ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
            : "hover:bg-red-50 hover:text-red-500 hover:border-red-500"
        }`}
        aria-label={isLiked ? "Unlike this post" : "Like this post"}
      >
        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        <span className="font-medium">{likeCount}</span>
      </Button>
        {showLikeMessage && (
          <div className="absolute top-full left-0 mt-2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-top-2 z-50">
            Thank you for liking this blog post.
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Share</span>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Copy link to clipboard"
          >
            <Link className="w-4 h-4" />
            <span className="hidden xs:inline">Copy link</span>
          </Button>
          <div className="h-8 w-px bg-border" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin')}
            className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden xs:inline">LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
            aria-label="Share on X (Twitter)"
          >
            <Twitter className="w-4 h-4" />
            <span className="hidden xs:inline">X</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('bluesky')}
            className="gap-2 hover:bg-[#0085ff] hover:text-white hover:border-[#0085ff] transition-colors"
            aria-label="Share on Bluesky"
          >
            <img src={blueskyIcon} alt="Bluesky" className="w-5 h-5" />
            <span className="hidden xs:inline">Bluesky</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
