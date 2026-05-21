ALTER TABLE public.angebote
  ADD COLUMN IF NOT EXISTS addons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS payment_config jsonb NOT NULL DEFAULT jsonb_build_object(
    'kauf', jsonb_build_object('enabled', true, 'mode', 'full', 'deposit_percent', 30),
    'miete', jsonb_build_object('enabled', true, 'monthly_cents', 13900, 'min_months', 12)
  );