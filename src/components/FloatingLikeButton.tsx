import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FloatingLikeButtonProps {
  postId: string;
}

export const FloatingLikeButton = ({ postId }: FloatingLikeButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLikeMessage, setShowLikeMessage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchLikeData();
  }, [postId]);

  const fetchLikeData = async () => {
    try {
      // Fetch total like count
      const { count, error: countError } = await supabase
        .from("blog_post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

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
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") throw error;
        setIsLiked(!!data);
      } else {
        // Check localStorage for anonymous likes
        const likedPosts = JSON.parse(
          localStorage.getItem("likedPosts") || "[]"
        );
        setIsLiked(likedPosts.includes(postId));
      }
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;

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
            .eq("post_id", postId)
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          const likedPosts = JSON.parse(
            localStorage.getItem("likedPosts") || "[]"
          );
          const updated = likedPosts.filter((id: string) => id !== postId);
          localStorage.setItem("likedPosts", JSON.stringify(updated));
        }

        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like
        if (user) {
          const { error } = await supabase
            .from("blog_post_likes")
            .insert({ post_id: postId, user_id: user.id });

          if (error) throw error;
        } else {
          const likedPosts = JSON.parse(
            localStorage.getItem("likedPosts") || "[]"
          );
          likedPosts.push(postId);
          localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        }

        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        setShowLikeMessage(true);
        setTimeout(() => setShowLikeMessage(false), 3000);
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {showLikeMessage && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in mb-2">
          Thank you! ❤️
        </div>
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
          <span className="absolute -top-2 -right-2 bg-background border border-border rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
            {likeCount}
          </span>
        )}
      </Button>
    </div>
  );
};
