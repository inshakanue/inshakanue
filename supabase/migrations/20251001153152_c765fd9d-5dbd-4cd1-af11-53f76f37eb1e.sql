-- Fix the SELECT policy on contact_form_submissions to be PERMISSIVE instead of RESTRICTIVE
-- This ensures only admins can view contact form submissions with email addresses

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_form_submissions;

-- Recreate it as a permissive policy (default)
CREATE POLICY "Admins can view all submissions" 
ON public.contact_form_submissions 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));