import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, X, Linkedin, Twitter, Link } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import blueskyIcon from "@/assets/bluesky-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.svg";

interface FloatingShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export const FloatingShareButton = ({
  url,
  title,
  description,
}: FloatingShareButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
      // Auto-collapse when scrolling
      if (isExpanded && window.scrollY > 300) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = description
    ? encodeURIComponent(`${title} - ${description}`)
    : encodedTitle;
  const whatsappText = encodeURIComponent(
    `${title}${description ? " - " + description : ""} ${url}`
  );

  const handleShare = (
    platform: "linkedin" | "twitter" | "bluesky" | "whatsapp"
  ) => {
    let shareUrl = "";

    if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`;
    } else if (platform === "whatsapp") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      shareUrl = isMobile
        ? `https://wa.me/?text=${whatsappText}`
        : `https://web.whatsapp.com/send?text=${whatsappText}`;
    } else {
      shareUrl = `https://bsky.app/intent/compose?text=${shareText}%20${encodedUrl}`;
    }

    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
    setIsExpanded(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The blog post link has been copied to your clipboard.",
      });
      setIsExpanded(false);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isExpanded && (
        <div className="flex flex-col gap-2 bg-background border border-border rounded-lg p-3 shadow-lg animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2 hover:bg-accent hover:text-accent-foreground transition-colors justify-start"
            aria-label="Copy link to clipboard"
          >
            <Link className="w-4 h-4" />
            <span>Copy link</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("linkedin")}
            className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors justify-start"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors justify-start"
            aria-label="Share on X (Twitter)"
          >
            <Twitter className="w-4 h-4" />
            <span>X</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("whatsapp")}
            className="gap-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors justify-start"
            aria-label="Share on WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
            <span>WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("bluesky")}
            className="gap-2 hover:bg-[#0085ff] hover:text-white hover:border-[#0085ff] transition-colors justify-start"
            aria-label="Share on Bluesky"
          >
            <img src={blueskyIcon} alt="Bluesky" className="w-5 h-5" />
            <span>Bluesky</span>
          </Button>
        </div>
      )}
      <Button
        size="lg"
        onClick={() => setIsExpanded(!isExpanded)}
        className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
        aria-label={isExpanded ? "Close share menu" : "Open share menu"}
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Share2 className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};
