-- Make blog-covers bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'blog-covers';