-- 1. Status & slot_reserved Felder ergänzen
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS slot_reserved boolean NOT NULL DEFAULT false;

-- Status-Validierung per Trigger (CHECK kann nachträglich Probleme machen)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_status_check'
  ) THEN
    ALTER TABLE public.leads
      ADD CONSTRAINT leads_status_check
      CHECK (status IN ('new','qualified','rejected','customer'));
  END IF;
END$$;

-- 2. RPC: Platz reservieren (anon darf das, da im Funnel ausgelöst)
CREATE OR REPLACE FUNCTION public.increment_taken_slot()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.vorschau_settings
  SET taken_slots = LEAST(taken_slots + 1, total_slots),
      updated_at = now()
  WHERE id = 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_taken_slot()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.vorschau_settings
  SET taken_slots = GREATEST(taken_slots - 1, 0),
      updated_at = now()
  WHERE id = 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_taken_slot() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_taken_slot() TO anon, authenticated;

-- 3. RLS Update-Policy für Leads erweitern (Buchung darf jetzt auch
-- slot_reserved = true und status = 'qualified' setzen)
DROP POLICY IF EXISTS "Anyone can attach booking to a lead once" ON public.leads;

CREATE POLICY "Anyone can attach booking to a lead once"
ON public.leads
FOR UPDATE
TO anon, authenticated
USING (booking_date IS NULL AND booking_time IS NULL)
WITH CHECK (
  (
    (booking_date IS NOT NULL OR booking_time IS NOT NULL OR contact_method IS NOT NULL)
    AND (contact_method IS NULL OR contact_method = ANY (ARRAY['phone','online']))
  )
  AND status IN ('new','qualified')
);
