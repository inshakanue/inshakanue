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
  const whatsappText = encodeURIComponent(`${title}${description ? ' - ' + description : ''} ${url}`);
  
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

  const handleShare = (platform: 'linkedin' | 'twitter' | 'bluesky' | 'whatsapp') => {
    let shareUrl = '';
    
    if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`;
    } else if (platform === 'whatsapp') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      shareUrl = isMobile
        ? `https://wa.me/?text=${whatsappText}`
        : `https://web.whatsapp.com/send?text=${whatsappText}`;
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
          <div className="absolute top-full left-0 mt-2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-top-2 z-50">
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
            onClick={() => handleShare('whatsapp')}
            className="gap-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
            aria-label="Share on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 .008 5.374.008 12c0 2.116.553 4.09 1.606 5.86L0 24l6.435-1.67A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.198-1.25-6.21-3.48-8.52zM12 21.5c-1.77 0-3.427-.47-4.86-1.287l-.348-.198-3.82.99.995-3.718-.21-.375A8.25 8.25 0 013.75 12.0 8.25 8.25 0 1112 20.5zM17.02 14.24c-.27-.135-1.593-.786-1.84-.875-.246-.09-.426-.135-.605.135-.18.27-.695.875-.85 1.055-.155.18-.31.202-.575.068-.265-.135-1.12-.41-2.13-1.312-.79-.704-1.32-1.574-1.475-1.85-.155-.27-.017-.415.12-.55.123-.123.27-.31.405-.465.135-.155.18-.27.27-.45.09-.18 0-.337-.036-.472-.036-.135-.605-1.456-.83-1.99-.22-.535-.445-.46-.605-.47l-.515-.009c-.17 0-.445.064-.68.31-.235.245-.9.88-.9 2.145 0 1.264.925 2.485 1.055 2.656.135.17 1.82 2.78 4.41 3.9 3.085 1.33 3.85 1.07 4.54.995.69-.08 2.225-.905 2.54-1.776.315-.87.315-1.62.22-1.775-.09-.155-.315-.245-.585-.38z" />
            </svg>
            <span className="hidden xs:inline">WhatsApp</span>
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
