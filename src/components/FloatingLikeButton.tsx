import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FloatingLikeButtonProps {
  likeCount: number;
  isLiked: boolean;
  isLoading: boolean;
  onLike: () => void;
}

export const FloatingLikeButton = ({
  likeCount,
  isLiked,
  isLoading,
  onLike,
}: FloatingLikeButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [countIncreased, setCountIncreased] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [prevLikeCount, setPrevLikeCount] = useState(likeCount);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Trigger animations when like count increases
    if (likeCount > prevLikeCount) {
      setShowLikeMessage(true);
      setCountIncreased(true);
      setShowBurst(true);
      setTimeout(() => setShowLikeMessage(false), 3000);
      setTimeout(() => setCountIncreased(false), 600);
      setTimeout(() => setShowBurst(false), 1000);
    }
    setPrevLikeCount(likeCount);
  }, [likeCount]);

  const handleLike = () => {
    if (isLoading) return;
    onLike();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {showLikeMessage && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in mb-2">
          Thank you for liking this post!
        </div>
      )}
      <div className="relative">
        {showBurst && (
          <>
            {[...Array(6)].map((_, i) => (
              <Heart
                key={i}
                className="absolute w-4 h-4 fill-red-500 text-red-500 pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  animation: `heartBurst 1s ease-out forwards`,
                  animationDelay: `${i * 0.05}s`,
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
                }}
              />
            ))}
          </>
        )}
        <Button
          size="lg"
          onClick={handleLike}
          disabled={isLoading}
          className={`rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform relative ${
            isLiked
              ? "bg-red-500 hover:bg-red-600 border-red-500"
              : ""
          }`}
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
        >
          <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
          {likeCount > 0 && (
            <span 
              className={`absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-background transition-all duration-300 ${
                countIncreased ? "scale-125 animate-pulse" : "scale-100"
              }`}
            >
              {likeCount}
            </span>
          )}
        </Button>
      </div>
      <style>{`
        @keyframes heartBurst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150px) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
