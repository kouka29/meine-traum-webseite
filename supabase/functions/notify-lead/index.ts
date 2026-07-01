import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface Payload {
  name?: string;
  phone?: string;
  email?: string;
  branche?: string;
  ort?: string;
  message?: string;
  source_page?: string;
  source_cta?: string;
  company?: string; // honeypot
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Payload = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Honeypot — pretend success, do nothing
  if (body.company && body.company.trim().length > 0) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const branche = (body.branche || "").trim();
  const ort = (body.ort || "").trim();
  const message = (body.message || "").trim();
  const source_page = (body.source_page || "").trim();
  const source_cta = (body.source_cta || "").trim();

  if (!name && !phone) {
    return new Response(JSON.stringify({ error: "name or phone required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const TG_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const TG_CHAT = Deno.env.get("TELEGRAM_CHAT_ID");

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  let dbOk = false;
  try {
    const { error } = await supabase.from("leads").insert({
      first_name: name || null,
      phone: phone || null,
      email: email || null,
      company_name: "",
      branche: branche || null,
      ort: ort || null,
      message: message || null,
      source_page: source_page || null,
      source_cta: source_cta || null,
      notes: message || null,
      status: "new",
    });
    if (error) {
      console.error("DB insert failed", error);
    } else {
      dbOk = true;
    }
  } catch (e) {
    console.error("DB insert exception", e);
  }

  // Telegram
  let tgOk = false;
  try {
    if (!TG_TOKEN || !TG_CHAT) {
      console.error("Telegram secrets missing", { hasToken: !!TG_TOKEN, hasChat: !!TG_CHAT });
    } else {
      const ts = new Date().toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
      });
      const lines = ["🔔 <b>Neue Anfrage</b>"];
      if (name) lines.push(`👤 <b>Name:</b> ${esc(name)}`);
      if (phone) lines.push(`📞 <b>Telefon:</b> ${esc(phone)}`);
      if (email) lines.push(`✉️ <b>E-Mail:</b> ${esc(email)}`);
      if (branche) lines.push(`🔧 <b>Branche:</b> ${esc(branche)}`);
      if (ort) lines.push(`📍 <b>Ort:</b> ${esc(ort)}`);
      if (message) lines.push(`💬 <b>Nachricht:</b> ${esc(message)}`);
      if (source_page) lines.push(`🌐 <b>Seite:</b> ${esc(source_page)}`);
      if (source_cta) lines.push(`🎯 <b>Quelle:</b> ${esc(source_cta)}`);
      lines.push(`🕐 ${esc(ts)}`);

      const tgRes = await fetch(
        `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TG_CHAT,
            text: lines.join("\n"),
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        },
      );
      if (tgRes.ok) {
        const tgBody = await tgRes.text();
        console.log("Telegram sent OK", tgRes.status, tgBody.slice(0, 200));
        tgOk = true;
      } else {
        console.error("Telegram failed", tgRes.status, await tgRes.text());
      }
    }
  } catch (e) {
    console.error("Telegram exception", e);
  }

  if (!dbOk && !tgOk) {
    return new Response(JSON.stringify({ error: "delivery failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
