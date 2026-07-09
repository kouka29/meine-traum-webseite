import { createClient } from 'npm:@supabase/supabase-js@2';
import { loadBaseNetCents, computePricing } from '../_shared/checkout-pricing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
    .insert({ angebots_nr, email, invoice_allowed: invoiceAllowedInit })
    .select()
    .single();
  if (error || !inserted) {
    console.error('checkout-session-create insert failed:', error);
    return new Response(JSON.stringify({ error: 'Session konnte nicht angelegt werden' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const baseCents = await loadBaseNetCents(sb, angebots_nr);
  const { pricing, applied } = computePricing(baseCents, []);

  return new Response(JSON.stringify({
    session_id: inserted.id,
    applied_codes: applied,
    pricing,
    invoice_allowed: inserted.invoice_allowed,
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});