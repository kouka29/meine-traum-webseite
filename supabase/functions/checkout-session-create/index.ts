import { createClient } from 'npm:@supabase/supabase-js@2';
import { buildPricing, resolveAppliedFromStripe, InvalidCouponError } from '../_shared/checkout-pricing.ts';
import { type StripeEnv, createStripeClient } from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function respondForSession(sb: any, sessionRow: any) {
  const env: StripeEnv = sessionRow.environment === 'live' ? 'live' : 'sandbox';
  const stripe = createStripeClient(env);
  const codes: string[] = Array.isArray(sessionRow.applied_codes)
    ? sessionRow.applied_codes.filter((c: any) => typeof c === 'string')
    : [];
  const { data: rows } = codes.length
    ? await sb.from('discount_codes').select('code,type,label,stripe_coupon').in('code', codes)
    : { data: [] as any[] };
  const baseCents = Number(sessionRow.base_net_cents ?? 0) || 0;
  let applied;
  try {
    applied = await resolveAppliedFromStripe(stripe, rows ?? [], baseCents);
  } catch (e) {
    // If Stripe cannot price a previously-applied code (deleted coupon etc.),
    // fall back to a defensive representation with 0€ discount. The next
    // redeem-code / remove-code call will surface the error to the user.
    console.warn('respondForSession: stripe pricing failed', e);
    applied = (rows ?? []).map((r: any) => ({
      code: r.code, type: r.type, label: r.label, discount_amount_cents: 0,
    }));
  }
  return {
    session_id: sessionRow.id,
    applied_codes: applied,
    pricing: buildPricing(baseCents, applied),
    invoice_allowed: !!sessionRow.invoice_allowed,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const angebots_nr = typeof body?.angebots_nr === 'string' ? body.angebots_nr.trim().slice(0, 50) : null;
  const emailRaw = typeof body?.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : null;
  const email = emailRaw && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailRaw) ? emailRaw : null;
  const existingId = typeof body?.session_id === 'string' && UUID_RE.test(body.session_id.trim())
    ? body.session_id.trim() : null;
  const baseNetCentsIn = Number.isFinite(Number(body?.base_net_cents))
    ? Math.max(0, Math.round(Number(body.base_net_cents))) : null;
  const environment: StripeEnv = body?.environment === 'live' ? 'live' : 'sandbox';

  // Rehydrate an existing (still-valid) session so returning users see their
  // already-applied codes and invoice_allowed state on reload.
  if (existingId) {
    const { data: existing } = await sb
      .from('checkout_sessions')
      .select('*')
      .eq('id', existingId)
      .maybeSingle();
    if (existing && new Date(existing.expires_at).getTime() > Date.now()) {
      // Keep the stored base up to date whenever the client's selection
      // changes. Environment stays sticky after first creation.
      let refreshed = existing;
      if (baseNetCentsIn != null && baseNetCentsIn !== Number(existing.base_net_cents ?? -1)) {
        const { data: upd } = await sb
          .from('checkout_sessions')
          .update({ base_net_cents: baseNetCentsIn })
          .eq('id', existing.id)
          .select()
          .single();
        if (upd) refreshed = upd;
      }
      return new Response(JSON.stringify(await respondForSession(sb, refreshed)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Preseed invoice_allowed=true if the caller is an authenticated customer whose
  // account already has the permanent toggle enabled.
  let invoiceAllowedInit = false;
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token) {
    const { data: userData } = await sb.auth.getUser(token);
    const uid = userData?.user?.id;
    if (uid) {
      const { data: acc } = await sb
        .from('customer_accounts')
        .select('invoice_allowed')
        .eq('user_id', uid)
        .maybeSingle();
      if (acc?.invoice_allowed) invoiceAllowedInit = true;
    }
  }

  const { data: inserted, error } = await sb
    .from('checkout_sessions')
    .insert({
      angebots_nr, email, invoice_allowed: invoiceAllowedInit,
      base_net_cents: baseNetCentsIn,
      environment,
    })
    .select()
    .single();
  if (error || !inserted) {
    console.error('checkout-session-create insert failed:', error);
    return new Response(JSON.stringify({ error: 'Session konnte nicht angelegt werden' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(await respondForSession(sb, inserted)), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});