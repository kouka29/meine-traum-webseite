CREATE TABLE public.growth_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email text NOT NULL,
  purchase_session_id text,
  package text NOT NULL CHECK (package IN ('basic','plus','premium')),
  monthly_amount_cents integer NOT NULL CHECK (monthly_amount_cents > 0),
  billing_mode text NOT NULL DEFAULT 'manual_invoice' CHECK (billing_mode IN ('manual_invoice','stripe_auto','cancelled')),
  status text NOT NULL DEFAULT 'pending_golive' CHECK (status IN ('pending_golive','active','past_due','cancelled')),
  min_term_months integer NOT NULL DEFAULT 12,
  started_at timestamptz,
  next_invoice_at timestamptz,
  cancel_at timestamptz,
  stripe_subscription_id text,
  stripe_customer_id text,
  last_invoice_id text,
  last_invoice_status text,
  last_invoice_at timestamptz,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_growth_subs_user ON public.growth_subscriptions(user_id);
CREATE INDEX idx_growth_subs_email ON public.growth_subscriptions(lower(customer_email));
CREATE INDEX idx_growth_subs_due ON public.growth_subscriptions(status, billing_mode, next_invoice_at);

GRANT SELECT ON public.growth_subscriptions TO authenticated;
GRANT ALL ON public.growth_subscriptions TO service_role;

ALTER TABLE public.growth_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own growth subscription"
  ON public.growth_subscriptions FOR SELECT TO authenticated
  USING (
    (user_id IS NOT NULL AND auth.uid() = user_id)
    OR (user_id IS NULL AND lower(customer_email) = lower((auth.jwt() ->> 'email')))
  );

CREATE POLICY "Service role manages growth subscriptions"
  ON public.growth_subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER growth_subs_touch_updated_at
  BEFORE UPDATE ON public.growth_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();