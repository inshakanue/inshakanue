-- Make blog_covers bucket public for social media previews
UPDATE storage.buckets 
SET public = true 
WHERE id = 'blog_covers';

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public read access for blog covers" ON storage.objects;

-- Create policy to allow public read access to blog covers
CREATE POLICY "Public read access for blog covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog_covers');