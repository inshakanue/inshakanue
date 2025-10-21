-- Create table for blog post likes
CREATE TABLE public.blog_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_like UNIQUE(post_id, user_id),
  CONSTRAINT unique_ip_like UNIQUE(post_id, ip_address)
);

-- Create index for faster queries
CREATE INDEX idx_blog_post_likes_post_id ON public.blog_post_likes(post_id);
CREATE INDEX idx_blog_post_likes_user_id ON public.blog_post_likes(user_id);

-- Enable Row Level Security
ALTER TABLE public.blog_post_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view likes (to show counts)
CREATE POLICY "Anyone can view likes"
ON public.blog_post_likes
FOR SELECT
USING (true);

-- Policy: Authenticated users can like posts
CREATE POLICY "Authenticated users can like posts"
ON public.blog_post_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Anonymous users can like posts (tracked by IP)
CREATE POLICY "Anonymous users can like posts"
ON public.blog_post_likes
FOR INSERT
WITH CHECK (auth.uid() IS NULL AND ip_address IS NOT NULL);

-- Policy: Users can unlike their own likes
CREATE POLICY "Users can delete their own likes"
ON public.blog_post_likes
FOR DELETE
USING (
  (auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND ip_address IS NOT NULL)
);