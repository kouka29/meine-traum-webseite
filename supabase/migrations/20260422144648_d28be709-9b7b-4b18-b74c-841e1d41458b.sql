-- Settings-Tabelle für die Kostenlose-Vorschau-Seite (single row)
CREATE TABLE public.vorschau_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_slots INTEGER NOT NULL DEFAULT 5,
  taken_slots INTEGER NOT NULL DEFAULT 3,
  countdown_target TIMESTAMPTZ,
  countdown_mode TEXT NOT NULL DEFAULT 'end_of_month',
  hero_badge_text TEXT NOT NULL DEFAULT 'Nur noch {remaining} von {total} Plätzen im {month} verfügbar',
  hero_h1_line1 TEXT NOT NULL DEFAULT 'Dein Handwerksbetrieb.',
  hero_h1_line2 TEXT NOT NULL DEFAULT 'Eine neue Webseite.',
  hero_h1_line3 TEXT NOT NULL DEFAULT 'Kostenlos in 48h.',
  hero_subheadline TEXT NOT NULL DEFAULT 'Ich zeige dir, wie dein Betrieb online aussehen könnte – ohne Risiko, ohne Kosten, ohne Verpflichtung.',
  hero_cta_label TEXT NOT NULL DEFAULT 'Jetzt kostenlose Vorschau sichern',
  countdown_label TEXT NOT NULL DEFAULT 'Aktion endet in:',
  final_cta_headline TEXT NOT NULL DEFAULT 'Warte nicht, bis es dein Mitbewerber tut.',
  final_cta_subtext TEXT NOT NULL DEFAULT 'Deine kostenlose Webseiten-Vorschau wartet.',
  final_cta_button TEXT NOT NULL DEFAULT 'Jetzt letzten Platz sichern',
  phone_number TEXT NOT NULL DEFAULT '+49 170 123 45 67',
  show_countdown BOOLEAN NOT NULL DEFAULT true,
  show_slots BOOLEAN NOT NULL DEFAULT true,
  show_testimonials BOOLEAN NOT NULL DEFAULT true,
  show_demos BOOLEAN NOT NULL DEFAULT true,
  show_faq BOOLEAN NOT NULL DEFAULT true,
  show_pain_points BOOLEAN NOT NULL DEFAULT true,
  show_process BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT vorschau_settings_singleton CHECK (id = 1),
  CONSTRAINT vorschau_settings_slots_valid CHECK (taken_slots >= 0 AND total_slots > 0 AND taken_slots <= total_slots)
);

-- Default-Zeile einfügen
INSERT INTO public.vorschau_settings (id) VALUES (1);

-- Demo-Beispiele Tabelle
CREATE TABLE public.vorschau_demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Demo-Defaults
INSERT INTO public.vorschau_demos (trade, company, description, sort_order) VALUES
('Elektriker', 'Elektro Mustermann GmbH', 'Modern, klar, mit Online-Anfrage in 60 Sekunden.', 0),
('Maler', 'Malerbetrieb Schmidt', 'Bildstark, hochwertig, mit Galerie und Bewertungen.', 1),
('Sanitär', 'Heizung & Bad Müller', 'Notdienst-Hotline prominent, schnelle Terminbuchung.', 2);

-- FAQ Tabelle
CREATE TABLE public.vorschau_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.vorschau_faqs (question, answer, sort_order) VALUES
('Was kostet mich die Vorschau wirklich?', 'Gar nichts. Weder jetzt noch später, wenn es dir nicht gefällt.', 0),
('Bin ich nach der Vorschau zu irgendetwas verpflichtet?', 'Nein. Absolut nicht.', 1),
('Wie sieht die Vorschau konkret aus?', 'Du bekommst eine echte, klickbare Webseite mit deinem Firmennamen – kein PDF, kein Screenshot.', 2),
('Warum machst du das kostenlos?', 'Weil ich überzeugt bin, dass die Qualität meiner Arbeit für sich spricht. Erst sehen, dann entscheiden.', 3),
('Was passiert, wenn alle Plätze weg sind?', 'Du kannst dich auf die Warteliste setzen lassen und bekommst im nächsten Monat Priorität.', 4);

-- RLS aktivieren
ALTER TABLE public.vorschau_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vorschau_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vorschau_faqs ENABLE ROW LEVEL SECURITY;

-- Settings: jeder darf lesen
CREATE POLICY "Anyone can read vorschau settings"
  ON public.vorschau_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Demos: nur sichtbare lesbar
CREATE POLICY "Anyone can read visible demos"
  ON public.vorschau_demos FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- FAQs: nur sichtbare lesbar
CREATE POLICY "Anyone can read visible faqs"
  ON public.vorschau_faqs FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- Storage-Bucket für Demo-Bilder
INSERT INTO storage.buckets (id, name, public) VALUES ('vorschau-demos', 'vorschau-demos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view vorschau demo images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vorschau-demos');

-- updated_at Trigger
CREATE OR REPLACE FUNCTION public.update_vorschau_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_vorschau_settings_updated_at
  BEFORE UPDATE ON public.vorschau_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_vorschau_settings_updated_at();