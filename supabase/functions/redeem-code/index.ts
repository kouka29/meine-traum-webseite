import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  ALLOWED_UNLOCK_FLAGS,
  checkRateLimits,
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
const GENERIC_INVALID = 'Code ungültig oder nicht mehr verfügbar.';

interface CodeRow {
  code: string;
  type: 'discount' | 'unlock';
  stripe_coupon: string | null;
  unlock_flag: string | null;
  label: string;
  percent_off: number | null;
  amount_off_cents: number | null;
  active: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
}

async function loadActiveDiscountCodes(sb: any, codes: string[]): Promise<CodeRow[]> {
  if (!codes.length) return [];
  const { data } = await sb.from('discount_codes').select('*').in('code', codes);
  return (data ?? []) as CodeRow[];
}

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
  if (!UUID_RE.test(sessionId) || !codeInput || codeInput.length > 64) {
    await logRedemption(sb, { sessionId: null, ip, code: codeInput || '(empty)', success: false, reason: 'invalid_input' });
    return new Response(JSON.stringify({ ok: false, reason: 'Ungültige Eingabe.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Rate-Limits BEFORE any DB lookup that could leak information.
  const rl = await checkRateLimits(sb, sessionId, ip);
  if (!rl.ok) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'rate_limited' });
    return new Response(JSON.stringify({ ok: false, reason: rl.reason }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: session } = await sb.from('checkout_sessions').select('*').eq('id', sessionId).maybeSingle();
  if (!session) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'session_missing' });
    return new Response(JSON.stringify({ ok: false, reason: 'Sitzung nicht gefunden.' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'session_expired' });
    return new Response(JSON.stringify({ ok: false, reason: 'Sitzung abgelaufen.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const applied: string[] = Array.isArray(session.applied_codes) ? session.applied_codes.filter((c: any) => typeof c === 'string') : [];
  if (applied.includes(codeInput)) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'already_applied' });
    return new Response(JSON.stringify({ ok: false, reason: 'Code bereits eingelöst.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data: codeRow } = await sb.from('discount_codes').select('*').eq('code', codeInput).maybeSingle();
  const row = codeRow as CodeRow | null;
  if (!row || !row.active
      || (row.expires_at && new Date(row.expires_at).getTime() < Date.now())
      || (row.max_uses != null && row.used_count >= row.max_uses)) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'invalid_or_expired' });
    return new Response(JSON.stringify({ ok: false, reason: GENERIC_INVALID }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (row.type === 'unlock' && (!row.unlock_flag || !ALLOWED_UNLOCK_FLAGS.has(row.unlock_flag))) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'unlock_flag_not_allowed' });
    return new Response(JSON.stringify({ ok: false, reason: GENERIC_INVALID }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Build next applied list.
  let replaced: string | undefined;
  let nextApplied: string[];
  if (row.type === 'discount') {
    // Only one discount allowed → replace any existing discount codes.
    const existingRows = await loadActiveDiscountCodes(sb, applied);
    const removeDiscount = existingRows.filter(r => r.type === 'discount').map(r => r.code);
    if (removeDiscount.length) replaced = removeDiscount[0];
    nextApplied = applied.filter(c => !removeDiscount.includes(c)).concat(row.code);
  } else {
    nextApplied = applied.concat(row.code);
  }

  // Determine unlock flags from remaining applied codes.
  const allRows = await loadActiveDiscountCodes(sb, nextApplied);
  const invoiceAllowed = session.invoice_allowed
    || allRows.some(r => r.type === 'unlock' && r.unlock_flag === 'invoice_allowed');

  // Atomic-ish increment of used_count with max_uses guard.
  const { error: incErr } = await sb.from('discount_codes')
    .update({ used_count: row.used_count + 1 })
    .eq('code', row.code)
    .eq('used_count', row.used_count);
  if (incErr) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'increment_conflict' });
    return new Response(JSON.stringify({ ok: false, reason: GENERIC_INVALID }), {
      status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { error: updErr } = await sb.from('checkout_sessions')
    .update({ applied_codes: nextApplied, invoice_allowed: invoiceAllowed })
    .eq('id', sessionId);
  if (updErr) {
    await logRedemption(sb, { sessionId, ip, code: codeInput, success: false, reason: 'session_update_failed' });
    return new Response(JSON.stringify({ ok: false, reason: 'Speichern fehlgeschlagen.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const baseCents = await loadBaseNetCents(sb, session.angebots_nr);
  const { pricing, applied: appliedDetail } = computePricing(baseCents, allRows);

  await logRedemption(sb, { sessionId, ip, code: codeInput, success: true, reason: null });

  return new Response(JSON.stringify({
    ok: true,
    applied_codes: appliedDetail,
    pricing,
    invoice_allowed: invoiceAllowed,
    ...(replaced ? { replaced } : {}),
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});