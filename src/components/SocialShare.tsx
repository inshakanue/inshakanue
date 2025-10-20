import { Button } from "@/components/ui/button";
import { Linkedin, Twitter } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = description ? encodeURIComponent(`${title} - ${description}`) : encodedTitle;

  const handleShare = (platform: 'linkedin' | 'twitter') => {
    let shareUrl = '';
    
    if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-3 py-6 border-y border-border">
      <span className="text-sm font-medium text-muted-foreground">Share on:</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('linkedin')}
          className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
          aria-label="Share on X (Twitter)"
        >
          <Twitter className="w-4 h-4" />
          X
        </Button>
      </div>
    </div>
  );
};
