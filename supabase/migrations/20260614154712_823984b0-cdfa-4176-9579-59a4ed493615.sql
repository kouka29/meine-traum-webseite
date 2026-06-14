DROP POLICY IF EXISTS "Anyone can submit a preview request" ON public.vorschau_anfragen;

CREATE POLICY "Anyone can submit a preview request"
ON public.vorschau_anfragen
FOR INSERT
WITH CHECK (
  status = ANY (ARRAY['pending'::text, 'slot_assigned'::text, 'waitlist'::text])
  AND length(btrim(name)) BETWEEN 1 AND 100
  AND length(btrim(email)) BETWEEN 3 AND 200
  AND email LIKE '%_@_%.__%'
  AND length(coalesce(company, '')) <= 200
  AND length(coalesce(phone, '')) <= 50
  AND length(coalesce(website_url, '')) <= 500
  AND length(coalesce(source_page, '')) <= 200
  AND length(coalesce(month_key, '')) <= 20
);