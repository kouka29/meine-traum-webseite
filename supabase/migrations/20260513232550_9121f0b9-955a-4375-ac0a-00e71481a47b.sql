
-- 1. Remove permissive direct UPDATE policy on leads.
-- All booking updates must go through SECURITY DEFINER RPCs
-- (attach_booking_to_lead, set_lead_contact_method) which already validate input.
DROP POLICY IF EXISTS "Anyone can attach booking to a lead once" ON public.leads;

-- 2. Lock down email queue helper functions (service-role only).
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

-- 3. Pin search_path on email queue helper functions (mutable search_path warning).
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
