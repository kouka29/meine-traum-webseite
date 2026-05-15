CREATE TABLE public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text NOT NULL UNIQUE,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  package text NOT NULL CHECK (package IN ('starter','pro','premium')),
  deposit_amount_cents integer NOT NULL,
  total_amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  customer_email text,
  customer_name text,
  status text NOT NULL DEFAULT 'deposit_paid' CHECK (status IN ('pending','deposit_paid','completed','refunded','failed')),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  environment text NOT NULL DEFAULT 'sandbox',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_purchases_email ON public.purchases(customer_email);
CREATE INDEX idx_purchases_lead_id ON public.purchases(lead_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage purchases"
  ON public.purchases FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Deny direct SELECT on purchases"
  ON public.purchases FOR SELECT
  USING (false);

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vorschau_settings_updated_at();