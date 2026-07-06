-- 1) Tighten funnel_leads INSERT policy: no more WITH CHECK (true)
DROP POLICY IF EXISTS "Anyone can create a funnel lead" ON public.funnel_leads;
CREATE POLICY "Anyone can create a funnel lead"
  ON public.funnel_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    firmenname IS NOT NULL
    AND length(btrim(firmenname)) >= 2
    AND email IS NOT NULL
    AND length(btrim(email)) >= 5
    AND datenschutz_akzeptiert = true
  );

-- 2) Restrict funnel-uploads SELECT to service_role only.
-- Client no longer creates signed URLs directly; a dedicated edge function does it.
DROP POLICY IF EXISTS "funnel_uploads_select_public" ON storage.objects;
CREATE POLICY "funnel_uploads_select_service_role"
  ON storage.objects
  FOR SELECT
  TO service_role
  USING (bucket_id = 'funnel-uploads');
