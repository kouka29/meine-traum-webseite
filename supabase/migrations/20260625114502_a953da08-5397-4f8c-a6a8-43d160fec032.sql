ALTER TABLE public.portfolio_projects
ADD COLUMN IF NOT EXISTS screenshot_url text NOT NULL DEFAULT '';