ALTER TABLE public.vorschau_settings REPLICA IDENTITY FULL;
ALTER TABLE public.vorschau_demos REPLICA IDENTITY FULL;
ALTER TABLE public.vorschau_faqs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vorschau_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vorschau_demos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vorschau_faqs;