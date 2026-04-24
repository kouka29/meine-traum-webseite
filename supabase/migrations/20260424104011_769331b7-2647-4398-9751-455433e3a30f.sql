CREATE OR REPLACE FUNCTION public.attach_booking_to_lead(
  p_lead_id uuid,
  p_booking_date date,
  p_booking_time text,
  p_contact_method text,
  p_trade text DEFAULT NULL,
  p_trade_other text DEFAULT NULL,
  p_has_website text DEFAULT NULL,
  p_goals text[] DEFAULT NULL,
  p_urgency text DEFAULT NULL,
  p_current_website text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated integer;
BEGIN
  -- Validierung des Kontaktwegs
  IF p_contact_method IS NULL OR p_contact_method NOT IN ('phone', 'online') THEN
    RAISE EXCEPTION 'invalid contact_method: must be phone or online';
  END IF;

  IF p_booking_date IS NULL OR p_booking_time IS NULL OR length(trim(p_booking_time)) = 0 THEN
    RAISE EXCEPTION 'booking_date and booking_time are required';
  END IF;

  -- Update nur wenn noch keine Buchung existiert (Schutz gegen doppelte Buchungen)
  UPDATE public.leads
  SET booking_date = p_booking_date,
      booking_time = p_booking_time,
      contact_method = p_contact_method,
      status = 'qualified',
      slot_reserved = true,
      trade = COALESCE(NULLIF(p_trade, ''), trade),
      trade_other = COALESCE(NULLIF(p_trade_other, ''), trade_other),
      has_website = COALESCE(NULLIF(p_has_website, ''), has_website),
      goals = COALESCE(p_goals, goals),
      urgency = COALESCE(NULLIF(p_urgency, ''), urgency),
      current_website = COALESCE(NULLIF(p_current_website, ''), current_website),
      notes = COALESCE(NULLIF(p_notes, ''), notes)
  WHERE id = p_lead_id
    AND booking_date IS NULL
    AND booking_time IS NULL;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

-- Erlaube anon und authenticated den Aufruf
GRANT EXECUTE ON FUNCTION public.attach_booking_to_lead(uuid, date, text, text, text, text, text, text[], text, text, text) TO anon, authenticated;