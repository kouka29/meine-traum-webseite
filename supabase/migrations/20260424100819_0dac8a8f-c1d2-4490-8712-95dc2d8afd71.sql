
-- Erweitere leads-Tabelle um die Funnel-Antworten
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS trade text,
  ADD COLUMN IF NOT EXISTS trade_other text,
  ADD COLUMN IF NOT EXISTS has_website text,
  ADD COLUMN IF NOT EXISTS goals text[],
  ADD COLUMN IF NOT EXISTS urgency text,
  ADD COLUMN IF NOT EXISTS current_website text,
  ADD COLUMN IF NOT EXISTS notes text;

-- Aktualisiere die INSERT-Policy: Neue optionale Felder mit Längenlimits absichern
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(first_name)) >= 1 AND length(trim(first_name)) <= 100
  AND length(trim(email)) >= 3 AND length(trim(email)) <= 200
  AND email LIKE '%_@_%'
  AND length(trim(phone)) >= 3 AND length(trim(phone)) <= 50
  AND length(coalesce(company_name, '')) <= 200
  AND length(coalesce(trade, '')) <= 100
  AND length(coalesce(trade_other, '')) <= 200
  AND length(coalesce(has_website, '')) <= 200
  AND length(coalesce(urgency, '')) <= 200
  AND length(coalesce(current_website, '')) <= 500
  AND length(coalesce(notes, '')) <= 5000
  AND (goals IS NULL OR array_length(goals, 1) IS NULL OR array_length(goals, 1) <= 10)
);
