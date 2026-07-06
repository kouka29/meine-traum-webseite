-- Tighten the funnel-uploads INSERT policy: enforce path pattern
-- <uuid>/(logo|fotos)/<timestamp>-<sanitized-name-up-to-120-chars>
DROP POLICY IF EXISTS "funnel_uploads_insert_public" ON storage.objects;
CREATE POLICY "funnel_uploads_insert_public"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'funnel-uploads'
    AND name ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/(logo|fotos)/[0-9]+-[A-Za-z0-9._\-]{1,120}$'
  );
