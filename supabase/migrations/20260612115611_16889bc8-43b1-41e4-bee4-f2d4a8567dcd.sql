CREATE TABLE IF NOT EXISTS public.vorschau_anfragen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  website_url text,
  phone text,
  source_page text NOT NULL,
  month_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS vorschau_anfragen_month_status_idx
  ON public.vorschau_anfragen (month_key, status);

GRANT INSERT ON public.vorschau_anfragen TO anon, authenticated;
GRANT ALL ON public.vorschau_anfragen TO service_role;

ALTER TABLE public.vorschau_anfragen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a preview request"
  ON public.vorschau_anfragen
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status IN ('pending', 'slot_assigned', 'waitlist'));

CREATE POLICY "Service role full access"
  ON public.vorschau_anfragen
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);