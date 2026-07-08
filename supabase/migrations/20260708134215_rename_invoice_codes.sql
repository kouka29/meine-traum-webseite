-- Rename invoice_confirmation_codes -> order_verifications and add `verified` flag
ALTER TABLE IF EXISTS public.invoice_confirmation_codes
  RENAME TO order_verifications;

ALTER TABLE public.order_verifications
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;

ALTER INDEX IF EXISTS idx_invoice_codes_email_expires
  RENAME TO idx_order_verifications_email_expires;

DROP POLICY IF EXISTS "invoice_codes_service_role_only" ON public.order_verifications;
CREATE POLICY "order_verifications_service_role_only"
  ON public.order_verifications FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

GRANT ALL ON public.order_verifications TO service_role;
