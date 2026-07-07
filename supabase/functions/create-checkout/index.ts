import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Item = {
  name: string;
  description?: string;
  amount_cents: number;
  recurring?: "month" | "year" | null;
  quantity?: number;
};

// Tolerance for cent-level rounding differences between client display and
// server-computed totals. Any larger mismatch is treated as a tampering attempt.
const AMOUNT_TOLERANCE_CENTS = 10;

// Whitelist der erlaubten Angebots-Codes → Stripe-Coupon-ID + priceId, für die
// der Coupon gültig ist. Alles außerhalb dieser Map wird ignoriert (Normalpreis).
// Rabatte werden ausschließlich hier bestimmt — niemals aus der URL berechnet.
const OFFER_TO_COUPON: Record<string, { coupon: string; requiredPriceId: string }> = {
  "cbi-y1":     { coupon: "CBI-Y1",     requiredPriceId: "pro_rent_monthly" },
  "cbi-kauf25": { coupon: "CBI-KAUF25", requiredPriceId: "pro_purchase_deposit" },
};

function resolveExpectedPriceId(paketId: string, paymentMode: "kauf" | "miete"): string | null {
  const p = (paketId || "").toLowerCase();
  if (!["starter", "pro", "premium"].includes(p)) return null;
  return paymentMode === "miete" ? `${p}_rent_monthly` : `${p}_purchase_deposit`;
}

type TrustedTotals = {
  // Sum of client-supplied item amounts (cents * quantity) MUST match this.
  subtotalCents: number;
  // Human-friendly label used for error/log context only.
  source: string;
};

function clientSubtotalCents(items: Item[]): number {
  return items.reduce(
    (sum, it) =>
      sum +
      Math.round(it.amount_cents) *
        Math.max(1, Math.min(100, it.quantity || 1)),
    0,
  );
}

async function resolveTrustedTotals(opts: {
  supabase: ReturnType<typeof createClient>;
  metadata: Record<string, string>;
  mode: "payment" | "subscription";
}): Promise<TrustedTotals | null> {
  const { supabase, metadata, mode } = opts;

  // Path A: Wachstumspaket-Umstellung (Kundenportal)
  const growthId = typeof metadata.growth_subscription_id === "string"
    ? metadata.growth_subscription_id.trim()
    : "";
  if (growthId) {
    const { data, error } = await supabase
      .from("growth_subscriptions")
      .select("monthly_amount_cents")
      .eq("id", growthId)
      .maybeSingle();
    if (error || !data || typeof data.monthly_amount_cents !== "number") {
      throw new Error("growth_subscription not found");
    }
    return {
      subtotalCents: Math.round(data.monthly_amount_cents),
      source: `growth_subscription:${growthId}`,
    };
  }

  // Path B: Angebots-/Buchungs-Funnel
  const auftragsNr = typeof metadata.auftrags_nr === "string"
    ? metadata.auftrags_nr.trim()
    : "";
  if (!auftragsNr) return null;

  const { data: buchung, error } = await supabase
    .from("buchungen")
    .select("gesamtbetrag_netto, pakete, addons")
    .eq("angebots_nr", auftragsNr)
    .maybeSingle();
  if (error || !buchung) throw new Error("buchung not found");

  const pakete = Array.isArray(buchung.pakete) ? buchung.pakete as any[] : [];
  const addons = Array.isArray(buchung.addons) ? buchung.addons as any[] : [];

  const paymentMode = metadata.payment_mode === "miete" ? "miete" : "kauf";

  let trustedEuro = 0;
  if (mode === "subscription" || paymentMode === "miete") {
    // Miete: monatliche Basis + monatliche Addons
    for (const p of pakete) {
      const mietpreis = Number(p?.mietpreis ?? p?.miete_monatlich ?? 0);
      trustedEuro += Number.isFinite(mietpreis) ? mietpreis : 0;
    }
    for (const a of addons) {
      const typ = a?.typ || (a?.price_type === "monthly" ? "monatlich" : "einmalig");
      if (typ === "monatlich") {
        const preis = a?.preis != null ? Number(a.preis) : Number(a?.price_cents || 0) / 100;
        trustedEuro += Number.isFinite(preis) ? preis : 0;
      }
    }
  } else {
    // Kauf: einmalige Basis (bzw. Anzahlung falls hinterlegt) + einmalige Addons
    for (const p of pakete) {
      const anzahlung = Number(p?.anzahlung ?? 0);
      const preis = Number(p?.preis ?? 0);
      trustedEuro += anzahlung > 0 ? anzahlung : (Number.isFinite(preis) ? preis : 0);
    }
    for (const a of addons) {
      const typ = a?.typ || (a?.price_type === "monthly" ? "monatlich" : "einmalig");
      if (typ === "einmalig") {
        const preis = a?.preis != null ? Number(a.preis) : Number(a?.price_cents || 0) / 100;
        trustedEuro += Number.isFinite(preis) ? preis : 0;
      }
    }
  }

  return {
    subtotalCents: Math.round(trustedEuro * 100),
    source: `buchung:${auftragsNr}`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const environment: StripeEnv = body.environment === "live" ? "live" : "sandbox";
    const returnUrl: string = body.returnUrl;
    const customerEmail: string | undefined = body.customerEmail;
    let items: Item[] = Array.isArray(body.items) ? body.items : [];
    const priceId: string | undefined = typeof body.priceId === "string" ? body.priceId : undefined;
    const mode: "payment" | "subscription" = body.mode === "subscription" ? "subscription" : "payment";
    const description: string = typeof body.description === "string" ? body.description.slice(0, 200) : "Webdesign-Auftrag";
    const metadata: Record<string, string> = (body.metadata && typeof body.metadata === "object") ? body.metadata : {};

    if (!returnUrl || !returnUrl.startsWith("http")) {
      return new Response(JSON.stringify({ error: "Invalid returnUrl" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const stripe = createStripeClient(environment);

    // Legacy path: resolve a single Stripe price via lookup_key when items[] not provided.
    if (!items.length && priceId) {
      if (!/^[a-zA-Z0-9_-]+$/.test(priceId)) {
        return new Response(JSON.stringify({ error: "Invalid priceId" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const prices = await stripe.prices.list({ lookup_keys: [priceId], expand: ["data.product"] });
      if (!prices.data.length) {
        return new Response(JSON.stringify({ error: "Price not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const p = prices.data[0];
      const product: any = p.product;
      const isRecurring = p.type === "recurring";
      if (typeof p.unit_amount !== "number") {
        return new Response(JSON.stringify({ error: "Price amount not found" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const vatCents = Math.round(p.unit_amount * 0.19);
      const lineItems = [
        { price: p.id, quantity: 1 },
        {
          price_data: {
            currency: p.currency,
            product_data: { name: "MwSt. 19%" },
            unit_amount: vatCents,
            ...(isRecurring && p.recurring?.interval
              ? { recurring: { interval: p.recurring.interval } }
              : {}),
          },
          quantity: 1,
        },
      ];
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: isRecurring ? "subscription" : "payment",
        ui_mode: "embedded_page",
        return_url: returnUrl,
        ...(customerEmail && { customer_email: customerEmail }),
        ...(!isRecurring && { payment_intent_data: { description: product?.name || description } }),
      });
      return new Response(JSON.stringify({ clientSecret: session.client_secret, sessionId: session.id }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!items.length) {
      return new Response(JSON.stringify({ error: "No items" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    for (const it of items) {
      if (!it.name || typeof it.amount_cents !== "number" || it.amount_cents < 50) {
        return new Response(JSON.stringify({ error: "Invalid item" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // SICHERHEIT: Preise müssen serverseitig gegen die Quelle-der-Wahrheit
    // verifiziert werden, damit ein manipulierter Client keinen Rabatt
    // erzeugen kann. Wir erlauben items[] ausschließlich in Verbindung mit
    // einer serverseitig auflösbaren Metadata-Referenz (Buchung oder
    // Wachstums-Abo). Der Summenbetrag muss zur Quelle passen.
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    let trusted: TrustedTotals | null = null;
    try {
      trusted = await resolveTrustedTotals({ supabase: admin, metadata, mode });
    } catch (e) {
      console.warn("create-checkout: trusted lookup failed", e);
      return new Response(JSON.stringify({ error: "Auftrag konnte nicht verifiziert werden" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!trusted) {
      return new Response(JSON.stringify({ error: "Missing trusted reference (auftrags_nr oder growth_subscription_id erforderlich)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const clientSubtotal = clientSubtotalCents(items);
    if (Math.abs(clientSubtotal - trusted.subtotalCents) > AMOUNT_TOLERANCE_CENTS) {
      console.warn("create-checkout: price mismatch", {
        source: trusted.source,
        clientSubtotal,
        trustedSubtotal: trusted.subtotalCents,
      });
      return new Response(JSON.stringify({ error: "Preis stimmt nicht mit dem hinterlegten Auftrag überein" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lineItems = items.map((it) => ({
      price_data: {
        currency: "eur",
        product_data: { name: it.name.slice(0, 250), ...(it.description ? { description: it.description.slice(0, 500) } : {}) },
        unit_amount: Math.round(it.amount_cents),
        ...(mode === "subscription" && it.recurring ? { recurring: { interval: it.recurring } } : {}),
      },
      quantity: Math.max(1, Math.min(100, it.quantity || 1)),
    }));

    // 19% MwSt. als eigene Position hinzufügen (zzgl. auf Netto-Preise).
    const subtotalCents = items.reduce(
      (sum, it) => sum + Math.round(it.amount_cents) * Math.max(1, Math.min(100, it.quantity || 1)),
      0,
    );
    const vatCents = Math.round(subtotalCents * 0.19);
    if (vatCents > 0) {
      const recurringItem = items.find((it) => it.recurring);
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "MwSt. 19%" },
          unit_amount: vatCents,
          ...(mode === "subscription" && recurringItem?.recurring
            ? { recurring: { interval: recurringItem.recurring } }
            : {}),
        },
        quantity: 1,
      });
    }

    // Stripe metadata: max 50 keys, max 500 chars per value
    const safeMetadata: Record<string, string> = {};
    for (const [k, v] of Object.entries(metadata)) {
      if (typeof v === "string") safeMetadata[k.slice(0, 40)] = v.slice(0, 500);
    }

    // Angebots-Code → Stripe-Coupon (serverseitig validiert).
    // Nur anwenden, wenn (a) Code in Whitelist ist UND (b) das aufgelöste
    // priceId zum Coupon passt UND (c) der Session-Modus zur Coupon-Duration
    // passt (once → payment, repeating months → subscription). Sonst still
    // ignorieren (kein Fehler → Normalpreis).
    const offerRaw = typeof metadata.offer_code === "string" ? metadata.offer_code.trim().toLowerCase() : "";
    const paymentModeMeta: "kauf" | "miete" = metadata.payment_mode === "miete" ? "miete" : "kauf";
    const expectedPriceId = resolveExpectedPriceId(metadata.paket || "", paymentModeMeta);
    const offerMapping = offerRaw ? OFFER_TO_COUPON[offerRaw] : undefined;
    let discounts: { coupon: string }[] | undefined;
    if (offerMapping && expectedPriceId === offerMapping.requiredPriceId) {
      const priceIsRecurring = /_rent_monthly$/.test(expectedPriceId);
      const sessionIsSubscription = mode === "subscription";
      if (priceIsRecurring === sessionIsSubscription) {
        discounts = [{ coupon: offerMapping.coupon }];
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode,
      ui_mode: "embedded_page",
      return_url: returnUrl,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(discounts ? { discounts } : {}),
      ...(mode === "payment"
        ? { payment_method_types: ["card", "paypal", "sepa_debit", "klarna"] }
        : {}),
      ...(mode === "payment"
        ? { payment_intent_data: { description, metadata: safeMetadata } }
        : { subscription_data: { description, metadata: safeMetadata } }),
      metadata: safeMetadata,
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret, sessionId: session.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
