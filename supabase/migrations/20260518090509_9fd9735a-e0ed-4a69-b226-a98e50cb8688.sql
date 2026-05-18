
CREATE TABLE public.design_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  apple_design_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.design_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read design settings"
ON public.design_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Service role can manage design settings"
ON public.design_settings FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

INSERT INTO public.design_settings (id, apple_design_enabled) VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.design_settings;
ALTER TABLE public.design_settings REPLICA IDENTITY FULL;
