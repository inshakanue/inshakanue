-- Create table to track blog post views
CREATE TABLE public.blog_post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track blog post shares
CREATE TABLE public.blog_post_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'bluesky', 'whatsapp', 'copy_link')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_post_views
CREATE POLICY "Anyone can insert views"
  ON public.blog_post_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all views"
  ON public.blog_post_views
  FOR SELECT
  USING (is_admin(auth.uid()));

-- RLS Policies for blog_post_shares
CREATE POLICY "Anyone can insert shares"
  ON public.blog_post_shares
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all shares"
  ON public.blog_post_shares
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_blog_post_views_post_id ON public.blog_post_views(post_id);
CREATE INDEX idx_blog_post_views_viewed_at ON public.blog_post_views(viewed_at);
CREATE INDEX idx_blog_post_shares_post_id ON public.blog_post_shares(post_id);
CREATE INDEX idx_blog_post_shares_platform ON public.blog_post_shares(platform);
CREATE INDEX idx_blog_post_shares_shared_at ON public.blog_post_shares(shared_at);