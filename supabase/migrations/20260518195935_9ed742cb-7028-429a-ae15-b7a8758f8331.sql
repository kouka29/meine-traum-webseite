CREATE TABLE public.angebote (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_name text,
  lead_email text,
  preis numeric,
  normalpreis numeric,
  pin text,
  ablauf_datum timestamptz,
  base64_data text,
  stripe_link text,
  erstellt_am timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'aktiv'
);

ALTER TABLE public.angebote ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage angebote"
ON public.angebote
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Deny direct SELECT on angebote"
ON public.angebote
FOR SELECT
TO public
USING (false);

CREATE INDEX idx_angebote_erstellt_am ON public.angebote (erstellt_am DESC);