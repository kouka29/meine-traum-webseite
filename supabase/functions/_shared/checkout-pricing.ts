// Server-side pricing for checkout sessions. Single source of truth used by
// redeem-code, remove-code, checkout-session-create and buchung-erstellen.
// NEVER trust client-supplied amounts — always recompute here from
// buchungen/angebote via the session's angebots_nr.

// deno-lint-ignore no-explicit-any
type SB = any;

export interface AppliedCode {
  code: string;
  type: 'discount' | 'unlock';
  label: string;
  discount_amount_cents: number; // 0 for unlock
}

export interface Pricing {
  netto: number;      // euros
  mwst: number;       // euros
  brutto: number;     // euros
  netto_cents: number;
  mwst_cents: number;
  brutto_cents: number;
  discount_cents: number;
}

function round2(n: number) { return Math.round(n * 100) / 100; }

/**
 * Loads base amount (net cents) for a checkout session by looking up the
 * matching buchungen row via angebots_nr. Returns 0 if not resolvable — the
 * pricing is then purely informational (session hasn't reached checkout yet).
 */
export async function loadBaseNetCents(sb: SB, angebotsNr: string | null): Promise<number> {
  if (!angebotsNr) return 0;
  const { data } = await sb
    .from('buchungen')
    .select('gesamtbetrag_netto')
    .eq('angebots_nr', angebotsNr)
    .maybeSingle();
  const eur = Number(data?.gesamtbetrag_netto ?? 0);
  return Number.isFinite(eur) ? Math.round(eur * 100) : 0;
}

/**
 * Applies the currently active codes to the base net amount and returns
 * per-code discount details plus final pricing. Stripe still enforces the
 * discount authoritatively at checkout via the coupon; this calculation is
 * for UI display and consistency checks.
 */
export function computePricing(baseNetCents: number, codes: Array<{
  code: string; type: 'discount' | 'unlock'; label: string;
  percent_off: number | null; amount_off_cents: number | null;
}>): { pricing: Pricing; applied: AppliedCode[] } {
  let discountCents = 0;
  const applied: AppliedCode[] = [];
  for (const c of codes) {
    let d = 0;
    if (c.type === 'discount') {
      if (c.percent_off != null) d = Math.round(baseNetCents * (Number(c.percent_off) / 100));
      else if (c.amount_off_cents != null) d = Math.min(baseNetCents, Number(c.amount_off_cents));
    }
    discountCents += d;
    applied.push({ code: c.code, type: c.type, label: c.label, discount_amount_cents: d });
  }
  discountCents = Math.min(discountCents, baseNetCents);
  const netCents = baseNetCents - discountCents;
  const vatCents = Math.round(netCents * 0.19);
  const grossCents = netCents + vatCents;
  return {
    pricing: {
      netto: round2(netCents / 100),
      mwst: round2(vatCents / 100),
      brutto: round2(grossCents / 100),
      netto_cents: netCents,
      mwst_cents: vatCents,
      brutto_cents: grossCents,
      discount_cents: discountCents,
    },
    applied,
  };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('cf-connecting-ip') || '0.0.0.0';
}

// Whitelist of allowed unlock flags — prevents an attacker who somehow gets
// write access to discount_codes from setting arbitrary columns on sessions.
export const ALLOWED_UNLOCK_FLAGS = new Set(['invoice_allowed']);

export const RATE_LIMITS = {
  perSession: 10,
  perIpFailWindowMin: 60,
  perIpFailMax: 20,
};

export async function checkRateLimits(sb: SB, sessionId: string, ip: string): Promise<
  { ok: true } | { ok: false; reason: string }
> {
  const { count: sessionCount } = await sb
    .from('code_redemption_log')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId);
  if ((sessionCount ?? 0) >= RATE_LIMITS.perSession) {
    return { ok: false, reason: 'Zu viele Einlöseversuche für diese Sitzung.' };
  }
  const since = new Date(Date.now() - RATE_LIMITS.perIpFailWindowMin * 60_000).toISOString();
  const { count: ipFailCount } = await sb
    .from('code_redemption_log')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('success', false)
    .gte('created_at', since);
  if ((ipFailCount ?? 0) >= RATE_LIMITS.perIpFailMax) {
    return { ok: false, reason: 'Zu viele Fehlversuche. Bitte in einer Stunde erneut versuchen.' };
  }
  return { ok: true };
}

export async function logRedemption(sb: SB, params: {
  sessionId: string | null; ip: string; code: string; success: boolean; reason?: string | null;
}) {
  try {
    await sb.from('code_redemption_log').insert({
      session_id: params.sessionId,
      ip_address: params.ip,
      code: params.code,
      success: params.success,
      reason: params.reason ?? null,
    });
  } catch (e) {
    console.error('code_redemption_log insert failed:', e);
  }
}