-- Create storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-covers',
  'blog-covers',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- RLS policies for blog-covers bucket
CREATE POLICY "Anyone can view blog cover images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-covers');

CREATE POLICY "Admins can upload blog cover images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog-covers' AND
  is_admin(auth.uid())
);

CREATE POLICY "Admins can update blog cover images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'blog-covers' AND
  is_admin(auth.uid())
);

CREATE POLICY "Admins can delete blog cover images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog-covers' AND
  is_admin(auth.uid())
);