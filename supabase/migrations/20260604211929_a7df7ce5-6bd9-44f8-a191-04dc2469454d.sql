-- 1) angebote: revoke sensitive columns from authenticated SELECT
REVOKE SELECT (pin, base64_data, stripe_link) ON public.angebote FROM authenticated;
REVOKE SELECT (pin, base64_data, stripe_link) ON public.angebote FROM anon;

-- 2) growth_subscriptions: drop email-claim fallback
DROP POLICY IF EXISTS "Users view own growth subscription" ON public.growth_subscriptions;
CREATE POLICY "Users view own growth subscription"
ON public.growth_subscriptions
FOR SELECT
TO authenticated
USING (user_id IS NOT NULL AND auth.uid() = user_id);