import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Link, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { trackBlogShare } from "@/utils/analyticsTracking";
import blueskyIcon from "@/assets/bluesky-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.svg";
import { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  likeCount: number;
  isLiked: boolean;
  isLoading: boolean;
  onLike: () => void;
  postId: string;
}

export const SocialShare = ({
  url,
  title,
  description,
  likeCount,
  isLiked,
  isLoading,
  onLike,
  postId,
}: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = description
    ? encodeURIComponent(`${title} - ${description}`)
    : encodedTitle;
  
  // Use og-meta-tags edge function URL for social platforms that need server-rendered meta tags
  const getOgUrl = () => {
    const pathname = new URL(url).pathname;
    return `https://vqazbygfeagufizgfdcl.supabase.co/functions/v1/og-meta-tags?path=${encodeURIComponent(pathname)}`;
  };
  
  const ogUrl = getOgUrl();
  const encodedOgUrl = encodeURIComponent(ogUrl);
  
  const whatsappText = encodeURIComponent(
    `${title}${description ? " - " + description : ""}\n${ogUrl}`
  );

  const [showLikeMessage, setShowLikeMessage] = useState(false);

  const handleLike = () => {
    onLike();
    setShowLikeMessage(true);
    setTimeout(() => setShowLikeMessage(false), 3000);
  };

  const handleShare = (
    platform: "linkedin" | "twitter" | "bluesky" | "whatsapp"
  ) => {
    let shareUrl = "";

    if (platform === "linkedin") {
      // LinkedIn uses OG URL for proper preview
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedOgUrl}`;
    } else if (platform === "twitter") {
      // Twitter/X uses OG URL for proper card preview with cover image
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedOgUrl}&text=${shareText}`;
    } else if (platform === "whatsapp") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      shareUrl = isMobile
        ? `https://wa.me/?text=${whatsappText}`
        : `https://web.whatsapp.com/send?text=${whatsappText}`;
    } else {
      // Bluesky uses OG URL for proper preview
      shareUrl = `https://bsky.app/intent/compose?text=${shareText}%20${encodedOgUrl}`;
    }

    // Track the share
    trackBlogShare(postId, platform);
    
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      
      // Track copy link as a share
      trackBlogShare(postId, "copy_link");
      
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
            onClick={() => handleShare("linkedin")}
            className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden xs:inline">LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
            aria-label="Share on X (Twitter)"
          >
            <Twitter className="w-4 h-4" />
            <span className="hidden xs:inline">X</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("whatsapp")}
            className="gap-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
            aria-label="Share on WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
            <span className="hidden xs:inline">WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("bluesky")}
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
