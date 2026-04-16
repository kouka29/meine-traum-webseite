-- Tighten overly permissive INSERT policies so they validate basic input shape
-- instead of accepting anything. Anonymous inserts are still allowed for the
-- public lead form and page-view tracking, but with minimum data quality checks.

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(first_name)) BETWEEN 1 AND 100
    AND length(trim(email)) BETWEEN 3 AND 200
    AND email LIKE '%_@_%'
    AND length(trim(phone)) BETWEEN 3 AND 50
    AND length(coalesce(company_name, '')) <= 200
  );

DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views"
  ON public.page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(page_path)) BETWEEN 1 AND 500
    AND length(coalesce(referrer, '')) <= 1000
    AND length(coalesce(user_agent, '')) <= 1000
    AND length(coalesce(timezone, '')) <= 100
    AND length(coalesce(device_type, '')) <= 50
  );