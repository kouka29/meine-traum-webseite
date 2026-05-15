import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PACKAGE_FROM_PRICE: Record<string, "starter" | "pro" | "premium"> = {
  starter_purchase_deposit: "starter",
  pro_purchase_deposit: "pro",
  premium_purchase_deposit: "premium",
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
    const priceId: string = body.priceId;
    const environment: StripeEnv = body.environment === "live" ? "live" : "sandbox";
    const returnUrl: string = body.returnUrl;
    const customerEmail: string | undefined = body.customerEmail;

    if (!priceId || !/^[a-zA-Z0-9_-]+$/.test(priceId)) {
      return new Response(JSON.stringify({ error: "Invalid priceId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!returnUrl || !returnUrl.startsWith("http")) {
      return new Response(JSON.stringify({ error: "Invalid returnUrl" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pkg = PACKAGE_FROM_PRICE[priceId];
    if (!pkg) {
      return new Response(JSON.stringify({ error: "Unknown price" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = createStripeClient(environment);

    const prices = await stripe.prices.list({ lookup_keys: [priceId], limit: 1 });
    if (!prices.data.length) {
      return new Response(JSON.stringify({ error: "Price not found in Stripe" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      ...(customerEmail && { customer_email: customerEmail }),
      payment_intent_data: {
        description: `Anzahlung (50%) – Webdesign-Paket ${pkg.charAt(0).toUpperCase() + pkg.slice(1)}`,
        metadata: { package: pkg, kind: "deposit" },
      },
      metadata: { package: pkg, kind: "deposit", priceId },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
