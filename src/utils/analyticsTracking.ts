import { supabase } from "@/integrations/supabase/client";

// Track a blog post view
export const trackBlogView = async (postId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("blog_post_views")
      .insert({
        post_id: postId,
        user_id: user?.id || null,
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error("Error tracking view:", error);
    }
  } catch (error) {
    console.error("Error tracking view:", error);
  }
};

// Track a social media share
export const trackBlogShare = async (
  postId: string,
  platform: "linkedin" | "twitter" | "bluesky" | "whatsapp" | "copy_link"
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("blog_post_shares")
      .insert({
        post_id: postId,
        platform,
        user_id: user?.id || null,
      });

    if (error) {
      console.error("Error tracking share:", error);
    }
  } catch (error) {
    console.error("Error tracking share:", error);
  }
};

// Track a resume download
export const trackResumeDownload = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("resume_downloads")
      .insert({
        user_id: user?.id || null,
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error("Error tracking resume download:", error);
    }
  } catch (error) {
    console.error("Error tracking resume download:", error);
  }
};
