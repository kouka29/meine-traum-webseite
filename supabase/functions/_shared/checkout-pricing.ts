// Server-side pricing for checkout sessions. Single source of truth used by
// redeem-code, remove-code and checkout-session-create.
// The discount amount for every code is ALWAYS retrieved from Stripe
// (stripe.coupons.retrieve) — never from a duplicated DB column. If Stripe
// cannot resolve amount_off / percent_off for a discount code, the caller
// MUST reject the code as invalid.

// deno-lint-ignore no-explicit-any
type SB = any;
// deno-lint-ignore no-explicit-any
type StripeLike = any;

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
  base_net_cents: number;
}

function round2(n: number) { return Math.round(n * 100) / 100; }

export class InvalidCouponError extends Error {
  constructor(public readonly code: string, msg = 'Code ungültig oder nicht mehr verfügbar.') {
    super(msg);
  }
}

/**
 * Retrieves a coupon from Stripe and returns the discount amount in cents
 * applied against the given base. Throws InvalidCouponError if the coupon
 * is missing, inactive, or has neither amount_off nor percent_off.
 */
export async function fetchCouponDiscountCents(
  stripe: StripeLike,
  couponId: string,
  baseNetCents: number,
  code: string,
): Promise<number> {
  let coupon: any;
  try {
    coupon = await stripe.coupons.retrieve(couponId);
  } catch (_e) {
    throw new InvalidCouponError(code);
  }
  if (!coupon || coupon.valid === false) throw new InvalidCouponError(code);
  if (typeof coupon.amount_off === 'number' && coupon.amount_off > 0) {
    // Stripe returns amount_off in the coupon's currency smallest unit (cents for EUR).
    return Math.min(baseNetCents, Math.round(coupon.amount_off));
  }
  if (typeof coupon.percent_off === 'number' && coupon.percent_off > 0) {
    return Math.min(baseNetCents, Math.round(baseNetCents * (coupon.percent_off / 100)));
  }
  throw new InvalidCouponError(code);
}

/**
 * Resolves discount amounts for every active discount code by consulting
 * Stripe. Unlock codes always resolve to 0. Throws InvalidCouponError on
 * the first discount code Stripe cannot price.
 */
export async function resolveAppliedFromStripe(
  stripe: StripeLike,
  codes: Array<{ code: string; type: 'discount' | 'unlock'; label: string; stripe_coupon: string | null }>,
  baseNetCents: number,
): Promise<AppliedCode[]> {
  const out: AppliedCode[] = [];
  for (const c of codes) {
    if (c.type === 'unlock') {
      out.push({ code: c.code, type: 'unlock', label: c.label, discount_amount_cents: 0 });
      continue;
    }
    if (!c.stripe_coupon) throw new InvalidCouponError(c.code);
    const d = await fetchCouponDiscountCents(stripe, c.stripe_coupon, baseNetCents, c.code);
    out.push({ code: c.code, type: 'discount', label: c.label, discount_amount_cents: d });
  }
  return out;
}

/**
 * Builds the Pricing object from base amount and already-resolved discounts.
 *   netto_final = max(0, base_net - Σ discount_amount)
 *   mwst        = round(netto_final * 0.19)
 *   brutto      = netto_final + mwst
 */
export function buildPricing(baseNetCents: number, applied: AppliedCode[]): Pricing {
  const base = Math.max(0, Math.round(baseNetCents || 0));
  const totalDiscount = Math.min(
    base,
    applied.reduce((s, a) => s + Math.max(0, a.discount_amount_cents | 0), 0),
  );
  const netCents = Math.max(0, base - totalDiscount);
  const vatCents = Math.round(netCents * 0.19);
  const grossCents = netCents + vatCents;
  return {
    netto: round2(netCents / 100),
    mwst: round2(vatCents / 100),
    brutto: round2(grossCents / 100),
    netto_cents: netCents,
    mwst_cents: vatCents,
    brutto_cents: grossCents,
    discount_cents: totalDiscount,
    base_net_cents: base,
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