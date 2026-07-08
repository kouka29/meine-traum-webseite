-- Lock down order_verifications: service_role only, no client access.
REVOKE ALL ON public.order_verifications FROM PUBLIC;
REVOKE ALL ON public.order_verifications FROM anon;
REVOKE ALL ON public.order_verifications FROM authenticated;

ALTER TABLE public.order_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_verifications FORCE ROW LEVEL SECURITY;

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies
           WHERE schemaname = 'public' AND tablename = 'order_verifications'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.order_verifications', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "order_verifications_service_role_only"
  ON public.order_verifications FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

GRANT ALL ON public.order_verifications TO service_role;
