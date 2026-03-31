
-- Create portfolio_projects table
CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  result text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Public read access for visible projects
CREATE POLICY "Anyone can view visible portfolio projects"
ON public.portfolio_projects
FOR SELECT
TO anon, authenticated
USING (is_visible = true);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Allow public read access to portfolio images
CREATE POLICY "Public read access for portfolio images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-images');

-- Allow service role to manage portfolio images (via edge function)
CREATE POLICY "Service role can manage portfolio images"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'portfolio-images')
WITH CHECK (bucket_id = 'portfolio-images');
