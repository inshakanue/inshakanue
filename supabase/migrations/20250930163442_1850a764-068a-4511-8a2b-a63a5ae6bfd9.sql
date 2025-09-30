-- Add INSERT policy for contact_form_submissions to allow anonymous contact form submissions
-- This is required for the contact form to work while maintaining security through the edge function validation

CREATE POLICY "Allow anonymous contact form submissions"
ON public.contact_form_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Add comment explaining the security model
COMMENT ON POLICY "Allow anonymous contact form submissions" ON public.contact_form_submissions IS 
'Allows anonymous users to submit contact forms. Security is enforced in the send-contact-email edge function through rate limiting, honeypot detection, and input validation.';