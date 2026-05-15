import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

const PRICE_TO_PACKAGE: Record<string, "starter" | "pro" | "premium"> = {
  starter_purchase_deposit: "starter",
  pro_purchase_deposit: "pro",
  premium_purchase_deposit: "premium",
};

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const meta = session.metadata || {};
  const priceLookup = meta.priceId as string | undefined;
  const pkg = (meta.package as string | undefined)
    || (priceLookup ? PRICE_TO_PACKAGE[priceLookup] : undefined);

  if (!pkg) {
    console.error("payments-webhook: cannot resolve package from session metadata", session.id);
    return;
  }

  const depositCents: number = session.amount_subtotal ?? session.amount_total ?? 0;
  // Stripe gibt amount_subtotal in der Bestell-Currency vor Tax. Falls 0, Fallback auf amount_total.
  const totalCents = depositCents * 2;

  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? null;
  const customerName = session.customer_details?.name ?? null;

  // Versuche, einen Lead per E-Mail zu verknüpfen
  let leadId: string | null = null;
  if (customerEmail) {
    const { data: lead } = await getSupabase()
      .from("leads")
      .select("id")
      .ilike("email", customerEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lead?.id) leadId = lead.id as string;
  }

  await getSupabase().from("purchases").upsert(
    {
      stripe_session_id: session.id,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
      package: pkg,
      deposit_amount_cents: depositCents,
      total_amount_cents: totalCents,
      currency: session.currency ?? "eur",
      customer_email: customerEmail,
      customer_name: customerName,
      status: "deposit_paid",
      lead_id: leadId,
      environment: env,
      metadata: {
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        tax: session.total_details?.amount_tax ?? null,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook: invalid env query param:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
