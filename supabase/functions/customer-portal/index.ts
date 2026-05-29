import { createClient } from "npm:@supabase/supabase-js@2";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getUser(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: { user } } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
  return user;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const user = await getUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const action = String(body.action || "");
  const env: StripeEnv = body.env === "live" ? "live" : "sandbox";

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: account } = await supabase.from("customer_accounts").select("stripe_customer_id, email").eq("user_id", user.id).maybeSingle();

  let customerId = account?.stripe_customer_id as string | null;

  // Fallback: stripe_customer_id aus letzter Buchung holen
  if (!customerId) {
    const { data: purchases } = await supabase
      .from("purchases")
      .select("stripe_customer_id")
      .ilike("customer_email", account?.email || user.email || "")
      .not("stripe_customer_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1);
    customerId = purchases?.[0]?.stripe_customer_id ?? null;
    if (customerId && account) {
      await supabase.from("customer_accounts").update({ stripe_customer_id: customerId }).eq("user_id", user.id);
    }
  }

  try {
    const stripe = createStripeClient(env);

    if (action === "invoices") {
      if (!customerId) return new Response(JSON.stringify({ invoices: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const list = await stripe.invoices.list({ customer: customerId, limit: 50 });
      const invoices = list.data.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amount_paid: inv.amount_paid,
        amount_due: inv.amount_due,
        currency: inv.currency,
        status: inv.status,
        created: inv.created,
        hosted_invoice_url: inv.hosted_invoice_url,
        invoice_pdf: inv.invoice_pdf,
        period_start: inv.period_start,
        period_end: inv.period_end,
      }));
      return new Response(JSON.stringify({ invoices }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "portal") {
      if (!customerId) {
        return new Response(JSON.stringify({ error: "Noch kein Stripe-Kundenkonto vorhanden – wird mit der ersten Zahlung erstellt." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const returnUrl = String(body.return_url || "https://meine-traum-webseite.de/kundenportal/einstellungen");
      const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
      return new Response(JSON.stringify({ url: session.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unbekannte Aktion" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("customer-portal error", e);
    return new Response(JSON.stringify({ error: e?.message || "Stripe-Fehler" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});