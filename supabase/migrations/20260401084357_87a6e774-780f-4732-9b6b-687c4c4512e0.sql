
ALTER TABLE public.portfolio_projects ADD COLUMN mockup_desktop_url text NOT NULL DEFAULT '';
ALTER TABLE public.portfolio_projects ADD COLUMN mockup_mobile_url text NOT NULL DEFAULT '';

INSERT INTO storage.buckets (id, name, public) VALUES ('mockups', 'mockups', true);

CREATE POLICY "Anyone can view mockups" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'mockups');
CREATE POLICY "Service role can manage mockups" ON storage.objects FOR ALL TO service_role USING (bucket_id = 'mockups');
