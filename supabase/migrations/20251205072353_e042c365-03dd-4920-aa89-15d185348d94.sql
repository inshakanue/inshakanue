-- Create a table for tracking resume downloads
CREATE TABLE public.resume_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NULL,
  ip_address TEXT NULL,
  user_agent TEXT NULL
);

-- Enable Row Level Security
ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (track downloads)
CREATE POLICY "Anyone can track resume downloads" 
ON public.resume_downloads 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading for authenticated users (for analytics dashboard)
CREATE POLICY "Admins can view resume downloads" 
ON public.resume_downloads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);