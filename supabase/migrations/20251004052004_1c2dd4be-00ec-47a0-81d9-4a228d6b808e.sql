-- Add tags column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN tags text[] DEFAULT '{}';

-- Create index for better tag search performance
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- Add reading_time_minutes column for better UX
ALTER TABLE public.blog_posts 
ADD COLUMN reading_time_minutes integer DEFAULT 5;