import { createClient } from "npm:@supabase/supabase-js@2";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PACKAGE_NAMES: Record<string, string> = {
  basic: "Wachstumspaket Basic",
  plus: "Wachstumspaket Plus",
  premium: "Wachstumspaket Premium",
};

async function processOne(sb: any, env: StripeEnv, row: any) {
  const stripe = createStripeClient(env);

  // Stripe-Customer sicherstellen (per Email)
  let customerId = row.stripe_customer_id as string | null;
  if (!customerId) {
    const list = await stripe.customers.list({ email: row.customer_email, limit: 1 });
    customerId = list.data[0]?.id
      ?? (await stripe.customers.create({ email: row.customer_email })).id;
  }

  // 1. Invoice-Item anlegen
  await stripe.invoiceItems.create({
    customer: customerId,
    amount: row.monthly_amount_cents,
    currency: "eur",
    description: `${PACKAGE_NAMES[row.package] || "Wachstumspaket"} – Monatsbeitrag`,
  });

  // 2. Invoice erstellen (send_invoice = Stripe schickt Bezahllink per Mail)
  const inv = await stripe.invoices.create({
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: 14,
    auto_advance: true,
    description: `Wachstumspaket – ${new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}`,
    metadata: { growth_subscription_id: row.id, package: row.package },
  });

  // 3. Finalize + Senden
  const final = await stripe.invoices.finalizeInvoice(inv.id);
  if (final.status === "open") {
    await stripe.invoices.sendInvoice(inv.id);
  }

  // 4. DB updaten – nächste Rechnung in einem Monat
  const next = new Date();
  next.setMonth(next.getMonth() + 1);

  await sb.from("growth_subscriptions").update({
    stripe_customer_id: customerId,
    last_invoice_id: inv.id,
    last_invoice_status: final.status,
    last_invoice_at: new Date().toISOString(),
    next_invoice_at: next.toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", row.id);

  return { id: row.id, invoice_id: inv.id, status: final.status };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, SERVICE_KEY);

  let body: any = {};
  try { body = await req.json(); } catch {}

  // Auth-Guard: nur Service-Role-Calls (z. B. aus admin-leads/growth-golive) oder
  // Aufrufe mit gültigem ADMIN_PASSWORD dürfen Rechnungen auslösen.
  const authHeader = req.headers.get("Authorization") ?? "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const isServiceRole = !!SERVICE_KEY && bearer === SERVICE_KEY;
  if (!isServiceRole) {
    if (!ADMIN_PASSWORD || body.password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Nicht autorisiert" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }

  const env: StripeEnv = body.env === "live" ? "live" : "sandbox";
  const singleId: string | undefined = body.growth_subscription_id;

  let query = sb.from("growth_subscriptions").select("*")
    .eq("environment", env)
    .eq("billing_mode", "manual_invoice")
    .eq("status", "active");

  if (singleId) {
    query = sb.from("growth_subscriptions").select("*").eq("id", singleId);
  } else {
    query = query.lte("next_invoice_at", new Date().toISOString());
  }

  const { data: rows, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: any[] = [];
  for (const row of rows || []) {
    try {
      results.push(await processOne(sb, env, row));
    } catch (e) {
      console.error("growth-invoice-create error for", row.id, e);
      results.push({ id: row.id, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});