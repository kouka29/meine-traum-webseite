
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  referrer text DEFAULT '',
  user_agent text DEFAULT '',
  screen_width integer DEFAULT 0,
  device_type text DEFAULT 'desktop',
  timezone text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
TO anon
WITH CHECK (true);
