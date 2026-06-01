import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

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
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: p.id, quantity: 1 }],
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

    const lineItems = items.map((it) => ({
      price_data: {
        currency: "eur",
        product_data: { name: it.name.slice(0, 250), ...(it.description ? { description: it.description.slice(0, 500) } : {}) },
        unit_amount: Math.round(it.amount_cents),
        ...(mode === "subscription" && it.recurring ? { recurring: { interval: it.recurring } } : {}),
      },
      quantity: Math.max(1, Math.min(100, it.quantity || 1)),
    }));

    // Stripe metadata: max 50 keys, max 500 chars per value
    const safeMetadata: Record<string, string> = {};
    for (const [k, v] of Object.entries(metadata)) {
      if (typeof v === "string") safeMetadata[k.slice(0, 40)] = v.slice(0, 500);
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode,
      ui_mode: "embedded_page",
      return_url: returnUrl,
      ...(customerEmail && { customer_email: customerEmail }),
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
