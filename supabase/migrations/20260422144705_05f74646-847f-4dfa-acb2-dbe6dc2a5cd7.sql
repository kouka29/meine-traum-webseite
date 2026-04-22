-- Bucket-Listing einschränken: nur direkte Objektzugriffe erlauben
DROP POLICY IF EXISTS "Public can view vorschau demo images" ON storage.objects;

CREATE POLICY "Public can read individual vorschau demo objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vorschau-demos' AND name IS NOT NULL);

-- Funktion mit explizitem search_path neu definieren
CREATE OR REPLACE FUNCTION public.update_vorschau_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;