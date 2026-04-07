CREATE POLICY "Deny direct SELECT on leads"
  ON public.leads
  FOR SELECT
  USING (false);