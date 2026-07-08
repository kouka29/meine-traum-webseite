ALTER TABLE public.order_verifications
  ADD COLUMN IF NOT EXISTS checkout_session_id uuid;

CREATE INDEX IF NOT EXISTS idx_order_verifications_session
  ON public.order_verifications (checkout_session_id);
