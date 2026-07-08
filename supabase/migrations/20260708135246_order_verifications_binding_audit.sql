ALTER TABLE public.order_verifications
  ADD COLUMN IF NOT EXISTS binding_ip text,
  ADD COLUMN IF NOT EXISTS binding_user_agent text,
  ADD COLUMN IF NOT EXISTS binding_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS binding_text_version text NOT NULL DEFAULT '1.0';
