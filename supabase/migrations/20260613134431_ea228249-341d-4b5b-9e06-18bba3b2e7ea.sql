
CREATE OR REPLACE FUNCTION public.prevent_stripe_customer_id_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role / postgres (backend) to modify freely.
  IF current_setting('request.jwt.claim.role', true) = 'service_role'
     OR current_user IN ('postgres', 'service_role', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN
    RAISE EXCEPTION 'stripe_customer_id can only be modified by the backend'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_stripe_customer_id_change ON public.customer_accounts;
CREATE TRIGGER trg_prevent_stripe_customer_id_change
BEFORE UPDATE ON public.customer_accounts
FOR EACH ROW
EXECUTE FUNCTION public.prevent_stripe_customer_id_change();
