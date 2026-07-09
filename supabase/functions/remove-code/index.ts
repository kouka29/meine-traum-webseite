import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  computePricing,
  getClientIp,
  loadBaseNetCents,
  logRedemption,
} from '../_shared/checkout-pricing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const ip = getClientIp(req);

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ ok: false, reason: 'Ungültige Anfrage' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const sessionId = String(body?.session_id || '').trim();
  const codeInput = String(body?.code || '').trim().toUpperCase();
  if (!UUID_RE.test(sessionId) || !codeInput) {
    return new Response(JSON.stringify({ ok: false, reason: 'Ungültige Eingabe' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: session } = await sb.from('checkout_sessions').select('*').eq('id', sessionId).maybeSingle();
  if (!session) {
    return new Response(JSON.stringify({ ok: false, reason: 'Sitzung nicht gefunden' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const applied: string[] = Array.isArray(session.applied_codes) ? session.applied_codes.filter((c: any) => typeof c === 'string') : [];
  if (!applied.includes(codeInput)) {
    return new Response(JSON.stringify({ ok: false, reason: 'Code nicht aktiv' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const nextApplied = applied.filter(c => c !== codeInput);

  // Recompute unlock flags from remaining codes. Session-level flag stays true
  // if any remaining unlock code still sets it. customer_accounts is never
  // touched here — that toggle is admin-only.
  const { data: allRows } = await sb.from('discount_codes').select('*').in('code', nextApplied.length ? nextApplied : ['__none__']);
  const remainingUnlockInvoice = (allRows ?? []).some((r: any) => r.type === 'unlock' && r.unlock_flag === 'invoice_allowed');
  const invoiceAllowed = remainingUnlockInvoice; // session-scoped flag only

  const { error: updErr } = await sb.from('checkout_sessions')
    .update({ applied_codes: nextApplied, invoice_allowed: invoiceAllowed })
    .eq('id', sessionId);
  if (updErr) {
    return new Response(JSON.stringify({ ok: false, reason: 'Speichern fehlgeschlagen' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const baseCents = await loadBaseNetCents(sb, session.angebots_nr);
  const { pricing, applied: appliedDetail } = computePricing(baseCents, allRows ?? []);

  await logRedemption(sb, { sessionId, ip, code: codeInput, success: true, reason: 'removed' });

  return new Response(JSON.stringify({
    ok: true,
    applied_codes: appliedDetail,
    pricing,
    invoice_allowed: invoiceAllowed,
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});