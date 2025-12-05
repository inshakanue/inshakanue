-- Create a table for resume previews
CREATE TABLE public.resume_previews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    previewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT,
    user_id UUID
);

-- Enable Row Level Security
ALTER TABLE public.resume_previews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert previews (public tracking)
CREATE POLICY "Anyone can track resume previews"
ON public.resume_previews
FOR INSERT
WITH CHECK (true);

-- Only admins can view resume previews
CREATE POLICY "Admins can view resume previews"
ON public.resume_previews
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
));