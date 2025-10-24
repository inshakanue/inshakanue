import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a signed URL for a private storage file
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param expiresIn - Time in seconds until the URL expires (default: 1 hour)
 * @returns Signed URL or null if error
 */
export async function getSignedUrl(
  bucket: string,
  path: string | null,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!path) return null;

  // If it's already a full URL, return as-is (for backwards compatibility with old public URLs)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}

/**
 * Hook to generate and cache signed URLs for blog cover images
 * @param imagePath - The storage path of the image
 * @returns Signed URL or null
 */
export async function getBlogCoverUrl(imagePath: string | null): Promise<string | null> {
  return getSignedUrl('blog-covers', imagePath, 86400); // 24 hours
}
