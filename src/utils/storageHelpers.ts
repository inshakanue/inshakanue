/**
 * STORAGE HELPERS UTILITY
 * 
 * BUSINESS CONTEXT:
 * Manages secure access to private blog cover images stored in Supabase Storage.
 * These helpers generate temporary signed URLs that grant time-limited access
 * to private files without exposing the storage bucket publicly.
 * 
 * SECURITY RATIONALE:
 * - Blog covers stored in private bucket (not publicly accessible)
 * - Signed URLs expire after set time (default: 1 hour, blog covers: 24 hours)
 * - Prevents unauthorized access to storage files
 * - Provides backwards compatibility with old public URLs
 * 
 * BUSINESS VALUE:
 * - Protects content while allowing legitimate viewing
 * - Enables future features like premium content or draft posts
 * - Maintains clean separation between public and private assets
 * 
 * USAGE:
 * const coverUrl = await getBlogCoverUrl(post.cover_image);
 * <img src={coverUrl} alt="Blog cover" />
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a signed URL for a private storage file
 * 
 * HOW IT WORKS:
 * 1. Check if path is null or already a full URL (backwards compatibility)
 * 2. Call Supabase Storage API to create signed URL
 * 3. Return the signed URL with expiration time
 * 
 * SECURITY NOTE:
 * Signed URLs are temporary tokens that allow access to private files.
 * After expiration, the URL no longer works and a new one must be generated.
 * 
 * @param bucket - The storage bucket name (e.g., 'blog-covers')
 * @param path - The file path within the bucket (e.g., 'user-id/filename.jpg')
 * @param expiresIn - Time in seconds until the URL expires (default: 1 hour = 3600s)
 * @returns Signed URL string or null if error/no path
 */
export async function getSignedUrl(
  bucket: string,
  path: string | null,
  expiresIn: number = 3600
): Promise<string | null> {
  // Early return for null/empty paths
  if (!path) return null;

  /**
   * BACKWARDS COMPATIBILITY
   * Old blog posts may have full public URLs stored instead of storage paths.
   * Return these as-is to avoid breaking existing content.
   * 
   * FUTURE: Migrate old URLs to storage paths for consistent security model.
   */
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  try {
    /**
     * CREATE SIGNED URL
     * Calls Supabase Storage API to generate temporary access token.
     * The URL grants read access to the specific file for the duration specified.
     */
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    // Catch network errors or unexpected failures
    console.error('Error generating signed URL:', error);
    return null;
  }
}

/**
 * Helper function to generate signed URLs specifically for blog cover images
 * 
 * CONFIGURATION:
 * - Uses 'blog-covers' bucket (private storage for blog images)
 * - 24-hour expiration (86400 seconds)
 * 
 * WHY 24 HOURS:
 * - Blog posts are typically viewed in single sessions
 * - Long enough for user browsing without re-requesting
 * - Short enough to maintain security posture
 * - Reduces API calls compared to shorter expiration
 * 
 * USAGE PATTERN:
 * const coverUrl = await getBlogCoverUrl(post.cover_image);
 * if (coverUrl) {
 *   <img src={coverUrl} alt="Blog cover" />
 * }
 * 
 * @param imagePath - The storage path of the image (or null if no cover)
 * @returns Signed URL or null
 */
export async function getBlogCoverUrl(imagePath: string | null): Promise<string | null> {
  return getSignedUrl('blog-covers', imagePath, 86400); // 24 hours
}
