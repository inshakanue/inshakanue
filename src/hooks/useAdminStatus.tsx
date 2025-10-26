/**
 * ADMIN STATUS HOOK
 * 
 * BUSINESS CONTEXT:
 * Controls access to blog admin functionality (creating, editing, deleting posts).
 * This hook determines whether a user has administrative privileges to manage
 * content on the site.
 * 
 * SECURITY IMPLEMENTATION:
 * - Checks authentication state first (must be logged in)
 * - Calls Supabase RPC function 'is_admin' which queries admin_users table
 * - Returns loading state to prevent flashing of unauthorized content
 * - Subscribes to auth changes to update admin status in real-time
 * 
 * BUSINESS RULES:
 * - Only users listed in admin_users table can manage blog content
 * - Admin status is checked on mount and after any auth state change
 * - Failures default to false (secure by default)
 * 
 * USAGE PATTERN:
 * const { isAdmin, loading, user } = useAdminStatus();
 * if (loading) return <LoadingSpinner />;
 * if (!isAdmin) return <Redirect to="/blog" />;
 * return <AdminPanel />;
 * 
 * PERFORMANCE:
 * - Single RPC call per authentication state change
 * - Results cached in component state
 * - Proper cleanup prevents memory leaks
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);     // Admin privilege flag
  const [loading, setLoading] = useState(true);       // Loading state for UI
  const [user, setUser] = useState(null);             // Current authenticated user

  useEffect(() => {
    /**
     * CHECK ADMIN STATUS
     * 
     * PROCESS:
     * 1. Get current authenticated user from Supabase
     * 2. If no user, return false immediately (not authenticated)
     * 3. If user exists, call RPC function to check admin_users table
     * 4. Update state based on result
     * 
     * ERROR HANDLING:
     * - Logs errors only in development mode
     * - Defaults to false (deny access) on any error
     * - Sets loading to false regardless of outcome
     */
    const checkAdminStatus = async () => {
      try {
        // Step 1: Get currently authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Step 2: No user = not admin, exit early
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Step 3: Query admin_users table via RPC function
        // RPC function checks if user.id exists in admin_users table
        const { data, error } = await supabase.rpc('is_admin', { 
          user_id: user.id 
        });

        if (error) {
          // Log errors only in development for debugging
          if (import.meta.env.DEV) {
            console.error('Error checking admin status:', error);
          }
          setIsAdmin(false);  // Secure default: deny on error
        } else {
          setIsAdmin(data || false);  // Set admin status from database
        }
      } catch (error) {
        // Catch unexpected errors (network issues, etc.)
        if (import.meta.env.DEV) {
          console.error('Error in admin check:', error);
        }
        setIsAdmin(false);  // Secure default: deny on error
      } finally {
        setLoading(false);  // Always set loading to false
      }
    };

    // Initial check on component mount
    checkAdminStatus();

    /**
     * REAL-TIME AUTH UPDATES
     * Subscribe to authentication state changes to re-check admin status.
     * Triggers on: login, logout, token refresh, session expiry
     * 
     * WHY: Ensures admin status stays synchronized with auth state
     * without requiring page refresh.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    // Cleanup: Unsubscribe from auth changes when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  /**
   * RETURN VALUES
   * - isAdmin: Boolean flag for admin privileges
   * - loading: Boolean flag for loading state (use to show spinner)
   * - user: Current authenticated user object (or null)
   */
  return { isAdmin, loading, user };
};
