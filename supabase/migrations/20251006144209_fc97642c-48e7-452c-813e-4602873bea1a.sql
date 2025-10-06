-- Phase 1: Fix Critical Data Exposure Issues

-- 1. Secure contact_form_submissions table
-- Drop and recreate the SELECT policy with explicit authentication requirement
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_form_submissions;

CREATE POLICY "Admins can view all submissions"
ON public.contact_form_submissions
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- 2. Secure profiles table with explicit authentication checks
-- Drop and recreate SELECT policies to ensure only authenticated users can access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add explicit comment documenting the security model
COMMENT ON TABLE public.contact_form_submissions IS 'Contact form submissions. SELECT restricted to authenticated admins only. INSERT allowed for anonymous users for form submission.';
COMMENT ON TABLE public.profiles IS 'User profiles. SELECT restricted to authenticated users (self or admin). No public access allowed.';