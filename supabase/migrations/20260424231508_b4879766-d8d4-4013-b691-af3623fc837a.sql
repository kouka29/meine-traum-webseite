ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS is_waitlist boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_leads_is_waitlist ON public.leads(is_waitlist) WHERE is_waitlist = true;

-- Update insert policy to allow is_waitlist column
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (length(TRIM(BOTH FROM first_name)) >= 1) AND (length(TRIM(BOTH FROM first_name)) <= 100) AND
  (length(TRIM(BOTH FROM email)) >= 3) AND (length(TRIM(BOTH FROM email)) <= 200) AND
  (email LIKE '%_@_%') AND
  (length(TRIM(BOTH FROM phone)) >= 3) AND (length(TRIM(BOTH FROM phone)) <= 50) AND
  (length(COALESCE(company_name, '')) <= 200) AND
  (length(COALESCE(trade, '')) <= 100) AND
  (length(COALESCE(trade_other, '')) <= 200) AND
  (length(COALESCE(has_website, '')) <= 200) AND
  (length(COALESCE(urgency, '')) <= 200) AND
  (length(COALESCE(current_website, '')) <= 500) AND
  (length(COALESCE(notes, '')) <= 5000) AND
  ((goals IS NULL) OR (array_length(goals, 1) IS NULL) OR (array_length(goals, 1) <= 10))
);