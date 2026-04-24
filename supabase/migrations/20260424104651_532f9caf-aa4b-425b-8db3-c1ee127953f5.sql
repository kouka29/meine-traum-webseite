CREATE OR REPLACE FUNCTION public.set_lead_contact_method(
  p_lead_id uuid,
  p_contact_method text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated integer;
BEGIN
  IF p_contact_method IS NULL OR p_contact_method NOT IN ('phone', 'online') THEN
    RAISE EXCEPTION 'invalid contact_method: must be phone or online';
  END IF;

  UPDATE public.leads
  SET contact_method = p_contact_method
  WHERE id = p_lead_id
    AND booking_date IS NULL;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_lead_contact_method(uuid, text) TO anon, authenticated;