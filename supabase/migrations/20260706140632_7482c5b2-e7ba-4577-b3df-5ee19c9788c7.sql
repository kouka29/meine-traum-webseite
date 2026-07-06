
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS budget_modell text,
  ADD COLUMN IF NOT EXISTS budget_wert text;

CREATE OR REPLACE FUNCTION public.count_freigegebene_leads_this_month()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(count(*), 0)::int
  FROM public.leads
  WHERE status = 'freigegeben'
    AND created_at >= date_trunc('month', now());
$$;

GRANT EXECUTE ON FUNCTION public.count_freigegebene_leads_this_month() TO anon, authenticated;
