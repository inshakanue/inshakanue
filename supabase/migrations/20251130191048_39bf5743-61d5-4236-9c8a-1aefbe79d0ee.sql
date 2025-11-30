-- Enable realtime for blog_post_likes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_post_likes;

-- Set replica identity to full to capture all column data in updates
ALTER TABLE public.blog_post_likes REPLICA IDENTITY FULL;