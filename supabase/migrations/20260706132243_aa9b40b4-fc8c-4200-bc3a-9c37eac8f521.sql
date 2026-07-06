
CREATE TABLE public.vorschau_bewerbungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  firmenname text NOT NULL,
  gewerk text NOT NULL,
  ort text NOT NULL,
  hat_website boolean NOT NULL DEFAULT false,
  website_url text,
  warum text NOT NULL,
  timeline text NOT NULL,
  budget text NOT NULL,
  telefon text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'neu' CHECK (status IN ('neu','freigegeben','abgelehnt','warteliste')),
  typ text NOT NULL DEFAULT 'bewerbung' CHECK (typ IN ('bewerbung','warteliste')),
  source_cta text NOT NULL DEFAULT 'kostenlose-vorschau'
);

GRANT INSERT ON public.vorschau_bewerbungen TO anon, authenticated;
GRANT ALL ON public.vorschau_bewerbungen TO service_role;

ALTER TABLE public.vorschau_bewerbungen ENABLE ROW LEVEL SECURITY;

-- Öffentliches Bewerbungsformular: jeder darf einreichen
CREATE POLICY "Anyone can submit a bewerbung"
  ON public.vorschau_bewerbungen
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status IN ('neu','warteliste')
    AND typ IN ('bewerbung','warteliste')
    AND source_cta = 'kostenlose-vorschau'
    AND length(name) BETWEEN 1 AND 120
    AND length(firmenname) BETWEEN 1 AND 160
    AND length(gewerk) BETWEEN 1 AND 120
    AND length(ort) BETWEEN 1 AND 120
    AND length(warum) BETWEEN 30 AND 2000
    AND length(telefon) BETWEEN 5 AND 40
    AND length(email) BETWEEN 5 AND 200
    AND (website_url IS NULL OR length(website_url) <= 300)
  );

CREATE INDEX idx_vorschau_bewerbungen_status_created
  ON public.vorschau_bewerbungen (status, created_at DESC);

CREATE TRIGGER trg_vorschau_bewerbungen_updated_at
  BEFORE UPDATE ON public.vorschau_bewerbungen
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
