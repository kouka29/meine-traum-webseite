CREATE OR REPLACE FUNCTION public.attach_booking_to_lead(
  p_lead_id uuid,
  p_booking_date date,
  p_booking_time text,
  p_contact_method text,
  p_trade text DEFAULT NULL::text,
  p_trade_other text DEFAULT NULL::text,
  p_has_website text DEFAULT NULL::text,
  p_goals text[] DEFAULT NULL::text[],
  p_urgency text DEFAULT NULL::text,
  p_current_website text DEFAULT NULL::text,
  p_notes text DEFAULT NULL::text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_updated integer;
BEGIN
  IF p_contact_method IS NULL OR p_contact_method NOT IN ('phone', 'online') THEN
    RAISE EXCEPTION 'invalid contact_method: must be phone or online';
  END IF;

  IF p_booking_date IS NULL OR p_booking_time IS NULL OR length(trim(p_booking_time)) = 0 THEN
    RAISE EXCEPTION 'booking_date and booking_time are required';
  END IF;

  -- Buchungsdaten + Funnel-Antworten speichern, ABER status & slot_reserved NICHT automatisch setzen.
  -- Die Vergabe der Plätze erfolgt ausschließlich manuell im Admin-Bereich.
  UPDATE public.leads
  SET booking_date = p_booking_date,
      booking_time = p_booking_time,
      contact_method = p_contact_method,
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
$function$;