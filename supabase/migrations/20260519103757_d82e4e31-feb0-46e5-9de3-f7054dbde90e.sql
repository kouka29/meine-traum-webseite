
CREATE TABLE public.buchungen (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  angebots_id text,
  angebots_nr text NOT NULL UNIQUE,
  payment_method text NOT NULL DEFAULT 'rechnung',
  kunde_vorname text NOT NULL,
  kunde_nachname text NOT NULL,
  kunde_firma text NOT NULL,
  kunde_email text NOT NULL,
  kunde_telefon text,
  pakete jsonb,
  addons jsonb,
  leistungen jsonb,
  gesamtbetrag_netto numeric NOT NULL DEFAULT 0,
  mwst numeric NOT NULL DEFAULT 0,
  gesamtbetrag_brutto numeric NOT NULL DEFAULT 0,
  agb_akzeptiert boolean NOT NULL DEFAULT false,
  agb_version text NOT NULL DEFAULT '1.0',
  kostenpflichtig_bestaetigt boolean NOT NULL DEFAULT false,
  ip_adresse text,
  user_agent text,
  status text NOT NULL DEFAULT 'neu',
  notizen text,
  gebucht_am timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.buchungen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny direct SELECT on buchungen"
  ON public.buchungen FOR SELECT
  USING (false);

CREATE POLICY "Service role can manage buchungen"
  ON public.buchungen FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX idx_buchungen_gebucht_am ON public.buchungen(gebucht_am DESC);
CREATE INDEX idx_buchungen_status ON public.buchungen(status);
