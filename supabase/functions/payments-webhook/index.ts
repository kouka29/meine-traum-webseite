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
  const pkg = (meta.paket as string | undefined)
    || (meta.package as string | undefined)
    || (priceLookup ? PRICE_TO_PACKAGE[priceLookup] : undefined)
    || "custom";
  const auftragsNr = meta.auftrags_nr as string | undefined;

  const paidCents: number = session.amount_total ?? session.amount_subtotal ?? 0;
  const totalCents = paidCents;

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
      deposit_amount_cents: paidCents,
      total_amount_cents: totalCents,
      currency: session.currency ?? "eur",
      customer_email: customerEmail,
      customer_name: customerName,
      status: "paid",
      lead_id: leadId,
      environment: env,
      metadata: {
        auftrags_nr: auftragsNr ?? null,
        angebots_id: meta.angebots_id ?? null,
        payment_mode: meta.payment_mode ?? null,
        mode: session.mode ?? null,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        tax: session.total_details?.amount_tax ?? null,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );

  // Buchung als bezahlt markieren, wenn auftrags_nr vorhanden
  if (auftragsNr) {
    await getSupabase()
      .from("buchungen")
      .update({ status: "bezahlt", updated_at: new Date().toISOString() })
      .eq("angebots_nr", auftragsNr);
  }

  // Wachstumspaket aus Metadata vormerken (verbindlich, aber NICHT hier abgerechnet).
  // Erste Rechnung kommt erst nach Go-Live (Admin-Trigger).
  const growthPackage = meta.growth_package as string | undefined;
  const growthAmount = Number(meta.growth_amount_cents);
  if (
    growthPackage && ["basic", "plus", "premium"].includes(growthPackage)
    && Number.isFinite(growthAmount) && growthAmount > 0
    && customerEmail
  ) {
    // idempotent: nicht doppelt einfügen, wenn schon eins zur Session existiert
    const { data: existing } = await getSupabase()
      .from("growth_subscriptions")
      .select("id")
      .eq("purchase_session_id", session.id)
      .maybeSingle();
    if (!existing) {
      await getSupabase().from("growth_subscriptions").insert({
        customer_email: customerEmail,
        purchase_session_id: session.id,
        stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
        package: growthPackage,
        monthly_amount_cents: growthAmount,
        min_term_months: Math.max(1, Math.round(Number(meta.growth_min_term) || 12)),
        billing_mode: "manual_invoice",
        status: "pending_golive",
        environment: env,
      });
    }
  }

  // Kundenportal-Account anlegen (idempotent) + stripe_customer_id speichern
  if (customerEmail) {
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/customer-create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({
          email: customerEmail,
          first_name: customerName,
          stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
          send_welcome: true,
        }),
      });
    } catch (e) {
      console.error("Kundenportal-Anlage (webhook) fehlgeschlagen:", e);
    }
  }
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
      case "invoice.payment_succeeded": {
        // Subscription-Renewal (Miete) – kein Auftrag-Update nötig, nur loggen
        console.log("Subscription invoice paid:", event.data.object?.id);
        break;
      }
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
