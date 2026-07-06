
CREATE POLICY "funnel_uploads_insert_public"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'funnel-uploads');

CREATE POLICY "funnel_uploads_select_public"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'funnel-uploads');
