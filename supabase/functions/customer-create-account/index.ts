import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Meine Traum Webseite <info@meine-traum-webseite.de>";
const PORTAL_URL = "https://meine-traum-webseite.de/kundenportal";

function welcomeMail(name: string, redirect: string) {
  return `<!DOCTYPE html><html><body style="font-family:Helvetica,Arial,sans-serif;margin:0;background:#F5F4FF">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(79,63,240,.08)">
    <div style="background:linear-gradient(135deg,#4F3FF0,#7B5EF8);padding:32px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:22px">Dein Kundenportal ist bereit 🎉</h1>
    </div>
    <div style="padding:32px">
      <p style="font-size:16px;color:#1E1B4B;margin:0 0 16px">Hallo ${name || "und herzlich willkommen"},</p>
      <p style="font-size:14px;color:#6B7280;line-height:1.7;margin:0 0 24px">
        wir haben dein persönliches Kundenportal eingerichtet. Dort siehst du jederzeit
        dein Paket, deine Rechnungen, Vertragsdaten und kannst Änderungswünsche direkt an uns senden.
      </p>
      <p style="text-align:center;margin:0 0 24px">
        <a href="${redirect}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#4F3FF0,#7B5EF8);color:#fff;text-decoration:none;border-radius:12px;font-weight:700">Zum Kundenportal</a>
      </p>
      <p style="font-size:13px;color:#6B7280;line-height:1.6;margin:0">
        Melde dich mit deiner E-Mail-Adresse und deinem Passwort an. Falls du noch kein Passwort hast,
        kannst du es auf der Login-Seite über „Passwort vergessen oder erstes Passwort setzen“ festlegen.
      </p>
    </div>
    <div style="background:#1E1B4B;padding:24px;text-align:center;color:rgba(255,255,255,.6);font-size:12px">
      QK Marketing Group · info@meine-traum-webseite.de
    </div>
  </div></body></html>`;
}

async function sendResend(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
  } catch (e) { console.error("welcome mail failed", e); }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Optionaler Admin-Schutz für manuelle Aufrufe vom Admin-UI
  // (Server-to-Server-Aufrufe aus anderen Edge Functions benutzen die Service-Key-URL und brauchen kein Passwort)
  if (body.password !== undefined && body.password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Ungültiges Passwort" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Ungültige E-Mail" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const first_name = String(body.first_name || "").trim().slice(0, 100) || null;
  const company_name = String(body.company_name || "").trim().slice(0, 200) || null;
  const phone = String(body.phone || "").trim().slice(0, 50) || null;
  const stripe_customer_id = body.stripe_customer_id ? String(body.stripe_customer_id) : null;
  const sendWelcome = body.send_welcome !== false;

  const linkLeadId = body.lead_id ? String(body.lead_id) : null;
  const linkBuchungId = body.buchung_id ? String(body.buchung_id) : null;
  const linkAngebotId = body.angebot_id ? String(body.angebot_id) : null;

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // 1. User finden oder anlegen (idempotent)
  let userId: string | null = null;

  // Existierenden User per E-Mail finden (über admin.listUsers mit Filter)
  const { data: existing } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const match = existing?.users?.find((u: any) => (u.email || "").toLowerCase() === email);
  if (match) {
    userId = match.id;
  } else {
    const { data: created, error: cErr } = await supabase.auth.admin.createUser({
      email, email_confirm: true,
      user_metadata: { first_name, company_name, phone },
    });
    if (cErr || !created.user) {
      return new Response(JSON.stringify({ error: cErr?.message || "User-Anlage fehlgeschlagen" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    userId = created.user.id;
  }

  // 2. customer_accounts upsert
  const { error: upErr } = await supabase.from("customer_accounts").upsert({
    user_id: userId,
    email,
    first_name, company_name, phone,
    ...(stripe_customer_id ? { stripe_customer_id } : {}),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  if (upErr) console.error("customer_accounts upsert", upErr);

  // 3. Verknüpfungen setzen
  if (linkLeadId) await supabase.from("leads").update({ user_id: userId }).eq("id", linkLeadId);
  if (linkBuchungId) await supabase.from("buchungen").update({ user_id: userId }).eq("id", linkBuchungId);
  if (linkAngebotId) await supabase.from("angebote").update({ user_id: userId }).eq("id", linkAngebotId);

  // Auch alle bestehenden Buchungen/Angebote/Leads ohne user_id zur selben E-Mail verknüpfen
  await supabase.from("leads").update({ user_id: userId }).is("user_id", null).ilike("email", email);
  await supabase.from("buchungen").update({ user_id: userId }).is("user_id", null).ilike("kunde_email", email);
  await supabase.from("angebote").update({ user_id: userId }).is("user_id", null).ilike("lead_email", email);

  // 4. Willkommens-Mail (nur beim ersten Mal sinnvoll, hier einfach via Flag)
  if (sendWelcome && !match) {
    await sendResend(email, "Dein Kundenportal ist bereit", welcomeMail(first_name || "", PORTAL_URL));
  }

  return new Response(JSON.stringify({ success: true, user_id: userId, new_account: !match }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});