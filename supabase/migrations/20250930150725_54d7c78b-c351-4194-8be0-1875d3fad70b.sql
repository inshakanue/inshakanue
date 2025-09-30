-- Create contact form submissions tracking table
CREATE TABLE public.contact_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for efficient rate limit queries
CREATE INDEX idx_contact_submissions_email_created ON public.contact_form_submissions(email, created_at);
CREATE INDEX idx_contact_submissions_ip_created ON public.contact_form_submissions(ip_address, created_at);
CREATE INDEX idx_contact_submissions_created ON public.contact_form_submissions(created_at);

-- Enable RLS
ALTER TABLE public.contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view submission logs
CREATE POLICY "Admins can view all submissions"
ON public.contact_form_submissions
FOR SELECT
USING (is_admin(auth.uid()));

-- Function to clean up old submissions (older than 7 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_contact_submissions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_form_submissions
  WHERE created_at < now() - INTERVAL '7 days';
END;
$$;