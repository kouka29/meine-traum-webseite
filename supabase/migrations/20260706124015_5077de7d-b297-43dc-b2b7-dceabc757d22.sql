
CREATE TABLE public.funnel_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  firmenname TEXT, ort TEXT, gewerk TEXT, leistungen TEXT,
  hat_website BOOLEAN, website_url TEXT,
  stil TEXT, ziel TEXT,
  kein_logo BOOLEAN NOT NULL DEFAULT false, logo_url TEXT,
  foto_urls TEXT[] NOT NULL DEFAULT '{}',
  termin_datum DATE, termin_uhrzeit TEXT, kontaktart TEXT,
  name TEXT, telefon TEXT, email TEXT,
  datenschutz_akzeptiert BOOLEAN NOT NULL DEFAULT false,
  source_cta TEXT NOT NULL DEFAULT 'vorschau-funnel',
  source_page TEXT,
  status TEXT NOT NULL DEFAULT 'neu',
  month_key TEXT
);

GRANT INSERT ON public.funnel_leads TO anon, authenticated;
GRANT ALL ON public.funnel_leads TO service_role;

ALTER TABLE public.funnel_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a funnel lead"
  ON public.funnel_leads FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TRIGGER trg_funnel_leads_updated_at
  BEFORE UPDATE ON public.funnel_leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.vorschau_settings (id, page_key, total_slots, taken_slots)
SELECT COALESCE(MAX(id), 0) + 1, 'vorschau-funnel', 5, 0
FROM public.vorschau_settings
WHERE NOT EXISTS (SELECT 1 FROM public.vorschau_settings WHERE page_key = 'vorschau-funnel');
