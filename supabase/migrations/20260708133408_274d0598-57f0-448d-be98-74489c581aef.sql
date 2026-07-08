
ALTER TABLE public.customer_accounts
  ADD COLUMN IF NOT EXISTS invoice_allowed boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.invoice_confirmation_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  angebots_id text,
  code_hash text NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoice_codes_email_expires
  ON public.invoice_confirmation_codes (email, expires_at DESC);

GRANT ALL ON public.invoice_confirmation_codes TO service_role;

ALTER TABLE public.invoice_confirmation_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_codes_service_role_only"
  ON public.invoice_confirmation_codes FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
