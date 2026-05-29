
-- customer_accounts
CREATE TABLE public.customer_accounts (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  company_name TEXT,
  phone TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.customer_accounts TO authenticated;
GRANT ALL ON public.customer_accounts TO service_role;

ALTER TABLE public.customer_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own account"
  ON public.customer_accounts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own account"
  ON public.customer_accounts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages accounts"
  ON public.customer_accounts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- customer_tickets
CREATE TABLE public.customer_tickets (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.customer_tickets TO authenticated;
GRANT ALL ON public.customer_tickets TO service_role;

ALTER TABLE public.customer_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tickets"
  ON public.customer_tickets FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own tickets"
  ON public.customer_tickets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND length(trim(subject)) BETWEEN 1 AND 200 AND length(trim(message)) BETWEEN 1 AND 5000);

CREATE POLICY "Users update own open tickets"
  ON public.customer_tickets FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages tickets"
  ON public.customer_tickets FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX idx_customer_tickets_user_id ON public.customer_tickets(user_id);
CREATE INDEX idx_customer_tickets_status ON public.customer_tickets(status);

-- customer_ticket_messages
CREATE TABLE public.customer_ticket_messages (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.customer_tickets(id) ON DELETE CASCADE,
  author_type TEXT NOT NULL,
  author_user_id UUID,
  message TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.customer_ticket_messages TO authenticated;
GRANT ALL ON public.customer_ticket_messages TO service_role;

ALTER TABLE public.customer_ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own ticket messages"
  ON public.customer_ticket_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.customer_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()));

CREATE POLICY "Users insert own ticket messages"
  ON public.customer_ticket_messages FOR INSERT TO authenticated
  WITH CHECK (
    author_type = 'customer'
    AND author_user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.customer_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())
    AND length(trim(message)) BETWEEN 1 AND 5000
  );

CREATE POLICY "Service role manages ticket messages"
  ON public.customer_ticket_messages FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX idx_ticket_messages_ticket_id ON public.customer_ticket_messages(ticket_id);

-- Erweiterungen bestehender Tabellen
ALTER TABLE public.leads ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.buchungen ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.angebote ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_buchungen_user_id ON public.buchungen(user_id);
CREATE INDEX idx_angebote_user_id ON public.angebote(user_id);

-- Authenticated braucht SELECT auf diesen Tabellen für eigene Zeilen
GRANT SELECT ON public.leads TO authenticated;
GRANT SELECT ON public.buchungen TO authenticated;
GRANT SELECT ON public.angebote TO authenticated;

CREATE POLICY "Users view own leads"
  ON public.leads FOR SELECT TO authenticated
  USING (user_id IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users view own buchungen"
  ON public.buchungen FOR SELECT TO authenticated
  USING (user_id IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users view own angebote"
  ON public.angebote FOR SELECT TO authenticated
  USING (user_id IS NOT NULL AND auth.uid() = user_id);

-- Updated-At Trigger für neue Tabellen
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_customer_accounts_updated BEFORE UPDATE ON public.customer_accounts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_customer_tickets_updated BEFORE UPDATE ON public.customer_tickets
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage Bucket für Ticket-Anhänge
INSERT INTO storage.buckets (id, name, public) VALUES ('ticket-attachments', 'ticket-attachments', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users read own ticket attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'ticket-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own ticket attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ticket-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own ticket attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'ticket-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
