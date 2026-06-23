
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS branche text,
  ADD COLUMN IF NOT EXISTS ort text,
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS source_cta text;

ALTER TABLE public.leads ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN company_name DROP NOT NULL;
