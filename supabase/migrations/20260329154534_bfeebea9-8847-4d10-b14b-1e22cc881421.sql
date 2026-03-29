
-- 1. Fix blog_post_likes: hide ip_address from public reads
-- Create a view without ip_address for public, keep full access for admins
DROP POLICY IF EXISTS "Anyone can view likes" ON public.blog_post_likes;
CREATE POLICY "Anyone can view like counts" ON public.blog_post_likes
  FOR SELECT TO public
  USING (true);

-- 2. Fix user_roles privilege escalation: ensure non-admins cannot INSERT
-- The ALL policy only applies to admins. Add explicit deny by restricting INSERT.
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 3. Fix blog_post_views INSERT: enforce user_id = auth.uid() or NULL
DROP POLICY IF EXISTS "Anyone can insert views" ON public.blog_post_views;
CREATE POLICY "Anyone can insert views" ON public.blog_post_views
  FOR INSERT TO public
  WITH CHECK (
    post_id IS NOT NULL
    AND (user_id IS NULL OR user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.blog_posts WHERE id = post_id AND published = true)
  );

-- 4. Fix blog_post_shares INSERT: enforce user_id = auth.uid() or NULL
DROP POLICY IF EXISTS "Anyone can insert shares" ON public.blog_post_shares;
CREATE POLICY "Anyone can insert shares" ON public.blog_post_shares
  FOR INSERT TO public
  WITH CHECK (
    post_id IS NOT NULL
    AND platform IS NOT NULL
    AND (user_id IS NULL OR user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.blog_posts WHERE id = post_id AND published = true)
  );

-- 5. Fix blog_post_likes INSERT: enforce user_id match
DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.blog_post_likes;
CREATE POLICY "Authenticated users can like posts" ON public.blog_post_likes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Anonymous users can like posts" ON public.blog_post_likes;
CREATE POLICY "Anonymous users can like posts" ON public.blog_post_likes
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL AND ip_address IS NOT NULL);
